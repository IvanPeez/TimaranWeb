import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Search, X } from "lucide-react";
import { normalize } from "./pdfjs";

/** Parte el texto en trozos marcando las coincidencias de la búsqueda. */
function resaltar(texto, tokens) {
  if (!tokens.length) return texto;

  // normalize() conserva la longitud, así que los índices del texto sin tildes
  // sirven tal cual para cortar el texto original.
  const norm = normalize(texto);
  const marcas = [];

  for (const token of tokens) {
    let desde = 0;
    for (;;) {
      const at = norm.indexOf(token, desde);
      if (at < 0) break;
      marcas.push([at, at + token.length]);
      desde = at + token.length;
    }
  }

  if (!marcas.length) return texto;

  marcas.sort((a, b) => a[0] - b[0]);
  const fusionadas = [];
  for (const marca of marcas) {
    const previa = fusionadas[fusionadas.length - 1];
    if (previa && marca[0] <= previa[1]) previa[1] = Math.max(previa[1], marca[1]);
    else fusionadas.push([...marca]);
  }

  const partes = [];
  let cursor = 0;
  fusionadas.forEach(([inicio, fin], indice) => {
    if (inicio > cursor) partes.push(texto.slice(cursor, inicio));
    partes.push(
      <mark key={indice} className="bg-champagne/30 text-champagne-light">
        {texto.slice(inicio, fin)}
      </mark>
    );
    cursor = fin;
  });
  if (cursor < texto.length) partes.push(texto.slice(cursor));

  return partes;
}

/**
 * Buscador del catálogo. Siempre visible: es la única forma de llegar a un
 * producto concreto sin hojear 93 páginas.
 */
function SearchField({
  query,
  onQueryChange,
  tokens,
  results,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  indexed,
  total,
  ready,
  inputRef,
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  const hayConsulta = query.trim().length > 0;
  const sinResultados = hayConsulta && ready && results.length === 0;

  // Cierra el panel al hacer clic fuera; el input sigue en pantalla.
  useEffect(() => {
    if (!abierto) return undefined;
    const alClicar = (event) => {
      if (!contenedorRef.current?.contains(event.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", alClicar);
    return () => document.removeEventListener("mousedown", alClicar);
  }, [abierto]);

  const manejarTecla = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) onPrev();
      else onNext();
      setAbierto(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      if (abierto) setAbierto(false);
      else onQueryChange("");
    }
  };

  return (
    <div ref={contenedorRef} className="relative min-w-0 flex-1 lg:max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Buscar en el catálogo…"
            aria-label="Buscar en el catálogo"
            onChange={(event) => {
              onQueryChange(event.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            onKeyDown={manejarTecla}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-white/35 focus:border-champagne/50 focus:outline-none focus:ring-1 focus:ring-champagne/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {hayConsulta && (
            <button
              type="button"
              onClick={() => {
                onQueryChange("");
                inputRef?.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hayConsulta && (
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1">
            <span className="whitespace-nowrap px-1 text-xs tabular-nums text-white/55">
              {results.length ? `${activeIndex + 1}/${results.length}` : "0"}
            </span>
            <button
              type="button"
              onClick={onPrev}
              disabled={!results.length}
              aria-label="Coincidencia anterior"
              className="rounded-lg p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!results.length}
              aria-label="Coincidencia siguiente"
              className="rounded-lg p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {abierto && hayConsulta && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-ink-card/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-3 py-2">
            <span className="text-xs text-white/45">
              <span className="text-champagne">{results.length}</span>{" "}
              {results.length === 1 ? "página" : "páginas"}
            </span>
            {!ready && (
              <span className="flex items-center gap-1.5 text-[11px] text-white/35">
                <Loader2 className="h-3 w-3 animate-spin" />
                Indexando {indexed}/{total}
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto overscroll-contain">
            {results.map((resultado, indice) => (
              <button
                key={resultado.page}
                type="button"
                onClick={() => {
                  onSelect(indice);
                  setAbierto(false);
                }}
                className={`flex w-full items-start gap-3 border-b border-white/[0.05] px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-white/[0.06] ${
                  indice === activeIndex ? "bg-champagne/[0.08]" : ""
                }`}
              >
                <span className="mt-0.5 shrink-0 rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[11px] tabular-nums text-champagne">
                  {resultado.page}
                </span>
                <span className="line-clamp-2 text-xs leading-relaxed text-white/60">
                  {resaltar(resultado.snippet, tokens)}
                </span>
              </button>
            ))}

            {sinResultados && (
              <p className="px-3 py-6 text-center text-xs text-white/40">
                No encontramos «{query.trim()}» en el catálogo.
                <br />
                Prueba con otra palabra o escríbenos por WhatsApp.
              </p>
            )}

            {hayConsulta && !ready && results.length === 0 && (
              <p className="flex items-center justify-center gap-2 px-3 py-6 text-center text-xs text-white/40">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Buscando… {indexed}/{total} páginas
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchField;
