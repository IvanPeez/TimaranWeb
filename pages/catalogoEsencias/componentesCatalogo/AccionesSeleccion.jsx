import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Loader2, Share2, TriangleAlert } from "lucide-react";

import { tieneFoto } from "./catalogUtils";
import {
  compartirVarias,
  copiarLamina,
  descargarLamina,
  descargarVarias,
  obtenerVarias,
  puedeCompartir,
  puedeCopiar,
} from "./imagenEsencia";

const AVISO_MS = 2600;

/**
 * Descarga las fotos de la selección y las deja listas.
 *
 * Se hace al abrir la lista y no al hacer clic en un botón por dos razones: en
 * iPhone `navigator.share` exige salir del mismo toque del usuario y no
 * aguanta la espera de ocho descargas, y aquí abajo ya se están pintando las
 * miniaturas, así que las imágenes salen de la caché del navegador.
 */
function useFotosSeleccion(perfumes) {
  const [imagenes, setImagenes] = useState([]);
  const [avance, setAvance] = useState({ listas: 0, total: 0 });
  const [terminado, setTerminado] = useState(false);

  // La lista se rearma en cada render del padre; se compara por contenido para
  // no relanzar las descargas al abrir y cerrar el panel.
  const clave = perfumes.map((perfume) => perfume.id).join(",");

  useEffect(() => {
    if (!perfumes.length) {
      setImagenes([]);
      setAvance({ listas: 0, total: 0 });
      setTerminado(true);
      return undefined;
    }

    let cancelado = false;
    const controlador = new AbortController();

    setImagenes([]);
    setTerminado(false);
    setAvance({ listas: 0, total: perfumes.length });

    obtenerVarias(perfumes, {
      signal: controlador.signal,
      onAvance: (listas, total) => {
        if (!cancelado) setAvance({ listas, total });
      },
    })
      .then((resultado) => {
        if (!cancelado) setImagenes(resultado);
      })
      .catch(() => {})
      .finally(() => {
        // Marca el final aunque no haya salido ninguna: sin esto, con todas
        // las fotos caídas los botones se quedarían deshabilitados para
        // siempre diciendo "preparando".
        if (!cancelado) setTerminado(true);
      });

    return () => {
      cancelado = true;
      controlador.abort();
    };
    // `clave` resume la lista: depender del array recrearía el efecto siempre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  return { imagenes, avance, terminado };
}

/**
 * Llevarse las fotos de toda la selección de una vez.
 *
 * Cada botón resuelve un escenario distinto, porque no hay uno solo que sirva
 * en todas partes:
 *
 * - Compartir manda las fotos sueltas al chat. Es lo que se quiere, pero el
 *   menú nativo del sistema sólo existe en celular.
 * - Descargar deja los archivos en la carpeta de descargas, para adjuntarlos
 *   todos juntos en WhatsApp Web.
 * - Copiar arma una sola lámina con todas. El portapapeles del navegador
 *   guarda UNA imagen: pedirle varias lo rechaza. Una lámina es la única forma
 *   de pegar la selección completa de un Ctrl+V.
 */
export function AccionesSeleccion({ items }) {
  const conFoto = items.filter(tieneFoto);
  const { imagenes, avance, terminado } = useFotosSeleccion(conFoto);

  const [estado, setEstado] = useState("listo"); // listo | trabajando | hecho | error
  const [aviso, setAviso] = useState("");
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const ejecutar = useCallback(async (accion, textoHecho) => {
    clearTimeout(temporizador.current);
    setEstado("trabajando");

    try {
      await accion();
      setAviso(textoHecho);
      setEstado("hecho");
    } catch (error) {
      // Cerrar el menú de compartir sin elegir nada llega como AbortError.
      if (error?.name === "AbortError") {
        setEstado("listo");
        return;
      }
      console.error("[catalogo] No se pudieron preparar las imágenes:", error);
      setAviso("No se pudo, inténtalo de nuevo");
      setEstado("error");
    }

    temporizador.current = setTimeout(() => setEstado("listo"), AVISO_MS);
  }, []);

  const compartir = useCallback(
    () =>
      ejecutar(async () => {
        // Si el equipo no admite el lote (algunos limitan la cantidad de
        // archivos), se descargan: peor es dejarlo sin las fotos.
        const compartidas = await compartirVarias(imagenes);
        if (!compartidas) await descargarVarias(imagenes);
      }, "Listas"),
    [ejecutar, imagenes]
  );

  const descargar = useCallback(
    () => ejecutar(() => descargarVarias(imagenes), `${imagenes.length} imágenes descargadas`),
    [ejecutar, imagenes]
  );

  // Se calcula en el render y no al cargar el módulo: depende del navegador y
  // el HTML de un build se sirve igual a todos.
  const conPortapapeles = puedeCopiar();

  const copiar = useCallback(
    () =>
      ejecutar(
        // Sin portapapeles de imágenes queda la lámina como archivo.
        () => (conPortapapeles ? copiarLamina(imagenes) : descargarLamina(imagenes)),
        conPortapapeles ? "¡Lámina copiada!" : "Lámina descargada"
      ),
    [conPortapapeles, ejecutar, imagenes]
  );

  if (!conFoto.length) return null;

  const preparando = !terminado;
  const trabajando = estado === "trabajando";
  // Sin ninguna foto en pie no hay nada que compartir: los botones se apagan
  // en vez de fallar al pulsarlos.
  const bloqueado = preparando || trabajando || imagenes.length === 0;

  const Icono =
    trabajando || preparando
      ? Loader2
      : estado === "hecho"
        ? Check
        : estado === "error" || (terminado && imagenes.length === 0)
          ? TriangleAlert
          : null;

  const boton =
    "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";
  const normal = "border-white/15 text-white/75 hover:border-champagne hover:text-champagne";
  const tono =
    estado === "hecho"
      ? "border-champagne/60 bg-champagne/10 text-champagne"
      : estado === "error"
        ? "border-red-400/50 text-red-300"
        : normal;

  const marca = (Reserva) =>
    Icono ? (
      <Icono className={`h-4 w-4 ${trabajando || preparando ? "animate-spin" : ""}`} />
    ) : (
      <Reserva className="h-4 w-4" />
    );

  return (
    <div className="mt-3 border-t border-white/[0.07] pt-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs uppercase tracking-[0.22em] text-white/60">
          Imágenes de la selección
        </h3>
        <span className="text-[11px] text-white/35">
          {preparando
            ? `Preparando ${avance.listas} de ${avance.total}…`
            : imagenes.length === 0
              ? "No se pudieron cargar las fotos"
              : `${imagenes.length} de ${conFoto.length} listas`}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {puedeCompartir() && (
          <button type="button" onClick={compartir} disabled={bloqueado} className={`${boton} ${tono}`}>
            {marca(Share2)}
            Compartir
          </button>
        )}

        <button type="button" onClick={descargar} disabled={bloqueado} className={`${boton} ${tono}`}>
          {marca(Download)}
          Descargar
        </button>

        {/* Sin portapapeles de imágenes la lámina se baja como archivo, así
            que el botón no puede prometer que la copia. */}
        <button type="button" onClick={copiar} disabled={bloqueado} className={`${boton} ${tono}`}>
          {marca(conPortapapeles ? Copy : Download)}
          {conPortapapeles ? "Copiar lámina" : "Bajar lámina"}
        </button>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-white/40" aria-live="polite">
        {estado === "hecho" || estado === "error"
          ? aviso
          : "Compartir y descargar mandan las fotos sueltas. La lámina junta todas en una sola imagen, porque el portapapeles del navegador sólo guarda una."}
      </p>
    </div>
  );
}
