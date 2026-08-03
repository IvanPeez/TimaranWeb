// Sacar la foto de una esencia del catálogo para mandársela a un cliente.
//
// Es lo que más hace un vendedor: encuentra la esencia, se lleva la imagen y la
// pega en el chat. El clic derecho sobre la foto no alcanzaba porque encima va
// una capa de degradado, y aunque ahora esa capa deja pasar el puntero
// (`pointer-events-none`), el clic derecho no existe en un celular. De ahí
// estas tres acciones explícitas: compartir, copiar y descargar.

import { inspiredBy } from "./catalogUtils";

const EXTENSIONES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Nombre con el que se guarda o se comparte la foto.
 *
 * Lleva el nombre de la esencia y su inspiración porque el archivo termina en
 * la galería del vendedor entre decenas de fotos: "DALILA-INSP-ANIMALE.png" se
 * vuelve a encontrar, "IMG_4821.png" no.
 */
export const nombreArchivo = (perfume, tipo) => {
  const base = `${perfume?.newName ?? ""} insp ${inspiredBy(perfume?.name ?? "")}`;
  const limpio = base
    // Sin tildes ni eñes: el nombre viaja por WhatsApp, correo y Windows.
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase();

  return `${limpio || "ESENCIA"}.${EXTENSIONES[tipo] ?? "jpg"}`;
};

/** Trae la imagen. Las fotos del catálogo son de otro dominio (i.postimg.cc). */
export async function obtenerBlob(url, { signal } = {}) {
  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) throw new Error(`No se pudo descargar la imagen (HTTP ${respuesta.status})`);
  return respuesta.blob();
}

/**
 * Convierte la imagen a PNG.
 *
 * El portapapeles del navegador sólo acepta PNG —Chrome rechaza un JPEG— y
 * buena parte del catálogo está en .jpg, así que hay que repintarla.
 *
 * Se dibuja desde un blob: URL y no desde la URL remota a propósito: un blob es
 * del mismo origen, así que el canvas no queda "contaminado" y sí deja exportar
 * lo dibujado. Apuntando el canvas a la URL de postimg, `toBlob` lanzaría un
 * error de seguridad.
 */
async function aPng(blob) {
  if (blob.type === "image/png") return blob;

  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = objectUrl;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (png) => (png ? resolve(png) : reject(new Error("No se pudo convertir la imagen"))),
        "image/png"
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** ¿El navegador deja escribir imágenes en el portapapeles? */
export const puedeCopiar = () =>
  typeof ClipboardItem !== "undefined" && typeof navigator?.clipboard?.write === "function";

/** ¿Hay menú nativo para compartir archivos? En la práctica: celulares. */
export const puedeCompartir = () =>
  typeof navigator?.canShare === "function" && typeof navigator?.share === "function";

/**
 * ¿Se navega con el dedo?
 *
 * Decide cuál acción va en el botón único de la tarjeta. En celular gana
 * compartir: abre WhatsApp con la foto adjunta de una. En computador gana el
 * portapapeles, porque ahí el vendedor tiene WhatsApp Web abierto y pega con
 * Ctrl+V; el menú de compartir de Windows es un rodeo. Chrome de escritorio
 * también soporta compartir, así que no basta con preguntar si existe.
 */
export const esTactil = () =>
  typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches === true;

/**
 * Copia la imagen al portapapeles como PNG.
 *
 * Al `ClipboardItem` se le pasa la promesa sin resolver y no el archivo ya
 * descargado: Safari exige que `clipboard.write` salga del mismo clic del
 * usuario y, si antes se hace `await` de la descarga, da por caducado el
 * permiso y lo rechaza. Pasando la promesa, la escritura arranca en el clic y
 * el navegador se encarga de esperar el contenido.
 */
export async function copiarAlPortapapeles(url, blob) {
  const png = (async () => aPng(blob ?? (await obtenerBlob(url))))();
  await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
}

/** Guarda la imagen en el equipo, con el nombre de la esencia. */
export async function descargarImagen(url, perfume, blob) {
  const datos = blob ?? (await obtenerBlob(url));
  const objectUrl = URL.createObjectURL(datos);

  const enlace = document.createElement("a");
  enlace.href = objectUrl;
  enlace.download = nombreArchivo(perfume, datos.type);
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  // Se libera un rato después: revocarlo de inmediato cancela la descarga en
  // algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

/**
 * Abre el menú de compartir del sistema con la foto adjunta (WhatsApp, correo,
 * AirDrop...). Devuelve false si el equipo no puede compartir ese archivo, para
 * poder caer a copiar o descargar.
 */
export async function compartirImagen(url, perfume, blob) {
  if (!puedeCompartir()) return false;

  const datos = blob ?? (await obtenerBlob(url));
  const archivo = new File([datos], nombreArchivo(perfume, datos.type), { type: datos.type });
  if (!navigator.canShare({ files: [archivo] })) return false;

  await navigator.share({ files: [archivo] });
  return true;
}
