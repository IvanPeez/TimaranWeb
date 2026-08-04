// Ubicación de los catálogos en PDF y cómo se averigua qué versión hay publicada.
//
// Los archivos viven en el Blob de Vercel, no en el repositorio: pesan más de
// 10 MB cada uno y se reemplazan cada temporada. Tenerlos en `public/` obligaba
// a versionar binarios enormes y a redesplegar el sitio entero sólo para
// cambiar un precio; ahora se sube el PDF nuevo al storage y listo.
//
// Se configuran por variable de entorno (Vite sólo expone las que empiezan por
// VITE_). Ver .env.example para el detalle y el comando de subida.
//
// Este módulo NO descarga el catálogo: sólo pregunta por sus metadatos. Quién
// guarda el archivo y cuándo decide volver a bajarlo está en catalogoCache.js.

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
 *
 * Es la RUTA DE RESPALDO del botón de descarga: cuando el visor ya tiene el
 * catálogo en memoria, el botón guarda esos bytes y no vuelve a pedirle nada al
 * Blob (ver PdfFlipbook). Este enlace se usa sólo mientras todavía no hay copia
 * —primera visita, o el archivo falló al cargar—, que es justo cuando no queda
 * más remedio que ir a la red.
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
 * subió un catálogo nuevo. Eso es lo que la vuelve utilizable como número de
 * versión: comparar dos huellas responde «¿es el mismo archivo?» sin haber
 * bajado un solo byte del archivo.
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
 * Qué catálogo hay publicado ahora mismo, sin descargarlo.
 *
 * Es UNA PETICIÓN HEAD: el servidor contesta las cabeceras y nada más, así que
 * viaja del orden de 300 bytes en vez de 13 MB. Ésta es la operación que hace
 * el botón «Sincronizar» y la que corre sola al abrir el visor; poder repetirla
 * en cada visita sin que cueste nada es todo el punto del diseño.
 *
 * `cache: "no-store"` es lo que la hace útil: sin eso el navegador podría
 * responder el HEAD con la misma copia vieja que se quiere detectar, y la
 * huella nunca cambiaría.
 *
 * Devuelve también la URL versionada (…?v=<huella>). Para el navegador y para
 * la CDN otra URL es otro archivo, así que pedir por ahí garantiza que un
 * catálogo recién subido no se sirva desde una caché intermedia con el
 * contenido anterior.
 *
 * Lanza si la petición falla. Quien llama decide qué hacer con eso — en el
 * visor, seguir mostrando la copia guardada, que es preferible a una pantalla
 * de error por no haber podido comprobar algo que probablemente no cambió.
 */
export async function consultarPublicado(url, { signal } = {}) {
  const respuesta = await fetch(url, { method: "HEAD", cache: "no-store", signal });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

  const version = huella(respuesta);

  if (!version) {
    console.warn(
      "[catalogos] La respuesta del catálogo no trae last-modified ni content-length: " +
        "no hay con qué distinguir una versión de otra. El visor seguirá usando la copia " +
        "guardada y no podrá detectar una actualización."
    );
  }

  const modificado = Date.parse(respuesta.headers.get("last-modified") ?? "");
  const tamano = Number(respuesta.headers.get("content-length"));

  return {
    version,
    // URL por la que hay que pedir ESTA versión. Sin huella se pide la de
    // siempre: no hay nada mejor que ofrecer.
    url: version ? conParametro(url, "v", version) : url,
    bytes: Number.isFinite(tamano) && tamano > 0 ? tamano : null,
    publicadoEn: Number.isFinite(modificado) ? modificado : null,
  };
}
