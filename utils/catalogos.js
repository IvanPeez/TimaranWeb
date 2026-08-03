// Ubicación de los catálogos en PDF.
//
// Los archivos viven en el Blob de Vercel, no en el repositorio: pesan más de
// 10 MB cada uno y se reemplazan cada temporada. Tenerlos en `public/` obligaba
// a versionar binarios enormes y a redesplegar el sitio entero sólo para
// cambiar un precio; ahora se sube el PDF nuevo al storage y listo.
//
// Se configuran por variable de entorno (Vite sólo expone las que empiezan por
// VITE_). Ver .env.example para el detalle y el comando de subida.

export const PDF_ENVASES = import.meta.env.VITE_CATALOGO_ENVASES_PDF || "";

export const PDF_ESENCIAS = import.meta.env.VITE_CATALOGO_ESENCIAS_PDF || "";

/** Agrega un parámetro a la query de una URL, tenga o no `?` ya puesto. */
export const conParametro = (url, clave, valor) => {
  if (!url) return url;
  const separador = url.includes("?") ? "&" : "?";
  return `${url}${separador}${encodeURIComponent(clave)}=${encodeURIComponent(valor)}`;
};

/**
 * Enlace de descarga de un PDF alojado en el Blob.
 *
 * El atributo `download` de un <a> se ignora cuando el archivo es de otro
 * origen, así que el navegador abriría el PDF en vez de bajarlo. El Blob de
 * Vercel resuelve esto con `?download=1`, que fuerza el Content-Disposition.
 */
export const enlaceDescarga = (url) => conParametro(url, "download", "1");

/**
 * Huella del contenido a partir de las cabeceras de la respuesta.
 *
 * Se usan `last-modified` y `content-length` y no el `etag`, que sería lo
 * natural: en una petición de otro origen el navegador sólo deja leer las
 * cabeceras de la lista blanca de CORS, y el Blob no publica
 * `access-control-expose-headers`. `etag` queda fuera; estas dos no.
 *
 * Ambas son estables mientras el archivo no cambie (se sirven igual en un HIT
 * y en un MISS de la CDN), así que la huella sólo se mueve cuando de verdad se
 * subió un catálogo nuevo.
 */
const huella = (respuesta) => {
  const partes = [];

  const modificado = Date.parse(respuesta.headers.get("last-modified") ?? "");
  if (Number.isFinite(modificado)) {
    // A segundos y en base 36 para que el parámetro no ocupe media URL.
    partes.push(Math.floor(modificado / 1000).toString(36));
  }

  const tamano = Number(respuesta.headers.get("content-length"));
  if (Number.isFinite(tamano) && tamano > 0) partes.push(tamano.toString(36));

  return partes.join("-") || null;
};

/**
 * URL del catálogo con una marca de versión que se mueve al cambiar el archivo.
 *
 * El problema: el Blob sirve los PDF con `cache-control: public, max-age=...`
 * de días o semanas. Cuando se re-sube el catálogo sobre el mismo pathname la
 * CDN se actualiza en menos de un minuto, pero el navegador de quien ya lo vio
 * ni siquiera pregunta: sigue mostrando el PDF viejo hasta que vence ese
 * max-age. Es lo que hacía que un precio corregido tardara semanas en verse.
 *
 * La solución de Vercel para esto es agregarle un parámetro distinto a la URL,
 * porque para el navegador otra URL es otro archivo. Poner ahí un `Date.now()`
 * funcionaría, pero rompería la caché en cada visita y volvería a bajar 15 MB
 * cada vez. Por eso se consulta primero por HEAD (unos cientos de bytes) cuál
 * es la versión publicada y se usa esa como parámetro: cambia cuando cambia el
 * catálogo y sólo entonces, así que quien ya lo tiene lo abre al instante y
 * quien tiene el viejo lo baja de nuevo.
 *
 * Si la consulta falla se devuelve la URL tal cual: es preferible mostrar el
 * catálogo con lo que haya en caché a dejar la pantalla en error. En ese caso
 * la frescura depende sólo del `--cache-control-max-age` con que se subió el
 * archivo, que por eso conviene dejar en el mínimo (ver .env.example).
 */
export async function urlSinCache(url, { signal } = {}) {
  if (!url) return url;

  try {
    // `cache: "no-store"` es lo que hace útil a esta petición: sin eso el
    // navegador respondería el HEAD con la misma copia vieja que se quiere
    // detectar, y la huella nunca cambiaría.
    const respuesta = await fetch(url, { method: "HEAD", cache: "no-store", signal });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const version = huella(respuesta);
    if (version) return conParametro(url, "v", version);

    console.warn(
      "[catalogos] La respuesta del catálogo no trae last-modified ni content-length; " +
        "se usa la URL sin versionar y el PDF puede quedar servido desde la caché del navegador."
    );
  } catch (error) {
    // Al desmontar se aborta la petición: no es un fallo que valga la pena
    // reportar.
    if (signal?.aborted || error?.name === "AbortError") return url;

    console.warn("[catalogos] No se pudo consultar la versión del catálogo:", error);
  }

  return url;
}
