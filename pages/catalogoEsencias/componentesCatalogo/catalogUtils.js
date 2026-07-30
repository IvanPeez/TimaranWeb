// Utilidades del catálogo de esencias.
// Los precios NO se muestran en la UI: la conversión se hace por WhatsApp.

import {
  advisorMessage,
  plantillaCotizacion,
  whatsappLink,
  WHATSAPP_DISPLAY,
  WHATSAPP_PHONE,
} from "../../../utils/contacto";
import sinImagen from "../../../resources/img/sin-imagen.jpg";

// Se reexportan para que el catálogo siga importando todo desde un solo sitio.
export { advisorMessage, whatsappLink, WHATSAPP_DISPLAY, WHATSAPP_PHONE };

export const PLACEHOLDER_IMG = sinImagen;

// 238 registros del catálogo apuntan a un "no-image.jpg" alojado en un sitio
// ajeno (pro-kulturu.cz). Se tratan como si no tuvieran foto: así no se
// hotlinkea a un tercero y se muestra el placeholder propio.
const SIN_FOTO = /pro-kulturu\.cz|no[-_]?image/i;

export const pictureOf = (item) =>
  !item?.picture || SIN_FOTO.test(item.picture) ? sinImagen : item.picture;

/** Si la imagen remota falla (enlace caído), cae al placeholder propio. */
export const handleImageError = (event) => {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "true";
  img.src = sinImagen;
};

export const DISCLAIMER =
  "Nuestras esencias son creaciones propias inspiradas en fragancias reconocidas. No son réplicas ni copias, ni guardan relación con las marcas mencionadas, cuyos nombres se usan sólo como referencia olfativa.";

export const SORT_OPTIONS = [
  { value: "destacados", label: "Destacados" },
  { value: "recientes", label: "Más recientes" },
  { value: "az", label: "Nombre A–Z" },
  { value: "za", label: "Nombre Z–A" },
  { value: "marca", label: "Inspiración A–Z" },
];

// Una esencia es novedad según su campo "date", no un booleano suelto: así
// dejan de ser novedad solas, sin tener que editar el catálogo a mano.
export const DIAS_NOVEDAD = 60;

const milisDeNovedad = DIAS_NOVEDAD * 24 * 60 * 60 * 1000;

/** Fecha de alta en milisegundos. Sin fecha válida, se trata como antigua. */
export const fechaDe = (item) => {
  const t = item?.date ? Date.parse(item.date) : NaN;
  return Number.isNaN(t) ? 0 : t;
};

export const esNovedad = (item, ahora = Date.now()) =>
  ahora - fechaDe(item) <= milisDeNovedad;

/**
 * Comparador "de la más nueva a la más vieja". A igual fecha desempata la
 * posición de alta (`orden`: id -> índice en el catálogo), porque las últimas
 * del listado son las que se cargaron después. Alfabético desempataría al
 * azar y rompería justo lo que se quiere mostrar.
 */
export const porMasReciente = (orden) => (a, b) =>
  fechaDe(b) - fechaDe(a) || (orden.get(b.id) ?? 0) - (orden.get(a.id) ?? 0);

// Presentaciones disponibles (reemplazan a la tabla de precios en la UI).
export const PRESENTACIONES = [
  { label: "120 g", note: "Para empezar" },
  { label: "250 g" },
  { label: "500 g" },
  { label: "1 kg" },
  { label: "5 kg" },
  { label: "10 kg +", note: "Mejor precio por gramo" },
];

/** "ESC. INSP. EN ANIMALE" -> "ANIMALE" */
export const inspiredBy = (name = "") => {
  const clean = name.replace(/^ESC\.?\s*INSP\.?\s*(EN|DE)?\s*/i, "").trim();
  return clean || name;
};

/** Línea de la plantilla: "NOMBRE (insp. MARCA) - ___ g" */
const lineaEsencia = (perfume) =>
  `${perfume.newName} (insp. ${inspiredBy(perfume.name)}) - ___ g`;

export const singleQuoteMessage = (perfume) =>
  plantillaCotizacion({ esencias: [lineaEsencia(perfume)] });

export const listQuoteMessage = (items) =>
  plantillaCotizacion({ esencias: items.map(lineaEsencia) });
