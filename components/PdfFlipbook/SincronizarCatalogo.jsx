import React from "react";
import { Check, HardDrive, Loader2, RefreshCw, TriangleAlert } from "lucide-react";

/**
 * Botón y aviso de «Sincronizar».
 *
 * QUÉ HACE EL BOTÓN, que es lo que suele malentenderse: NO vuelve a descargar
 * el catálogo. Pide los metadatos del archivo publicado —unos cientos de bytes—
 * y los compara con los de la copia que ya está en pantalla. Si coinciden, no
 * pasa nada más y el cliente ve «ya tienes la versión más reciente»; sólo si son
 * distintos empieza una descarga.
 *
 * Existe porque la comprobación automática al abrir la pantalla no cubre a quien
 * deja el catálogo abierto: alguien que lo tuvo en una pestaña toda la mañana no
 * se entera de que se subió uno nuevo. El botón le da esa certeza sin obligarlo
 * a recargar ni a bajar 13 MB para averiguar que no cambió nada.
 */

const MB = 1024 * 1024;

const enMegas = (bytes) =>
  typeof bytes === "number" && bytes > 0
    ? `${(bytes / MB).toLocaleString("es-CO", { maximumFractionDigits: 1 })} MB`
    : null;

const enFecha = (ms) =>
  typeof ms === "number" && Number.isFinite(ms)
    ? new Date(ms).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
    : null;

/**
 * Texto del aviso.
 *
 * Se decide aquí y no en el visor porque hay dos fuentes que se pisan: la
 * sincronización que pidió el cliente y la actualización automática que puede
 * arrancar sola al abrir la pantalla. Mandan las descargas — un «al día» encima
 * de una barra de progreso sería mentira.
 */
function avisoDe({ sincronizacion, actualizando, progreso }) {
  if (actualizando || sincronizacion.fase === "actualizando") {
    return {
      tono: "trabajo",
      icono: Loader2,
      gira: true,
      texto: `Descargando la versión nueva… ${Math.round(progreso * 100)}%`,
    };
  }

  switch (sincronizacion.fase) {
    case "consultando":
      return { tono: "trabajo", icono: Loader2, gira: true, texto: "Comprobando si hay una versión nueva…" };
    case "al-dia":
      return { tono: "bien", icono: Check, texto: "Ya tienes la versión más reciente" };
    case "actualizado":
      return { tono: "bien", icono: Check, texto: "Catálogo actualizado" };
    case "sin-verificar":
      return {
        tono: "aviso",
        icono: TriangleAlert,
        texto: "No se pudo confirmar la versión; sigues con la copia guardada",
      };
    case "error":
      return {
        tono: "aviso",
        icono: TriangleAlert,
        texto: "No se pudo comprobar. Revisa tu conexión.",
      };
    default:
      return null;
  }
}

const TONOS = {
  trabajo: "border-white/10 text-white/70",
  bien: "border-champagne/40 text-champagne",
  aviso: "border-amber-400/40 text-amber-200",
};

export function BotonSincronizar({ sincronizacion, actualizando, onSincronizar, className }) {
  const ocupado =
    actualizando || sincronizacion.fase === "consultando" || sincronizacion.fase === "actualizando";

  return (
    <button
      type="button"
      onClick={onSincronizar}
      disabled={ocupado}
      aria-label="Comprobar si hay una versión nueva del catálogo"
      title="Comprobar si hay una versión nueva. No vuelve a descargar el catálogo: sólo consulta la fecha y el tamaño del archivo publicado."
      className={className}
    >
      <RefreshCw className={`h-4 w-4 ${ocupado ? "animate-spin" : ""}`} />
    </button>
  );
}

/** El resultado de la última comprobación, bajo la barra de herramientas. */
export function AvisoSincronizacion({ sincronizacion, actualizando, progreso }) {
  const aviso = avisoDe({ sincronizacion, actualizando, progreso });
  if (!aviso) return null;

  const Icono = aviso.icono;

  return (
    // `pointer-events-none` para que el aviso no le robe los clics al catálogo
    // mientras se desvanece: aparece justo encima de la primera página.
    <div className="pointer-events-none absolute inset-x-0 top-full z-30 flex justify-center px-3">
      <div
        role="status"
        className={`mt-2 flex items-center gap-2 rounded-xl border bg-ink/95 px-3 py-2 text-xs shadow-lg backdrop-blur ${TONOS[aviso.tono]}`}
      >
        <Icono className={`h-3.5 w-3.5 shrink-0 ${aviso.gira ? "animate-spin" : ""}`} />
        <span>{aviso.texto}</span>
      </div>
    </div>
  );
}

/**
 * Qué copia se está leyendo, en el pie.
 *
 * No es un adorno: le dice al cliente hasta qué fecha llega lo que tiene
 * delante, y explica por qué el catálogo abrió al instante y sin consumirle
 * datos. Sin esto, guardar el archivo en el equipo sería un comportamiento
 * invisible y la primera duda sería si está viendo algo viejo.
 *
 * Se muestra sólo cuando la copia quedó guardada de verdad (`guardado`): en modo
 * privado, o con el almacenamiento lleno, el archivo se descarga igual pero no
 * sobrevive, y prometer una copia que no está sería mentir sobre lo único que
 * este aviso afirma.
 */
export function CopiaGuardada({ registro, desdeCache }) {
  if (!registro?.guardado || !registro.version) return null;

  const fecha = enFecha(registro.publicadoEn ?? registro.guardadoEn);
  const peso = enMegas(registro.bytes);

  const detalle = desdeCache
    ? "Se abrió desde tu dispositivo, sin descargarlo otra vez."
    : "Queda guardado en tu dispositivo para la próxima visita.";

  return (
    <span
      title={`${detalle}${peso ? ` Pesa ${peso}.` : ""} En cada visita se comprueba si hay una versión nueva.`}
      className="hidden shrink-0 items-center gap-1.5 text-xs text-white/35 sm:flex"
    >
      <HardDrive className="h-3.5 w-3.5" />
      {fecha ? `Catálogo del ${fecha}` : "Copia guardada en tu dispositivo"}
    </span>
  );
}
