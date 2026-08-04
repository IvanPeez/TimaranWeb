import { useEffect, useState } from "react";
import { pdfjsLib } from "./pdfjs";

const INITIAL = {
  status: "loading",
  doc: null,
  numPages: 0,
  // Proporción ancho/alto de la primera página. Se usa como referencia para
  // todo el libro; el valor inicial es sólo un marcador mientras carga.
  aspect: 0.75,
  error: null,
};

/**
 * Abre el catálogo que ya está en memoria.
 *
 * Recibe los BYTES y no una URL a propósito. Dándole la URL, pdf.js hace la
 * petición él mismo —y con peticiones parciales por rangos, que ni siquiera se
 * pueden guardar en Cache Storage—, así que el archivo se bajaría del Blob en
 * cada apertura y no habría forma de reutilizar lo ya descargado. Quién trae
 * esos bytes, de la caché local o de la red, lo decide useCatalogo; aquí sólo
 * se interpretan.
 *
 * La barra de progreso vive por eso en useCatalogo: el avance que importa es el
 * de la descarga, y cuando el catálogo sale de la copia guardada no hay
 * descarga que mostrar.
 */
export function usePdfDocument(datos) {
  const [state, setState] = useState(INITIAL);

  useEffect(() => {
    // Todavía no hay archivo: se está consultando la versión, descargando, o el
    // catálogo no está configurado. Todos esos casos los distingue y los pinta
    // el visor con el estado de useCatalogo.
    if (!datos) {
      setState(INITIAL);
      return undefined;
    }

    let cancelled = false;
    setState(INITIAL);

    // Va una COPIA de los bytes: pdf.js transfiere el búfer al worker y lo deja
    // inutilizable (detached). El original es la copia del catálogo que se
    // conserva para el botón de descarga y para poder reabrir el documento sin
    // volver a pedirle nada al Blob.
    const task = pdfjsLib.getDocument({ data: datos.slice() });

    task.promise
      .then(async (doc) => {
        const first = await doc.getPage(1);
        const viewport = first.getViewport({ scale: 1 });
        if (cancelled) return;
        setState({
          status: "ready",
          doc,
          numPages: doc.numPages,
          aspect: viewport.width / viewport.height,
          error: null,
        });
      })
      .catch((error) => {
        // Al desmontar se destruye la tarea y pdf.js rechaza la promesa: no es
        // un error real que deba pintar la pantalla de fallo.
        if (cancelled) return;
        setState({ ...INITIAL, status: "error", error });
      });

    return () => {
      cancelled = true;
      // destroy() de la tarea también libera el documento asociado.
      task.destroy().catch(() => {});
    };
  }, [datos]);

  return state;
}
