import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Separación entre páginas, en píxeles. Se usa también para calcular en qué
// página está el lector a partir del scroll, así que tiene que coincidir con
// el margen real de cada hoja.
const SEPARACION = 8;

// Cuánto se pinta por delante y por detrás de lo que se ve, en múltiplos de la
// altura del visor. Metro y medio de margen alcanza para que al deslizar
// rápido no aparezcan huecos, sin llenar la memoria de bitmaps.
const MARGEN_RENDER = "150% 0px";

const Pagina = memo(function Pagina({
  pageNumber,
  renderer,
  ancho,
  alto,
  visible,
  hits,
  registrar,
  onAmpliar,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !renderer) return undefined;

    if (!visible || !ancho) {
      renderer.release(canvas);
      return undefined;
    }

    renderer.request(pageNumber, canvas, ancho);
    return undefined;
  }, [renderer, pageNumber, visible, ancho]);

  useEffect(() => {
    const canvas = canvasRef.current;
    return () => renderer?.release(canvas);
  }, [renderer]);

  return (
    <div
      ref={registrar}
      data-page={pageNumber}
      onClick={() => onAmpliar(pageNumber)}
      className="relative mx-auto overflow-hidden bg-[#f4f1ec] shadow-lg shadow-black/30"
      style={{ width: ancho || undefined, height: alto || undefined }}
    >
      {/* El número queda debajo y el canvas lo tapa al pintarse. */}
      <span className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-black/25">
        {pageNumber}
      </span>

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
  );
});

/**
 * Lector de scroll vertical continuo.
 *
 * Es el modo del móvil. El hojeo con animación funciona bien con ratón y
 * pantalla ancha, pero en un teléfono lo natural es deslizar hacia abajo: el
 * catálogo se recorre como cualquier otra página del sitio, sin tener que
 * acertarle a la esquina de la hoja.
 *
 * Se expone `irA(pagina)` por ref en vez de sincronizar la posición con una
 * prop: si el scroll dependiera del estado, cada desplazamiento del usuario
 * pelearía contra el efecto que lo reposiciona.
 */
const ScrollReader = forwardRef(function ScrollReader(
  { numPages, aspect, renderer, highlights, paginaInicial, onPageChange, onAmpliar },
  ref
) {
  const contenedorRef = useRef(null);
  const nodosRef = useRef(new Map());
  const observerRef = useRef(null);
  const avisarRef = useRef(onPageChange);
  avisarRef.current = onPageChange;
  // Sólo se usa el valor inicial: es la página en la que venía el lector al
  // entrar en modo scroll (por ejemplo tras girar la tablet estando en el
  // libro). Después manda el scroll, no la prop.
  const paginaRef = useRef(paginaInicial || 1);

  const [visibles, setVisibles] = useState(() => new Set());
  const [ancho, setAncho] = useState(0);

  const alto = ancho ? Math.round(ancho / aspect) : 0;

  useLayoutEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return undefined;

    const medir = () => {
      const disponible = contenedor.clientWidth - 16;
      if (disponible <= 0) return;
      // Las variaciones de uno o dos píxeles (barra de scroll que aparece y
      // desaparece) no deben repintar las páginas.
      setAncho((prev) => (Math.abs(prev - disponible) < 3 ? prev : Math.floor(disponible)));
    };

    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(contenedor);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibles((prev) => {
          const siguiente = new Set(prev);
          let cambio = false;
          for (const entry of entries) {
            const pagina = Number(entry.target.dataset.page);
            if (entry.isIntersecting) {
              if (!siguiente.has(pagina)) {
                siguiente.add(pagina);
                cambio = true;
              }
            } else if (siguiente.delete(pagina)) {
              cambio = true;
            }
          }
          return cambio ? siguiente : prev;
        });
      },
      { root: contenedor, rootMargin: MARGEN_RENDER }
    );

    observerRef.current = observer;
    nodosRef.current.forEach((nodo) => observer.observe(nodo));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const registrar = useCallback((nodo) => {
    if (!nodo) return;
    nodosRef.current.set(Number(nodo.dataset.page), nodo);
    observerRef.current?.observe(nodo);
  }, []);

  // Página actual a partir del scroll. Todas las hojas miden lo mismo, así que
  // sale de una división en vez de consultar la posición de cada una.
  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor || !alto) return undefined;

    let pendiente = false;
    let ultima = 0;

    const calcular = () => {
      pendiente = false;
      const primera = nodosRef.current.get(1);
      if (!primera) return;

      const paso = alto + SEPARACION;
      const recorrido = contenedor.scrollTop - primera.offsetTop + alto / 2;
      const pagina = Math.min(numPages, Math.max(1, Math.floor(recorrido / paso) + 1));

      paginaRef.current = pagina;
      if (pagina !== ultima) {
        ultima = pagina;
        avisarRef.current?.(pagina);
      }
    };

    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(calcular);
    };

    contenedor.addEventListener("scroll", alDesplazar, { passive: true });
    calcular();
    return () => contenedor.removeEventListener("scroll", alDesplazar);
  }, [alto, numPages]);

  // Al cambiar el ancho cambia la altura de cada hoja, y el scroll que se
  // conservaba pasa a caer en otra página: girar el teléfono o cruzar el ancho
  // que separa el modo scroll del libro te dejaba a decenas de páginas de
  // distancia. Se vuelve a anclar en la que se estaba leyendo.
  useLayoutEffect(() => {
    if (!alto) return;
    const contenedor = contenedorRef.current;
    const nodo = nodosRef.current.get(paginaRef.current);
    if (contenedor && nodo) contenedor.scrollTop = nodo.offsetTop - SEPARACION;
  }, [alto]);

  useImperativeHandle(
    ref,
    () => ({
      irA(pageNumber, { suave = false } = {}) {
        const contenedor = contenedorRef.current;
        const objetivo = Math.min(Math.max(1, pageNumber), numPages);
        const nodo = nodosRef.current.get(objetivo);
        if (!contenedor || !nodo) return;
        paginaRef.current = objetivo;
        contenedor.scrollTo({
          top: nodo.offsetTop - SEPARACION,
          behavior: suave ? "smooth" : "auto",
        });
      },
    }),
    [numPages]
  );

  return (
    <div
      ref={contenedorRef}
      className="relative h-full w-full overflow-y-auto overscroll-contain px-2 py-2 scrollbar-thin scrollbar-track-ink scrollbar-thumb-ink-line"
    >
      <div className="flex flex-col items-center" style={{ gap: SEPARACION }}>
        {Array.from({ length: numPages }, (_, indice) => indice + 1).map((pagina) => (
          <Pagina
            key={pagina}
            pageNumber={pagina}
            renderer={renderer}
            ancho={ancho}
            alto={alto}
            visible={visibles.has(pagina)}
            hits={highlights.get(pagina)}
            registrar={registrar}
            onAmpliar={onAmpliar}
          />
        ))}
      </div>
    </div>
  );
});

export default ScrollReader;
