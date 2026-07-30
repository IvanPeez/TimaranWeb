import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const ANCHO_MINIATURA = 74;

function Miniatura({ pageNumber, renderer, visible, activa, coincide, alto, onSelect, registrar }) {
  const canvasRef = useRef(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return undefined;

    let vivo = true;
    renderer.request(pageNumber, canvas, ANCHO_MINIATURA).then((ok) => {
      if (vivo && ok) setPainted(true);
    });

    return () => {
      vivo = false;
    };
  }, [renderer, pageNumber, visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    return () => renderer.release(canvas);
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
        <canvas ref={canvasRef} className="block h-full w-full" />
        {!painted && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black/25">
            {pageNumber}
          </span>
        )}
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
    <div className="border-t border-white/[0.07] bg-ink-soft">
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
