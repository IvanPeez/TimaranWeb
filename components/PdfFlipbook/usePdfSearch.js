import { useEffect, useMemo, useState } from "react";
import { normalize, pdfjsLib, tokenize } from "./pdfjs";

// Cada cuántas páginas se publica el índice parcial. Publicar en cada página
// haría re-renderizar la lista de resultados 93 veces durante la indexación.
const LOTE = 8;

// Contexto (en caracteres) alrededor de la coincidencia dentro del fragmento.
const SNIPPET_ANTES = 45;
const SNIPPET_DESPUES = 75;

/**
 * Extrae el texto de una página junto con la caja de cada fragmento.
 *
 * Las cajas se guardan en fracciones (0..1) del tamaño de la página, no en
 * píxeles: así el resaltado sirve igual en el libro, en la miniatura y en el
 * zoom, sin recalcular nada cuando cambia la escala de render.
 */
async function leerPagina(doc, number) {
  const page = await doc.getPage(number);
  const viewport = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();

  const items = [];
  for (const item of content.items) {
    if (!item.str || !item.str.trim()) continue;

    // Combina la matriz del viewport con la del texto para obtener la posición
    // ya en coordenadas de pantalla (el viewport invierte el eje Y del PDF).
    const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
    const alto = Math.hypot(tx[2], tx[3]) || item.height || 0;

    items.push({
      text: item.str,
      norm: normalize(item.str),
      x: tx[4] / viewport.width,
      // tx[5] es la línea base; la caja arranca una altura de fuente más arriba.
      y: (tx[5] - alto) / viewport.height,
      w: (item.width || 0) / viewport.width,
      h: alto / viewport.height,
    });
  }

  const text = items
    .map((item) => item.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  page.cleanup();

  return { number, text, norm: normalize(text), items };
}

/**
 * Arma el índice de texto de todo el PDF en segundo plano.
 *
 * Se cede el control entre página y página para no congelar la interfaz: el
 * usuario puede hojear y buscar mientras se termina de indexar, y la UI avisa
 * cuántas páginas van.
 */
export function usePdfTextIndex(doc, numPages) {
  const [pages, setPages] = useState([]);
  const [indexed, setIndexed] = useState(0);

  useEffect(() => {
    setPages([]);
    setIndexed(0);
    if (!doc || !numPages) return undefined;

    let cancelled = false;
    const acumulado = [];

    (async () => {
      for (let number = 1; number <= numPages; number += 1) {
        if (cancelled) return;

        try {
          acumulado.push(await leerPagina(doc, number));
        } catch {
          // Una página ilegible no debe abortar el índice completo.
          acumulado.push({ number, text: "", norm: "", items: [] });
        }

        if (cancelled) return;
        setIndexed(number);
        if (number % LOTE === 0 || number === numPages) setPages([...acumulado]);

        // Devuelve el hilo al navegador antes de seguir con la próxima página.
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [doc, numPages]);

  return {
    pages,
    indexed,
    total: numPages,
    ready: numPages > 0 && indexed >= numPages,
  };
}

/** Fragmento de contexto con la coincidencia adentro, para la lista de resultados. */
function armarSnippet(page, token) {
  const at = page.norm.indexOf(token);
  if (at < 0) return page.text.slice(0, 110);

  const desde = Math.max(0, at - SNIPPET_ANTES);
  const hasta = Math.min(page.text.length, at + token.length + SNIPPET_DESPUES);

  return [
    desde > 0 ? "…" : "",
    page.text.slice(desde, hasta).trim(),
    hasta < page.text.length ? "…" : "",
  ].join("");
}

/**
 * Filtra el índice con la consulta.
 *
 * Una página entra si contiene *todas* las palabras buscadas (no importa el
 * orden), igual que el filtro del catálogo de esencias. Devuelve además las
 * cajas de cada coincidencia para resaltarlas sobre la página.
 */
export function useSearchResults(pages, query) {
  return useMemo(() => {
    const tokens = tokenize(query);
    if (!tokens.length) return { tokens: [], results: [], byPage: new Map() };

    const results = [];

    for (const page of pages) {
      if (!page.norm || !tokens.every((token) => page.norm.includes(token))) {
        continue;
      }

      const hits = [];
      for (const item of page.items) {
        const largo = item.norm.length;
        if (!largo) continue;

        for (const token of tokens) {
          let desde = 0;
          for (;;) {
            const at = item.norm.indexOf(token, desde);
            if (at < 0) break;
            // La caja del fragmento se reparte proporcionalmente entre sus
            // caracteres: suficiente para señalar dónde está la coincidencia.
            hits.push({
              x: item.x + (item.w * at) / largo,
              y: item.y,
              w: (item.w * token.length) / largo,
              h: item.h,
            });
            desde = at + token.length;
          }
        }
      }

      results.push({
        page: page.number,
        hits,
        snippet: armarSnippet(page, tokens[0]),
      });
    }

    return {
      tokens,
      results,
      byPage: new Map(results.map((result) => [result.page, result.hits])),
    };
  }, [pages, query]);
}
