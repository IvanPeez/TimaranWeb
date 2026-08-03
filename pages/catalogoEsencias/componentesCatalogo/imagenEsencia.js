// Sacar la foto de una esencia del catálogo para mandársela a un cliente.
//
// Es lo que más hace un vendedor: encuentra la esencia, se lleva la imagen y la
// pega en el chat. El clic derecho sobre la foto no alcanzaba porque encima va
// una capa de degradado, y aunque ahora esa capa deja pasar el puntero
// (`pointer-events-none`), el clic derecho no existe en un celular. De ahí
// estas tres acciones explícitas: compartir, copiar y descargar.

import { inspiredBy, pictureOf } from "./catalogUtils";

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

// ---------------------------------------------------------------------------
// Varias esencias a la vez
// ---------------------------------------------------------------------------

/** Cuántas fotos se piden en paralelo. Más que esto sólo congestiona la red. */
const EN_PARALELO = 4;

/** Recorre la lista con un tope de tareas simultáneas, conservando el orden. */
async function enTandas(lista, limite, tarea) {
  const resultados = new Array(lista.length);
  let siguiente = 0;

  const obreros = Array.from({ length: Math.min(limite, lista.length) }, async () => {
    while (siguiente < lista.length) {
      const indice = siguiente++;
      resultados[indice] = await tarea(lista[indice]);
    }
  });

  await Promise.all(obreros);
  return resultados;
}

/**
 * Trae las fotos de varias esencias.
 *
 * Las que fallen se descartan en vez de tumbar el lote entero: si una de ocho
 * tiene el enlace caído, el vendedor prefiere las otras siete a un error.
 */
export async function obtenerVarias(perfumes, { signal, onAvance } = {}) {
  let listas = 0;

  const resultados = await enTandas(perfumes, EN_PARALELO, async (perfume) => {
    try {
      const blob = await obtenerBlob(pictureOf(perfume), { signal });
      return { perfume, blob };
    } catch (error) {
      if (error?.name === "AbortError") throw error;
      console.warn("[catalogo] No se pudo traer la imagen de", perfume?.newName, error);
      return null;
    } finally {
      onAvance?.(++listas, perfumes.length);
    }
  });

  return resultados.filter(Boolean);
}

/**
 * Guarda todas las fotos, cada una con su nombre.
 *
 * Van sueltas y no en un .zip a propósito: el vendedor las adjunta de una vez
 * desde la carpeta de descargas, y un zip le agregaría el paso de
 * descomprimir. La pausa entre archivos es porque los navegadores descartan
 * descargas encadenadas demasiado rápido.
 */
export async function descargarVarias(imagenes) {
  for (const [indice, { perfume, blob }] of imagenes.entries()) {
    await descargarImagen(pictureOf(perfume), perfume, blob);
    if (indice < imagenes.length - 1) {
      await new Promise((resolver) => setTimeout(resolver, 250));
    }
  }
}

/**
 * Comparte todas las fotos de una vez por el menú del sistema.
 *
 * Esta es la única forma real de mandar varias imágenes juntas: el menú nativo
 * sí acepta una lista de archivos. Devuelve false si el equipo no puede con
 * ese lote (algunos limitan la cantidad) para poder caer a la descarga.
 */
export async function compartirVarias(imagenes) {
  if (!puedeCompartir() || !imagenes.length) return false;

  const archivos = imagenes.map(
    ({ perfume, blob }) => new File([blob], nombreArchivo(perfume, blob.type), { type: blob.type })
  );
  if (!navigator.canShare({ files: archivos })) return false;

  await navigator.share({ files: archivos });
  return true;
}

// Medidas de la lámina. La celda se achica cuando hay muchas esencias para que
// el PNG no se vuelva inmanejable en el portapapeles.
const MARGEN = 28;
const HUECO = 18;
const COLUMNAS_MAX = 3;

const ladoCelda = (cantidad) => (cantidad > 12 ? 300 : cantidad > 6 ? 400 : 480);

/** Dibuja la imagen llenando el recuadro y recortando lo que sobre (object-cover). */
function dibujarRecortada(ctx, img, x, y, ancho, alto) {
  const escala = Math.max(ancho / img.naturalWidth, alto / img.naturalHeight);
  const w = img.naturalWidth * escala;
  const h = img.naturalHeight * escala;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, ancho, alto);
  ctx.clip();
  ctx.drawImage(img, x + (ancho - w) / 2, y + (alto - h) / 2, w, h);
  ctx.restore();
}

/** Corta el texto con puntos suspensivos si no cabe en el ancho de la celda. */
function recortarTexto(ctx, texto, maxAncho) {
  if (ctx.measureText(texto).width <= maxAncho) return texto;

  let corto = texto;
  while (corto.length > 1 && ctx.measureText(`${corto}…`).width > maxAncho) {
    corto = corto.slice(0, -1);
  }
  return `${corto}…`;
}

async function imagenDesde(blob) {
  const objectUrl = URL.createObjectURL(blob);
  const img = new Image();
  img.src = objectUrl;
  try {
    await img.decode();
    return { img, liberar: () => URL.revokeObjectURL(objectUrl) };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

/**
 * Arma una sola imagen con todas las esencias seleccionadas, cada una con su
 * nombre y su inspiración.
 *
 * Existe porque el portapapeles del navegador guarda UNA imagen, no una lista:
 * `clipboard.write` con varios elementos lo rechazan todos los navegadores. Si
 * el vendedor quiere pegar la selección completa en un chat, la única salida es
 * mandarla en una lámina. Para fotos sueltas están compartir y descargar.
 */
export async function laminaDe(imagenes) {
  const celda = ladoCelda(imagenes.length);
  const etiqueta = Math.round(celda * 0.22);
  const columnas = Math.min(COLUMNAS_MAX, Math.ceil(Math.sqrt(imagenes.length)));
  const filas = Math.ceil(imagenes.length / columnas);

  const canvas = document.createElement("canvas");
  canvas.width = MARGEN * 2 + columnas * celda + (columnas - 1) * HUECO;
  canvas.height = MARGEN * 2 + filas * (celda + etiqueta) + (filas - 1) * HUECO;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0A0A0B";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sin esto la primera lámina puede salir con la tipografía de reserva,
  // porque las fuentes de la página se cargan aparte.
  await document.fonts?.ready;

  for (const [indice, { perfume, blob }] of imagenes.entries()) {
    const x = MARGEN + (indice % columnas) * (celda + HUECO);
    const y = MARGEN + Math.floor(indice / columnas) * (celda + etiqueta + HUECO);

    ctx.fillStyle = "#17171A";
    ctx.fillRect(x, y, celda, celda + etiqueta);

    const { img, liberar } = await imagenDesde(blob);
    try {
      dibujarRecortada(ctx, img, x, y, celda, celda);
    } finally {
      liberar();
    }

    const sangria = Math.round(celda * 0.045);
    const anchoTexto = celda - sangria * 2;

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `italic ${Math.round(celda * 0.072)}px "Bodoni Moda", Georgia, serif`;
    ctx.fillText(
      recortarTexto(ctx, perfume.newName ?? "", anchoTexto),
      x + sangria,
      y + celda + Math.round(etiqueta * 0.45)
    );

    ctx.fillStyle = "#D8BC8A";
    ctx.font = `${Math.round(celda * 0.042)}px "General Sans", Arial, sans-serif`;
    ctx.fillText(
      recortarTexto(ctx, `Inspirada en ${inspiredBy(perfume.name ?? "")}`, anchoTexto),
      x + sangria,
      y + celda + Math.round(etiqueta * 0.78)
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (png) => (png ? resolve(png) : reject(new Error("No se pudo armar la lámina"))),
      "image/png"
    );
  });
}

/** Copia la lámina de la selección al portapapeles. */
export async function copiarLamina(imagenes) {
  await navigator.clipboard.write([new ClipboardItem({ "image/png": laminaDe(imagenes) })]);
}

/** Descarga la lámina, para cuando el portapapeles no está disponible. */
export async function descargarLamina(imagenes) {
  const png = await laminaDe(imagenes);
  const objectUrl = URL.createObjectURL(png);

  const enlace = document.createElement("a");
  enlace.href = objectUrl;
  enlace.download = `TIMARAN-SELECCION-${imagenes.length}.png`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}
