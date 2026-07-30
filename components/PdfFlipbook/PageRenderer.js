// Cola de renderizado de páginas a canvas.
//
// El catálogo tiene 93 páginas. Pintarlas todas costaría cientos de MB de
// bitmaps (cada canvas a 2x son ~4 MB), así que el visor sólo mantiene pintadas
// las páginas cercanas a la actual y libera el resto poniendo el canvas en 0x0,
// que es la única forma de que el navegador suelte la memoria del bitmap.
//
// Además pdf.js no admite dos render() simultáneos sobre la misma página y
// disparar 8 a la vez deja la UI a tirones, así que los trabajos pasan por una
// cola con concurrencia acotada.

const MAX_CONCURRENT = 2;

// Por encima de 2x el detalle ya no se percibe y el consumo de memoria se
// dispara en pantallas Retina/móviles de gama alta.
const MAX_DPR = 2;

export class PageRenderer {
  constructor(doc) {
    this.doc = doc;
    this.queue = [];
    this.running = 0;
    this.destroyed = false;
    // Trabajos vivos y anchos ya pintados, indexados por canvas: la misma
    // página puede estar en el libro, en una miniatura y en el zoom a la vez.
    this.tasks = new Map();
    this.painted = new WeakMap();
  }

  /**
   * Pinta `pageNumber` dentro de `canvas` para que se vea a `cssWidth` píxeles
   * de ancho. Resuelve en true si el canvas quedó pintado.
   */
  request(pageNumber, canvas, cssWidth) {
    if (this.destroyed || !canvas || !cssWidth) return Promise.resolve(false);
    if (this.painted.get(canvas) === cssWidth) return Promise.resolve(true);

    this._drop(canvas);

    return new Promise((resolve) => {
      this.queue.push({ pageNumber, canvas, cssWidth, resolve });
      this._drain();
    });
  }

  /** Suelta el canvas: cancela lo pendiente y libera la memoria del bitmap. */
  release(canvas) {
    if (!canvas) return;
    this._drop(canvas);
    this.painted.delete(canvas);
    canvas.width = 0;
    canvas.height = 0;
  }

  destroy() {
    this.destroyed = true;
    this.queue.forEach((job) => job.resolve(false));
    this.queue = [];
    this.tasks.forEach((task) => task.cancel());
    this.tasks.clear();
  }

  /** Cancela el trabajo (en cola o en curso) asociado a un canvas. */
  _drop(canvas) {
    this.queue = this.queue.filter((job) => {
      if (job.canvas !== canvas) return true;
      job.resolve(false);
      return false;
    });

    const task = this.tasks.get(canvas);
    if (task) {
      task.cancel();
      this.tasks.delete(canvas);
    }
  }

  _drain() {
    while (!this.destroyed && this.running < MAX_CONCURRENT && this.queue.length) {
      const job = this.queue.shift();
      this.running += 1;
      this._run(job)
        .then((ok) => job.resolve(ok))
        .catch(() => job.resolve(false))
        .finally(() => {
          this.running -= 1;
          this._drain();
        });
    }
  }

  async _run({ pageNumber, canvas, cssWidth }) {
    if (this.destroyed) return false;

    const page = await this.doc.getPage(pageNumber);
    if (this.destroyed) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: (cssWidth * dpr) / base.width });

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const context = canvas.getContext("2d", { alpha: false });
    // Fondo blanco explícito: sin él las páginas con transparencia salen negras
    // sobre el tema oscuro del sitio.
    const task = page.render({
      canvasContext: context,
      viewport,
      background: "#ffffff",
    });
    this.tasks.set(canvas, task);

    try {
      await task.promise;
      this.painted.set(canvas, cssWidth);
      return true;
    } catch (error) {
      // Cancelar es parte del flujo normal (el usuario pasó de página): no es
      // un fallo que deba escalar.
      if (error?.name !== "RenderingCancelledException") throw error;
      return false;
    } finally {
      if (this.tasks.get(canvas) === task) this.tasks.delete(canvas);
    }
  }
}
