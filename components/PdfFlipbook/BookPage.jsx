import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useViewer } from "./viewerContext";

/**
 * Una hoja del libro.
 *
 * El div externo es el nodo que StPageFlip toma prestado para animar, así que
 * no lleva estilos en línea: la librería reescribe `style.cssText` al ocultar
 * páginas y borraría cualquier cosa puesta ahí. Todo se estiliza con clases.
 *
 * El canvas se pinta sólo cuando la página entra en la ventana activa y se
 * libera al salir, para no acumular decenas de bitmaps en memoria.
 */
const BookPage = memo(
  forwardRef(function BookPage({ pageNumber, density }, ref) {
    const { renderer, pageWidth, windowFrom, windowTo, highlights } = useViewer();
    const canvasRef = useRef(null);
    const [painted, setPainted] = useState(false);

    const activa = pageNumber >= windowFrom && pageNumber <= windowTo;
    const hits = highlights.get(pageNumber);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return undefined;

      if (!activa || !pageWidth) {
        renderer.release(canvas);
        setPainted(false);
        return undefined;
      }

      let vivo = true;
      renderer.request(pageNumber, canvas, pageWidth).then((ok) => {
        if (vivo && ok) setPainted(true);
      });

      return () => {
        vivo = false;
      };
    }, [renderer, pageNumber, activa, pageWidth]);

    // El canvas se captura al montar: en la limpieza de desmontaje la ref ya
    // puede venir en null y la memoria quedaría retenida.
    useEffect(() => {
      const canvas = canvasRef.current;
      return () => renderer.release(canvas);
    }, [renderer]);

    return (
      <div ref={ref} className="bg-white" data-density={density}>
        <div className="relative h-full w-full overflow-hidden bg-white">
          {/* StPageFlip inyecta `position:absolute; width:100%; height:100%`
              para todo canvas dentro del libro, así que este llena la hoja. */}
          <canvas ref={canvasRef} aria-hidden="true" />

          {!painted && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4f1ec]">
              <span className="text-xs uppercase tracking-[0.2em] text-black/25">
                {pageNumber}
              </span>
            </div>
          )}

          {painted &&
            hits?.map((hit, index) => (
              <mark
                key={`${hit.x}-${hit.y}-${index}`}
                className="pointer-events-none absolute rounded-[2px] bg-champagne/55 mix-blend-multiply"
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
    );
  })
);

export default BookPage;
