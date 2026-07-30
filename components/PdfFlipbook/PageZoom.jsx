import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, X } from "lucide-react";

const NIVELES = [1, 1.5, 2, 3];
const ZOOM_MAX = NIVELES[NIVELES.length - 1];

// Techo del render en píxeles CSS. La página se pinta una sola vez a esta
// resolución y el zoom sólo cambia el tamaño mostrado: así no hay parpadeo en
// blanco cada vez que se acerca o se aleja.
const ANCHO_RENDER_MAX = 1400;

/**
 * Lupa a pantalla completa de una página suelta.
 *
 * El libro está pensado para hojear; cuando el cliente quiere leer una
 * referencia o un precio necesita la página grande, con arrastre para moverse.
 */
function PageZoom({ pageNumber, numPages, renderer, aspect, hits, onClose, onChangePage }) {
  const areaRef = useRef(null);
  const canvasRef = useRef(null);
  const arrastre = useRef(null);

  const [base, setBase] = useState({ ancho: 0, alto: 0 });
  const [zoom, setZoom] = useState(1);

  // Tamaño con el que la página entra completa en el área disponible.
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return undefined;

    const medir = () => {
      const { width, height } = area.getBoundingClientRect();
      if (!width || !height) return;
      let alto = height - 16;
      let ancho = alto * aspect;
      if (ancho > width - 16) {
        ancho = width - 16;
        alto = ancho / aspect;
      }
      setBase({ ancho: Math.floor(ancho), alto: Math.floor(alto) });
    };

    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(area);
    return () => observer.disconnect();
  }, [aspect]);

  // Se pinta una vez por página, a la resolución máxima del zoom: acercar y
  // alejar sólo cambia el tamaño mostrado, así no hay parpadeo en cada paso.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !base.ancho || !renderer) return undefined;

    // Vaciar antes de pedir deja ver el indicador de carga y evita que se
    // quede a la vista la página anterior mientras llega la nueva.
    renderer.release(canvas);
    renderer.request(pageNumber, canvas, Math.min(base.ancho * ZOOM_MAX, ANCHO_RENDER_MAX));
    return undefined;
  }, [renderer, pageNumber, base.ancho]);

  useEffect(() => {
    const canvas = canvasRef.current;
    return () => renderer?.release(canvas);
  }, [renderer]);

  // Vuelve al encuadre completo al cambiar de página.
  useEffect(() => {
    setZoom(1);
    areaRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pageNumber]);

  useEffect(() => {
    const alTeclear = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && pageNumber < numPages) onChangePage(pageNumber + 1);
      if (event.key === "ArrowLeft" && pageNumber > 1) onChangePage(pageNumber - 1);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onClose, onChangePage, pageNumber, numPages]);

  const cambiarZoom = (paso) => {
    const indice = NIVELES.indexOf(zoom);
    const siguiente = NIVELES[Math.min(NIVELES.length - 1, Math.max(0, indice + paso))];
    setZoom(siguiente);
  };

  // Arrastre para desplazarse cuando la página no cabe en pantalla.
  const alBajarPuntero = (event) => {
    const area = areaRef.current;
    if (!area || zoom === 1) return;
    arrastre.current = {
      x: event.clientX,
      y: event.clientY,
      left: area.scrollLeft,
      top: area.scrollTop,
    };
    area.setPointerCapture(event.pointerId);
  };

  const alMoverPuntero = (event) => {
    const area = areaRef.current;
    if (!area || !arrastre.current) return;
    area.scrollLeft = arrastre.current.left - (event.clientX - arrastre.current.x);
    area.scrollTop = arrastre.current.top - (event.clientY - arrastre.current.y);
  };

  const alSoltarPuntero = (event) => {
    arrastre.current = null;
    areaRef.current?.releasePointerCapture?.(event.pointerId);
  };

  const ancho = Math.round(base.ancho * zoom);
  const alto = Math.round(base.alto * zoom);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-sm">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 sm:px-6">
        <span className="text-sm tabular-nums text-white/60">
          Página <span className="text-champagne">{pageNumber}</span> de {numPages}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => cambiarZoom(-1)}
            disabled={zoom === NIVELES[0]}
            aria-label="Alejar"
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-white/45">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => cambiarZoom(1)}
            disabled={zoom === ZOOM_MAX}
            aria-label="Acercar"
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar la lupa"
            className="ml-2 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={areaRef}
          onPointerDown={alBajarPuntero}
          onPointerMove={alMoverPuntero}
          onPointerUp={alSoltarPuntero}
          onPointerCancel={alSoltarPuntero}
          onDoubleClick={() => setZoom(zoom === 1 ? 2 : 1)}
          className={`h-full w-full overflow-auto overscroll-contain p-2 ${
            zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <div
            className="relative mx-auto bg-white shadow-2xl"
            style={{ width: ancho || undefined, height: alto || undefined }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4f1ec]">
              <Loader2 className="h-5 w-5 animate-spin text-black/25" />
            </div>

            <canvas ref={canvasRef} className="relative block h-full w-full" />

            {hits?.map((hit, index) => (
              <mark
                key={`${hit.x}-${hit.y}-${index}`}
                className="pointer-events-none absolute rounded-[2px] bg-champagne/40 shadow-[0_0_0_1.5px_#D8BC8A]"
                style={{
                  left: `${hit.x * 100}%`,
                  top: `${hit.y * 100}%`,
                  width: `${hit.w * 100}%`,
                  height: `${hit.h * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChangePage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          aria-label="Página anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/80 p-2.5 text-white/70 backdrop-blur transition-colors hover:border-champagne/40 hover:text-champagne disabled:opacity-20 sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onChangePage(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          aria-label="Página siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/80 p-2.5 text-white/70 backdrop-blur transition-colors hover:border-champagne/40 hover:text-champagne disabled:opacity-20 sm:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default PageZoom;
