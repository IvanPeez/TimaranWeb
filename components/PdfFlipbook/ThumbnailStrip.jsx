import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const ANCHO_MINIATURA = 54;

// Los eventos de rueda con deltaMode 1 vienen en líneas, no en píxeles.
const LINEA_EN_PX = 16;

function Miniatura({ pageNumber, renderer, visible, activa, coincide, alto, onSelect, registrar }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible || !renderer) return undefined;

    renderer.request(pageNumber, canvas, ANCHO_MINIATURA);
    return undefined;
  }, [renderer, pageNumber, visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    return () => renderer?.release(canvas);
  }, [renderer]);

  return (
    <button
      type="button"
      ref={registrar}
      data-page={pageNumber}
      onClick={() => onSelect(pageNumber)}
      aria-label={`Ir a la página ${pageNumber}`}
      aria-current={activa ? "true" : undefined}
      className="group flex shrink-0 flex-col items-center gap-1"
    >
      <span
        className={`relative block overflow-hidden rounded-sm border bg-[#f4f1ec] transition-colors ${
          activa
            ? "border-champagne ring-1 ring-champagne"
            : coincide
              ? "border-champagne/50"
              : "border-white/10 group-hover:border-white/35"
        }`}
        style={{ width: ANCHO_MINIATURA, height: alto }}
      >
        {/* Igual que en el libro: el número queda debajo y el canvas lo tapa
            al pintarse, sin depender de ningún estado intermedio. */}
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black/25">
          {pageNumber}
        </span>
        <canvas ref={canvasRef} className="relative block h-full w-full" />
        {coincide && (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-champagne" />
        )}
      </span>
      <span
        className={`text-[10px] tabular-nums ${
          activa ? "text-champagne" : "text-white/35"
        }`}
      >
        {pageNumber}
      </span>
    </button>
  );
}

/**
 * Tira de miniaturas para saltar a cualquier página.
 *
 * Se pintan sólo las que entran en pantalla: 93 miniaturas de golpe son casi un
 * segundo de bloqueo en móvil. Cuando hay búsqueda activa, las páginas con
 * coincidencias quedan marcadas para ubicarlas de un vistazo.
 */
function ThumbnailStrip({ numPages, renderer, aspect, currentPage, matchPages, onSelect, onClose }) {
  const contenedorRef = useRef(null);
  const observerRef = useRef(null);
  const nodosRef = useRef(new Set());
  const [visibles, setVisibles] = useState(() => new Set());

  const alto = Math.round(ANCHO_MINIATURA / aspect);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibles((prev) => {
          let cambio = false;
          const siguiente = new Set(prev);
          for (const entry of entries) {
            const page = Number(entry.target.dataset.page);
            if (entry.isIntersecting && !siguiente.has(page)) {
              siguiente.add(page);
              cambio = true;
            }
          }
          return cambio ? siguiente : prev;
        });
      },
      { root: contenedorRef.current, rootMargin: "0px 300px" }
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
    nodosRef.current.add(nodo);
    observerRef.current?.observe(nodo);
  }, []);

  // La tira sólo desborda en horizontal y el navegador no convierte solo la
  // rueda vertical en desplazamiento lateral, así que sin esto la rueda encima
  // de las miniaturas no hacía absolutamente nada.
  const alRodar = (event) => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const delta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (!delta) return;
    contenedor.scrollLeft += delta * (event.deltaMode === 1 ? LINEA_EN_PX : 1);
  };

  // Al abrir la tira, centra la página en la que está el lector.
  useEffect(() => {
    const contenedor = contenedorRef.current;
    const activa = contenedor?.querySelector(`[data-page="${currentPage}"]`);
    activa?.scrollIntoView({ block: "nearest", inline: "center" });
    // Sólo al montar: mientras la tira está abierta, mover el scroll bajo el
    // dedo del usuario sería molesto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Panel flotante sobre el libro, no una fila más del layout: si ocupara
    // altura propia, el área del libro cambiaría de tamaño y StPageFlip tendría
    // que reconstruirse entero cada vez que se abre o se cierra la tira.
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/[0.07] bg-ink-soft/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 pt-2 sm:px-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">
          {matchPages.size > 0
            ? `${matchPages.size} de ${numPages} páginas coinciden`
            : `${numPages} páginas`}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar miniaturas"
          className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={contenedorRef}
        // Marca para que la rueda del ratón desplace la tira en vez de hojear
        // el libro que está detrás.
        data-rueda-propia=""
        onWheel={alRodar}
        className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 scrollbar-thin scrollbar-track-ink scrollbar-thumb-ink-line sm:px-6"
      >
        {Array.from({ length: numPages }, (_, index) => index + 1).map((page) => (
          <Miniatura
            key={page}
            pageNumber={page}
            renderer={renderer}
            visible={visibles.has(page)}
            activa={page === currentPage}
            coincide={matchPages.has(page)}
            alto={alto}
            onSelect={onSelect}
            registrar={registrar}
          />
        ))}
      </div>
    </div>
  );
}

export default ThumbnailStrip;
