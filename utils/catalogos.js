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

/**
 * Enlace de descarga de un PDF alojado en el Blob.
 *
 * El atributo `download` de un <a> se ignora cuando el archivo es de otro
 * origen, así que el navegador abriría el PDF en vez de bajarlo. El Blob de
 * Vercel resuelve esto con `?download=1`, que fuerza el Content-Disposition.
 */
export const enlaceDescarga = (url) => {
  if (!url) return url;
  return `${url}${url.includes("?") ? "&" : "?"}download=1`;
};
