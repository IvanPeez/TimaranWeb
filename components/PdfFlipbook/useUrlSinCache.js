import { useEffect, useState } from "react";
import { urlSinCache } from "../../utils/catalogos";

/**
 * Resuelve la URL del catálogo con su marca de versión antes de descargarlo.
 *
 * Devuelve `undefined` mientras la averigua. No se devuelve la URL sin versión
 * como valor provisional a propósito: pdf.js empezaría a bajar los 15 MB del
 * archivo equivocado y habría que tirar esa descarga a la basura al llegar la
 * versión buena. La espera es un HEAD, unos cientos de bytes.
 */
export function useUrlSinCache(url) {
  const [resuelta, setResuelta] = useState(undefined);

  useEffect(() => {
    // Sin URL configurada no hay nada que consultar; se pasa tal cual para que
    // el visor muestre el aviso de catálogo sin configurar.
    if (!url) {
      setResuelta(url);
      return undefined;
    }

    let cancelado = false;
    const controlador = new AbortController();

    setResuelta(undefined);

    urlSinCache(url, { signal: controlador.signal }).then((versionada) => {
      if (!cancelado) setResuelta(versionada);
    });

    return () => {
      cancelado = true;
      controlador.abort();
    };
  }, [url]);

  return resuelta;
}
