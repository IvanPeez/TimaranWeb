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
import ScrollReader from "./ScrollReader";
import SearchField from "./SearchField";
import ThumbnailStrip from "./ThumbnailStrip";
import { PageRenderer } from "./PageRenderer";
import { usePdfDocument } from "./usePdfDocument";
import { usePdfTextIndex, useSearchResults } from "./usePdfSearch";
import { useUrlSinCache } from "./useUrlSinCache";
import { ViewerProvider } from "./viewerContext";
import { enlaceDescarga } from "../../utils/catalogos";

// Por debajo de este ancho se muestra una sola página: dos páginas en un móvil
// dejan el texto ilegible.
const ANCHO_PLIEGO_DOBLE = 820;

const SIN_RESALTADOS = new Map();

// Rueda del ratón. Un solo tope de rueda manda deltaY 100, así que 60 píxeles
// acumulados equivalen a un tope = una página; en trackpad, donde cada evento
// trae deltas mínimos, se van sumando hasta llegar al umbral.
const UMBRAL_RUEDA = 60;
// Tras esta pausa se considera que empieza un gesto nuevo y se descarta lo
// acumulado, para que dos empujones sueltos no se sumen en uno solo.
const PAUSA_RUEDA = 500;
const LINEA_EN_PX = 16;
const PANTALLA_EN_PX = 400;

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
 * Reemplaza al flipbook alojado en un tercero: el PDF se descarga desde el
 * Blob de Vercel, se renderiza con pdf.js y el texto se indexa en el navegador,
 * así que la búsqueda funciona sobre el contenido real del catálogo.
 */
function PdfFlipbook({ fileUrl, downloadName = "catalogo.pdf", actions }) {
  const rootRef = useRef(null);
  const areaRef = useRef(null);
  const bookRef = useRef(null);
  const lectorRef = useRef(null);
  const searchInputRef = useRef(null);
  const punteroRef = useRef(null);

  // El catálogo se pide con una marca de versión en la URL para que un PDF
  // recién subido se vea de una vez, sin esperar a que expire la caché del
  // navegador (ver utils/catalogos.js). Mientras se resuelve vale `undefined`,
  // que el visor trata como "cargando".
  const urlCatalogo = useUrlSinCache(fileUrl);
  // El botón de descarga no puede quedarse sin enlace ese instante: si todavía
  // no hay versión, se ofrece la URL tal cual.
  const urlDescarga = enlaceDescarga(urlCatalogo ?? fileUrl);

  const { status, progress, doc, numPages, aspect, error } = usePdfDocument(urlCatalogo);
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

  // Se crea y se destruye dentro del mismo efecto a propósito. Con useMemo, el
  // doble montaje de StrictMode destruía la instancia memorizada y la volvía a
  // entregar ya inutilizable: las páginas se quedaban en el marcador de carga.
  const [renderer, setRenderer] = useState(null);
  useEffect(() => {
    if (!doc) {
      setRenderer(null);
      return undefined;
    }
    const instancia = new PageRenderer(doc);
    setRenderer(instancia);
    return () => {
      instancia.destroy();
      setRenderer(null);
    };
  }, [doc]);

  // Se declara aquí arriba, antes de los efectos, porque varios lo usan en su
  // lista de dependencias: si estuviera más abajo, leerlo durante el render
  // reventaría con "Cannot access 'listo' before initialization".
  // En pantalla angosta el catálogo se lee desplazando hacia abajo, no pasando
  // hojas: en un teléfono el hojeo obliga a acertarle a la esquina de la
  // página, mientras que el scroll es el gesto que ya se usa en todo el sitio.
  const modoScroll = portrait;

  // El lector de scroll se mide solo, así que ahí no hace falta esperar a que
  // useBookLayout calcule el tamaño de hoja del libro.
  const listo =
    status === "ready" && Boolean(renderer) && (modoScroll || pageWidth > 0);

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
    (pageNumber, opciones) => {
      if (!numPages) return;
      const objetivo = Math.min(Math.max(1, Math.round(pageNumber)), numPages);

      if (modoScroll) {
        lectorRef.current?.irA(objetivo, opciones);
        // El indicador responde ya; el listener de scroll lo confirma después.
        setCurrentIndex(objetivo - 1);
        return;
      }

      // turnToPage emite el evento `flip`, así que currentIndex se sincroniza solo.
      bookRef.current?.pageFlip?.()?.turnToPage(objetivo - 1);
    },
    [numPages, modoScroll]
  );

  const hojear = useCallback(
    (direccion) => {
      if (modoScroll) {
        irAPagina(paginaActual + direccion, { suave: true });
        return;
      }
      const flip = bookRef.current?.pageFlip?.();
      if (!flip) return;
      if (direccion > 0) flip.flipNext();
      else flip.flipPrev();
    },
    [modoScroll, irAPagina, paginaActual]
  );

  const alCambiarPaginaScroll = useCallback((pagina) => setCurrentIndex(pagina - 1), []);

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

  // Rueda del ratón sobre el libro: hojea el catálogo.
  //
  // Va como listener nativo y no como onWheel de React porque hace falta
  // preventDefault y React registra `wheel` en modo pasivo, donde se ignora.
  useEffect(() => {
    // En modo scroll la rueda ya hace lo suyo: desplazar el lector.
    const area = areaRef.current;
    if (!area || !listo || zoomPage || modoScroll) return undefined;

    let acumulado = 0;
    let ultimo = 0;

    const alRodar = (event) => {
      // La tira de miniaturas se desplaza sola; ahí la rueda no debe hojear.
      if (event.target?.closest?.("[data-rueda-propia]")) return;

      event.preventDefault();

      const flip = bookRef.current?.pageFlip?.();
      if (!flip) return;

      // Mientras dura la animación se descarta todo lo acumulado: sin esto, un
      // giro largo de rueda encadena media docena de páginas de una pasada.
      if (flip.getState?.() !== "read") {
        acumulado = 0;
        return;
      }

      // deltaMode 1 son líneas y 2 son pantallas; se pasan a píxeles para que
      // el umbral signifique lo mismo en todos los navegadores.
      const escala = event.deltaMode === 1 ? LINEA_EN_PX : event.deltaMode === 2 ? PANTALLA_EN_PX : 1;
      const bruto =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const delta = bruto * escala;
      if (!delta) return;

      // Gesto nuevo si cambió el sentido o si hubo una pausa: se cuenta de cero.
      if (event.timeStamp - ultimo > PAUSA_RUEDA || Math.sign(delta) !== Math.sign(acumulado)) {
        acumulado = 0;
      }
      ultimo = event.timeStamp;
      acumulado += delta;

      if (Math.abs(acumulado) < UMBRAL_RUEDA) return;
      acumulado = 0;
      hojear(delta > 0 ? 1 : -1);
    };

    area.addEventListener("wheel", alRodar, { passive: false });
    return () => area.removeEventListener("wheel", alRodar);
  }, [hojear, listo, zoomPage, modoScroll]);

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
        {/* `relative z-40` no es decorativo: backdrop-blur crea un contexto de
            apilamiento y, sin z-index propio, el área del libro (posterior en el
            DOM) se dibujaba encima y se comía los clics en los resultados. */}
        <div className="relative z-40 shrink-0 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
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
              {fileUrl && (
                <a
                  href={urlDescarga}
                  download={downloadName}
                  aria-label="Descargar el catálogo en PDF"
                  title="Descargar el catálogo en PDF"
                  className={`${botonBarra} hidden sm:flex`}
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
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
          {listo && modoScroll && (
            <ScrollReader
              ref={lectorRef}
              numPages={numPages}
              aspect={aspect}
              renderer={renderer}
              highlights={contexto.highlights}
              paginaInicial={paginaActual}
              onPageChange={alCambiarPaginaScroll}
              onAmpliar={setZoomPage}
            />
          )}

          {listo && !modoScroll && (
            <>
              <div className="flex h-full w-full items-center justify-center px-3 py-2">
                {/* La lupa se abre sólo al tocar el libro: si el manejador
                    estuviera en el contenedor, un clic en el margen vacío
                    también la abriría. */}
                <div
                  style={{ width: pageWidth * 2, height: pageHeight }}
                  onPointerDown={alBajarPuntero}
                  onClick={alClicarLibro}
                >
                  <FlipBook
                    key={`${pageWidth}x${pageHeight}`}
                    bookRef={bookRef}
                    numPages={numPages}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    startIndex={currentIndex}
                    onFlip={setCurrentIndex}
                  />
                </div>
              </div>

              {/* Sólo en el libro: en el lector de scroll las flechas taparían
                  el contenido y el gesto ya es deslizar. */}
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
                href={urlDescarga}
                download={downloadName}
                className="mt-1 flex items-center gap-2 rounded-xl bg-champagne px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne-light"
              >
                <Download className="h-4 w-4" />
                Descargar el PDF
              </a>
            </div>
          )}

          {/* El catálogo quedó sin URL configurada: para el cliente esto es
              "no disponible", no un error suyo. El detalle técnico va a la
              consola, donde sí le sirve a quien despliega. */}
          {status === "unset" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <TriangleAlert className="h-7 w-7 text-champagne/70" />
              <p className="font-titleAlt text-2xl italic text-white">
                Catálogo no disponible
              </p>
              <p className="max-w-sm text-sm text-white/45">
                Estamos actualizando este catálogo. Escríbenos y te lo pasamos
                por WhatsApp mientras tanto.
              </p>
            </div>
          )}

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
        </div>

        {/* Pie: recorrido del catálogo y salidas a WhatsApp */}
        <div className="shrink-0 border-t border-white/[0.07] bg-ink-soft">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
            {/* Sin catálogo cargado, un "1 / …" con la barra vacía sólo
                confunde: el pie se queda con las salidas a WhatsApp. */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {listo && (
                <>
                  <span className="shrink-0 text-xs tabular-nums text-white/45">
                    <span className="text-champagne">
                      {paginasVisibles.length > 1
                        ? `${paginaActual}–${paginaFinalVisible}`
                        : paginaActual}
                    </span>
                    {" / "}
                    {numPages}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(numPages, 1)}
                    value={paginaActual}
                    aria-label="Ir a una página"
                    onChange={(event) => irAPagina(Number(event.target.value))}
                    className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-champagne"
                  />
                </>
              )}
            </div>

            {actions && <div className="flex shrink-0 justify-center">{actions}</div>}
          </div>
        </div>

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
