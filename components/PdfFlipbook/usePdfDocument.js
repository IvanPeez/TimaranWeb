import { useEffect, useState } from "react";
import { pdfjsLib } from "./pdfjs";

const INITIAL = {
  status: "loading",
  progress: 0,
  doc: null,
  numPages: 0,
  // Proporción ancho/alto de la primera página. Se usa como referencia para
  // todo el libro; el valor inicial es sólo un marcador mientras carga.
  aspect: 0.75,
  error: null,
};

/**
 * Carga el PDF y expone el progreso de descarga. El catálogo pesa ~13 MB, así
 * que sin barra de progreso la pantalla se queda varios segundos en blanco y
 * parece rota.
 */
export function usePdfDocument(url) {
  const [state, setState] = useState(INITIAL);

  useEffect(() => {
    let cancelled = false;
    setState(INITIAL);

    const task = pdfjsLib.getDocument({ url });

    task.onProgress = ({ loaded, total }) => {
      if (cancelled || !total) return;
      setState((prev) =>
        prev.status === "loading"
          ? { ...prev, progress: Math.min(1, loaded / total) }
          : prev
      );
    };

    task.promise
      .then(async (doc) => {
        const first = await doc.getPage(1);
        const viewport = first.getViewport({ scale: 1 });
        if (cancelled) return;
        setState({
          status: "ready",
          progress: 1,
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
  }, [url]);

  return state;
}
