// Datos de contacto de la empresa, usados por toda la web.
// Configurables desde .env (ver .env.example). El fallback evita romper la UI
// si la variable no está definida en el entorno de build.

export const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || "573207541234";

export const WHATSAPP_DISPLAY =
  import.meta.env.VITE_WHATSAPP_DISPLAY || "(+57) 320 7541234";

export const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

export const SALUDO = "Hola Distribuciones Timarán 👋";

// Toda salida a WhatsApp llega con la misma plantilla de cotización, así el
// pedido entra ya estructurado y el asesor no tiene que reconstruirlo.
const SECCIONES = [
  {
    clave: "esencias",
    titulo: "ESENCIAS",
    ejemplo: "Nombre de la esencia - cantidad en gramos",
  },
  { clave: "envases", titulo: "ENVASES", ejemplo: "Envase - cantidad" },
  { clave: "insumos", titulo: "INSUMOS", ejemplo: "Nombre del producto - cantidad" },
];

// wa.me mete el mensaje en la URL, así que una selección enorme podría generar
// un enlace que el navegador rechace. Se corta con aviso visible, nunca en
// silencio.
const MAX_LINEAS = 50;

const bloque = (titulo, items, ejemplo) => {
  if (!items.length) return `*${titulo}*\n${ejemplo}`;

  const visibles = items.slice(0, MAX_LINEAS).map((i) => `${i}`);
  const restantes = items.length - visibles.length;
  if (restantes > 0) {
    visibles.push(`(+ ${restantes} más, te los detallo por aquí)`);
  }

  return `*${titulo}*\n${visibles.join("\n")}`;
};

/**
 * Arma la plantilla de cotización. Las secciones sin datos se envían con su
 * línea de ejemplo para que el cliente la complete antes de mandar.
 */
export const plantillaCotizacion = ({
  esencias = [],
  envases = [],
  insumos = [],
  observaciones = "",
} = {}) => {
  const datos = { esencias, envases, insumos };

  const cuerpo = SECCIONES.map(({ clave, titulo, ejemplo }) =>
    bloque(titulo, datos[clave], ejemplo)
  ).join("\n\n");

  return [
    SALUDO,
    "Quiero solicitar una cotización:",
    "",
    cuerpo,
    "",
    "*OBSERVACIONES*",
    observaciones || "-",
  ].join("\n");
};

/** Contacto general: la plantilla en blanco, lista para llenar. */
export const advisorMessage = () => plantillaCotizacion();

/** Consulta desde la landing: el tema entra como observación. */
export const landingMessage = (tema) =>
  plantillaCotizacion({ observaciones: tema });
