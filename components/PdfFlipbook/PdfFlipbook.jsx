import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  Rows3,
  TriangleAlert,
  ZoomIn,
} from "lucide-react";

import FlipBook from "./FlipBook";
import PageZoom from "./PageZoom";
import SearchField from "./SearchField";
import ThumbnailStrip from "./ThumbnailStrip";
import { PageRenderer } from "./PageRenderer";
import { usePdfDocument } from "./usePdfDocument";
import { usePdfTextIndex, useSearchResults } from "./usePdfSearch";
import { ViewerProvider } from "./viewerContext";

// Por debajo de este ancho se muestra una sola página: dos páginas en un móvil
// dejan el texto ilegible.
const ANCHO_PLIEGO_DOBLE = 820;

const SIN_RESALTADOS = new Map();

/**
 * Calcula el tamaño de página que cabe en el área disponible.
 *
 * StPageFlip no admite cambiar el tamaño en caliente, así que el libro se
 * remonta cuando el resultado cambia de verdad. Por eso la medición se
 * amortigua y se ignoran las variaciones de pocos píxeles: sin eso, arrastrar
 * el borde de la ventana reconstruiría el libro decenas de veces.
 */
function useBookLayout(areaRef, aspect) {
  const [layout, setLayout] = useState({ pageWidth: 0, pageHeight: 0, portrait: false });

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return undefined;

    let temporizador = 0;

    const medir = () => {
      const { width, height } = area.getBoundingClientRect();
      const disponibleAncho = width - 24;
      const disponibleAlto = height - 16;
      if (disponibleAncho <= 0 || disponibleAlto <= 0) return;

      const portrait = width < ANCHO_PLIEGO_DOBLE;
      let pageWidth = portrait ? disponibleAncho : disponibleAncho / 2;
      let pageHeight = pageWidth / aspect;
      if (pageHeight > disponibleAlto) {
        pageHeight = disponibleAlto;
        pageWidth = pageHeight * aspect;
      }

      const siguiente = {
        pageWidth: Math.floor(pageWidth),
        pageHeight: Math.floor(pageHeight),
        portrait,
      };

      setLayout((prev) =>
        prev.portrait === siguiente.portrait &&
        Math.abs(prev.pageWidth - siguiente.pageWidth) < 4 &&
        Math.abs(prev.pageHeight - siguiente.pageHeight) < 4
          ? prev
          : siguiente
      );
    };

    medir();
    const observer = new ResizeObserver(() => {
      clearTimeout(temporizador);
      temporizador = setTimeout(medir, 160);
    });
    observer.observe(area);

    return () => {
      clearTimeout(temporizador);
      observer.disconnect();
    };
  }, [areaRef, aspect]);

  return layout;
}

/**
 * Visor de catálogos en PDF con efecto de hojeo y buscador de texto.
 *
 * Reemplaza al flipbook alojado en un tercero: el PDF se sirve desde el propio
 * sitio, se renderiza con pdf.js y el texto se indexa en el navegador, así que
 * la búsqueda funciona sobre el contenido real del catálogo.
 */
function PdfFlipbook({ fileUrl, downloadName = "catalogo.pdf", actions }) {
  const rootRef = useRef(null);
  const areaRef = useRef(null);
  const bookRef = useRef(null);
  const searchInputRef = useRef(null);
  const punteroRef = useRef(null);

  const { status, progress, doc, numPages, aspect, error } = usePdfDocument(fileUrl);
  const { pages: textIndex, indexed, total, ready } = usePdfTextIndex(doc, numPages);

  const [query, setQuery] = useState("");
  const [activeResult, setActiveResult] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [zoomPage, setZoomPage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // La búsqueda recorre el índice completo; diferirla mantiene fluido el tecleo.
  const deferredQuery = useDeferredValue(query);
  const { tokens, results, byPage } = useSearchResults(textIndex, deferredQuery);

  const layout = useBookLayout(areaRef, aspect);
  const { pageWidth, pageHeight, portrait } = layout;

  const renderer = useMemo(() => (doc ? new PageRenderer(doc) : null), [doc]);
  useEffect(() => () => renderer?.destroy(), [renderer]);

  // Páginas que el lector tiene delante. En pliego doble la portada va sola,
  // igual que en un catálogo impreso.
  const paginasVisibles = useMemo(() => {
    if (!numPages) return [];
    if (portrait || currentIndex === 0) return [Math.min(currentIndex + 1, numPages)];
    const derecha = currentIndex + 2;
    return derecha <= numPages ? [currentIndex + 1, derecha] : [currentIndex + 1];
  }, [currentIndex, portrait, numPages]);

  const paginaActual = paginasVisibles[0] ?? 1;
  const paginaFinalVisible = paginasVisibles[paginasVisibles.length - 1] ?? 1;

  const irAPagina = useCallback(
    (pageNumber) => {
      const flip = bookRef.current?.pageFlip?.();
      if (!flip || !numPages) return;
      const objetivo = Math.min(Math.max(1, Math.round(pageNumber)), numPages) - 1;
      // turnToPage emite el evento `flip`, así que currentIndex se sincroniza solo.
      flip.turnToPage(objetivo);
    },
    [numPages]
  );

  const hojear = useCallback((direccion) => {
    const flip = bookRef.current?.pageFlip?.();
    if (!flip) return;
    if (direccion > 0) flip.flipNext();
    else flip.flipPrev();
  }, []);

  // Si cambian los resultados, el puntero de coincidencia no puede quedar fuera.
  useEffect(() => {
    setActiveResult((prev) => (prev < results.length ? prev : 0));
  }, [results]);

  const seleccionarResultado = useCallback(
    (indice) => {
      if (!results.length) return;
      const normalizado = (indice + results.length) % results.length;
      setActiveResult(normalizado);
      irAPagina(results[normalizado].page);
    },
    [results, irAPagina]
  );

  const irAlSiguienteResultado = useCallback(() => {
    if (!results.length) return;
    // Si el lector ya está sobre la coincidencia activa, avanza a la próxima.
    const yaEstaAqui = results[activeResult]?.page === paginaActual ||
      results[activeResult]?.page === paginaFinalVisible;
    seleccionarResultado(yaEstaAqui ? activeResult + 1 : activeResult);
  }, [results, activeResult, paginaActual, paginaFinalVisible, seleccionarResultado]);

  const irAlResultadoAnterior = useCallback(
    () => seleccionarResultado(activeResult - 1),
    [activeResult, seleccionarResultado]
  );

  // Atajos de teclado: flechas para hojear y Ctrl/Cmd+F para buscar.
  useEffect(() => {
    const alTeclear = (event) => {
      const enCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName ?? "");

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (enCampo || zoomPage) return;

      if (event.key === "ArrowRight") hojear(1);
      if (event.key === "ArrowLeft") hojear(-1);
    };

    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [hojear, zoomPage]);

  useEffect(() => {
    const alCambiar = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);

  const alternarPantallaCompleta = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  };

  // Clic sobre el libro: abre la lupa de la página tocada. Se descarta si el
  // puntero se movió, para no confundir el arrastre de esquina con un clic.
  const alBajarPuntero = (event) => {
    punteroRef.current = { x: event.clientX, y: event.clientY };
  };

  const alClicarLibro = (event) => {
    const inicio = punteroRef.current;
    punteroRef.current = null;
    if (!inicio || !paginasVisibles.length) return;
    if (Math.hypot(event.clientX - inicio.x, event.clientY - inicio.y) > 8) return;
    if (bookRef.current?.pageFlip?.()?.getState?.() !== "read") return;

    if (paginasVisibles.length === 1) {
      setZoomPage(paginasVisibles[0]);
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    setZoomPage(event.clientX < left + width / 2 ? paginasVisibles[0] : paginasVisibles[1]);
  };

  const listo = status === "ready" && renderer && pageWidth > 0;

  const contexto = useMemo(
    () => ({
      renderer,
      pageWidth,
      windowFrom: Math.max(1, paginaActual - 2),
      windowTo: Math.min(numPages, paginaFinalVisible + 3),
      highlights: tokens.length ? byPage : SIN_RESALTADOS,
    }),
    [renderer, pageWidth, paginaActual, paginaFinalVisible, numPages, tokens.length, byPage]
  );

  const botonBarra =
    "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-champagne/40 hover:text-champagne disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60";

  return (
    <ViewerProvider value={contexto}>
      <div ref={rootRef} className="flex min-h-0 flex-1 flex-col bg-ink">
        {/* Barra de herramientas. El buscador vive aquí y nunca se oculta: es la
            única vía para llegar a un producto sin hojear 93 páginas. */}
        <div className="shrink-0 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2.5 sm:px-6">
            <SearchField
              query={query}
              onQueryChange={setQuery}
              tokens={tokens}
              results={results}
              activeIndex={activeResult}
              onSelect={seleccionarResultado}
              onPrev={irAlResultadoAnterior}
              onNext={irAlSiguienteResultado}
              indexed={indexed}
              total={total}
              ready={ready}
              inputRef={searchInputRef}
            />

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setThumbsOpen((prev) => !prev)}
                disabled={!listo}
                aria-pressed={thumbsOpen}
                aria-label="Ver todas las páginas"
                title="Ver todas las páginas"
                className={`${botonBarra} ${thumbsOpen ? "border-champagne/50 text-champagne" : ""}`}
              >
                <Rows3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomPage(paginaActual)}
                disabled={!listo}
                aria-label="Ampliar la página"
                title="Ampliar la página"
                className={botonBarra}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <a
                href={fileUrl}
                download={downloadName}
                aria-label="Descargar el catálogo en PDF"
                title="Descargar el catálogo en PDF"
                className={`${botonBarra} hidden sm:flex`}
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={alternarPantallaCompleta}
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                className={`${botonBarra} hidden sm:flex`}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Libro */}
        <div ref={areaRef} className="relative min-h-0 flex-1 overflow-hidden">
          {listo && (
            <>
              <div
                className="flex h-full w-full items-center justify-center px-3 py-2"
                onPointerDown={alBajarPuntero}
                onClick={alClicarLibro}
              >
                <div style={{ width: portrait ? pageWidth : pageWidth * 2, height: pageHeight }}>
                  <FlipBook
                    key={`${pageWidth}x${pageHeight}x${portrait}`}
                    bookRef={bookRef}
                    numPages={numPages}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    startIndex={currentIndex}
                    onFlip={setCurrentIndex}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => hojear(-1)}
                disabled={currentIndex === 0}
                aria-label="Página anterior"
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/70 p-2 text-white/70 backdrop-blur transition-colors hover:border-champagne/40 hover:text-champagne disabled:opacity-20 sm:left-3 sm:p-2.5"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => hojear(1)}
                disabled={paginaFinalVisible >= numPages}
                aria-label="Página siguiente"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-ink/70 p-2 text-white/70 backdrop-blur transition-colors hover:border-champagne/40 hover:text-champagne disabled:opacity-20 sm:right-3 sm:p-2.5"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-champagne" />
              <div className="w-full max-w-xs">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-champagne transition-[width] duration-200"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40">
                  Cargando catálogo {Math.round(progress * 100)}%
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <TriangleAlert className="h-7 w-7 text-champagne/70" />
              <p className="font-titleAlt text-2xl italic text-white">
                No pudimos abrir el catálogo
              </p>
              <p className="max-w-sm text-sm text-white/45">
                {error?.message || "Revisa tu conexión e inténtalo de nuevo."}
              </p>
              <a
                href={fileUrl}
                download={downloadName}
                className="mt-1 flex items-center gap-2 rounded-xl bg-champagne px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne-light"
              >
                <Download className="h-4 w-4" />
                Descargar el PDF
              </a>
            </div>
          )}
        </div>

        {/* Pie: recorrido del catálogo y salidas a WhatsApp */}
        <div className="shrink-0 border-t border-white/[0.07] bg-ink-soft">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="shrink-0 text-xs tabular-nums text-white/45">
                <span className="text-champagne">
                  {paginasVisibles.length > 1
                    ? `${paginaActual}–${paginaFinalVisible}`
                    : paginaActual}
                </span>
                {" / "}
                {numPages || "…"}
              </span>
              <input
                type="range"
                min={1}
                max={Math.max(numPages, 1)}
                value={paginaActual}
                disabled={!listo}
                aria-label="Ir a una página"
                onChange={(event) => irAPagina(Number(event.target.value))}
                className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-champagne disabled:opacity-30"
              />
            </div>

            {actions && <div className="flex shrink-0 justify-center">{actions}</div>}
          </div>
        </div>

        {thumbsOpen && listo && (
          <ThumbnailStrip
            numPages={numPages}
            renderer={renderer}
            aspect={aspect}
            currentPage={paginaActual}
            matchPages={byPage}
            onSelect={irAPagina}
            onClose={() => setThumbsOpen(false)}
          />
        )}

        {zoomPage && listo && (
          <PageZoom
            pageNumber={zoomPage}
            numPages={numPages}
            renderer={renderer}
            aspect={aspect}
            hits={tokens.length ? byPage.get(zoomPage) : undefined}
            onClose={() => setZoomPage(null)}
            onChangePage={(pagina) => {
              setZoomPage(pagina);
              irAPagina(pagina);
            }}
          />
        )}
      </div>
    </ViewerProvider>
  );
}

export default PdfFlipbook;
