// Punto único de entrada a pdf.js para toda la app.
//
// El worker se importa con `?url` en vez de una ruta escrita a mano: así Vite
// lo emite como asset del build y le antepone el `base` correcto (GitHub Pages
// sirve bajo /TimaranWeb/ y Vercel bajo /). Con una ruta fija, uno de los dos
// entornos quedaba con el worker en 404 y pdf.js caía al modo sin worker,
// bloqueando el hilo principal en cada página.
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export { pdfjsLib };

/**
 * Normaliza texto para búsqueda: sin tildes y en minúscula.
 *
 * El catálogo está diagramado en mayúsculas y con acentos ("ATOMIZADOR",
 * "CATÁLOGO", "VÁLVULA") pero nadie escribe así al buscar. Descomponer con NFD
 * y borrar las marcas conserva la longitud de la cadena, así los índices de una
 * coincidencia siguen sirviendo para ubicar el resaltado sobre el texto real.
 */
export const normalize = (value = "") =>
  value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Parte la consulta en palabras sueltas: la búsqueda exige que estén todas. */
export const tokenize = (query = "") =>
  normalize(query)
    .split(/\s+/)
    .filter(Boolean);
