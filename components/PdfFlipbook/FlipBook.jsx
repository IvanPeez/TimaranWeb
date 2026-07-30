import React, { useCallback, useMemo, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import BookPage from "./BookPage";

/**
 * Envoltorio de react-pageflip.
 *
 * Dos cuidados que la librería impone:
 *
 * 1. Los hijos se memorizan por cantidad de páginas. react-pageflip vuelve a
 *    inicializar StPageFlip cada vez que cambia la identidad del array de
 *    hijos, y eso corta la animación en curso. Las páginas se actualizan solas
 *    leyendo el contexto del visor.
 * 2. Los callbacks se registran una única vez, al montar. Se pasan envueltos en
 *    una ref para que el libro siempre llame a la versión más reciente sin
 *    tener que re-suscribir los eventos.
 */
function FlipBook({
  bookRef,
  numPages,
  pageWidth,
  pageHeight,
  startIndex,
  onFlip,
  onChangeOrientation,
  onInit,
}) {
  const handlers = useRef({});
  handlers.current = { onFlip, onChangeOrientation, onInit };

  const handleFlip = useCallback((e) => handlers.current.onFlip?.(e.data), []);
  const handleOrientation = useCallback(
    (e) => handlers.current.onChangeOrientation?.(e.data),
    []
  );
  const handleInit = useCallback((e) => handlers.current.onInit?.(e.data), []);

  const pages = useMemo(
    () =>
      Array.from({ length: numPages }, (_, index) => (
        <BookPage
          key={index + 1}
          pageNumber={index + 1}
          // Portada y contraportada rígidas: giran como tapa, igual que un
          // catálogo impreso.
          density={index === 0 || index === numPages - 1 ? "hard" : "soft"}
        />
      )),
    [numPages]
  );

  return (
    <HTMLFlipBook
      ref={bookRef}
      width={pageWidth}
      height={pageHeight}
      size="fixed"
      autoSize={false}
      usePortrait
      showCover
      drawShadow
      maxShadowOpacity={0.35}
      flippingTime={620}
      startPage={startIndex}
      startZIndex={0}
      useMouseEvents
      showPageCorners
      // El clic queda libre para abrir la lupa; para pasar de página están el
      // arrastre de esquina, el deslizamiento y los controles del visor.
      disableFlipByClick
      clickEventForward={false}
      // El visor ocupa una altura fija: dejar que el libro capture el scroll
      // del móvil sólo genera rebotes.
      mobileScrollSupport={false}
      swipeDistance={28}
      className="select-none"
      onFlip={handleFlip}
      onChangeOrientation={handleOrientation}
      onInit={handleInit}
    >
      {pages}
    </HTMLFlipBook>
  );
}

export default FlipBook;
