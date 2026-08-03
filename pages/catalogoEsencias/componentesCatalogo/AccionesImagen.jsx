import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Loader2, Share2, TriangleAlert } from "lucide-react";

import {
  compartirImagen,
  copiarAlPortapapeles,
  descargarImagen,
  esTactil,
  obtenerBlob,
  puedeCompartir,
  puedeCopiar,
} from "./imagenEsencia";

// Cuánto se deja el "¡Copiada!" antes de volver al estado normal.
const AVISO_MS = 2200;

/**
 * Descarga la foto una sola vez y la deja lista para copiar o compartir.
 *
 * No cuesta ancho de banda extra: la imagen ya se bajó para pintarse en el
 * <img>, así que este `fetch` sale de la caché del navegador. Vale la pena
 * tenerla lista de antemano porque Safari en iPhone exige que `navigator.share`
 * salga del mismo toque del usuario: si hay que esperar la descarga, cancela.
 */
function useFotoPrecargada(url, activo) {
  const blobRef = useRef(null);

  useEffect(() => {
    blobRef.current = null;
    if (!activo || !url) return undefined;

    let cancelado = false;
    const controlador = new AbortController();

    obtenerBlob(url, { signal: controlador.signal })
      .then((blob) => {
        if (!cancelado) blobRef.current = blob;
      })
      // Si falla, cada botón la vuelve a pedir y ahí sí se reporta el error.
      .catch(() => {});

    return () => {
      cancelado = true;
      controlador.abort();
    };
  }, [url, activo]);

  return blobRef;
}

/**
 * Botones para llevarse la foto de una esencia.
 *
 * En celular aparece "Compartir", que abre el menú del sistema y deja mandarla
 * por WhatsApp sin pasar por la galería. En computador, "Copiar" la pone en el
 * portapapeles lista para pegar en el chat. "Descargar" siempre está: es la que
 * funciona en cualquier navegador.
 *
 * `variante="tarjeta"` deja un solo botón de ícono para no recargar la grilla:
 * el más directo que soporte el equipo.
 */
export function AccionesImagen({ perfume, url, variante = "modal" }) {
  const enTarjeta = variante === "tarjeta";
  const [estado, setEstado] = useState("listo"); // listo | trabajando | hecho | error
  const [aviso, setAviso] = useState("");
  const temporizador = useRef(null);
  const blobRef = useFotoPrecargada(url, !enTarjeta);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const ejecutar = useCallback(
    async (accion, textoHecho) => {
      clearTimeout(temporizador.current);
      setEstado("trabajando");

      try {
        await accion(blobRef.current);
        setAviso(textoHecho);
        setEstado("hecho");
      } catch (error) {
        // Cerrar el menú de compartir sin elegir nada llega como AbortError:
        // el vendedor se arrepintió, no falló nada.
        if (error?.name === "AbortError") {
          setEstado("listo");
          return;
        }
        console.error("[catalogo] No se pudo preparar la imagen:", error);
        setAviso("No se pudo");
        setEstado("error");
      }

      temporizador.current = setTimeout(() => setEstado("listo"), AVISO_MS);
    },
    [blobRef]
  );

  const compartir = useCallback(
    () =>
      ejecutar(async (blob) => {
        // Si el equipo no admite compartir ese archivo, se descarga: peor es
        // dejar al vendedor sin la foto.
        const compartida = await compartirImagen(url, perfume, blob);
        if (!compartida) await descargarImagen(url, perfume, blob);
      }, "Lista"),
    [ejecutar, perfume, url]
  );

  const copiar = useCallback(
    () => ejecutar((blob) => copiarAlPortapapeles(url, blob), "¡Copiada!"),
    [ejecutar, url]
  );

  const descargar = useCallback(
    () => ejecutar((blob) => descargarImagen(url, perfume, blob), "Descargada"),
    [ejecutar, perfume, url]
  );

  // Se calculan en el render y no al cargar el módulo: `navigator.canShare`
  // depende del equipo, y el HTML de un build se sirve igual a todos.
  const conCompartir = puedeCompartir();
  const conCopiar = puedeCopiar();

  const Icono =
    estado === "trabajando"
      ? Loader2
      : estado === "hecho"
        ? Check
        : estado === "error"
          ? TriangleAlert
          : null;

  if (enTarjeta) {
    // Un solo botón, con el camino más corto para mandar la foto en ese
    // equipo: el menú de compartir en celular, el portapapeles con mouse.
    const principal =
      conCompartir && esTactil()
        ? { correr: compartir, Marca: Share2, texto: "Compartir la imagen" }
        : conCopiar
          ? { correr: copiar, Marca: Copy, texto: "Copiar la imagen" }
          : conCompartir
            ? { correr: compartir, Marca: Share2, texto: "Compartir la imagen" }
            : { correr: descargar, Marca: Download, texto: "Descargar la imagen" };

    const { correr: accion, texto } = principal;
    const Actual = Icono ?? principal.Marca;

    return (
      <span
        role="button"
        tabIndex={0}
        aria-label={texto}
        title={estado === "listo" ? texto : aviso}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (estado !== "trabajando") accion();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          if (estado !== "trabajando") accion();
        }}
        className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
          estado === "hecho"
            ? "border-champagne bg-champagne text-ink"
            : estado === "error"
              ? "border-red-400/60 bg-black/40 text-red-300"
              : "border-white/25 bg-black/40 text-white hover:border-champagne hover:text-champagne"
        }`}
      >
        <Actual className={`h-4 w-4 ${estado === "trabajando" ? "animate-spin" : ""}`} />
      </span>
    );
  }

  const boton =
    "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 disabled:opacity-60";
  const normal = "border-white/15 text-white/75 hover:border-champagne hover:text-champagne";
  const resaltado =
    estado === "hecho"
      ? "border-champagne/60 bg-champagne/10 text-champagne"
      : estado === "error"
        ? "border-red-400/50 text-red-300"
        : normal;

  const trabajando = estado === "trabajando";

  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.22em] text-white/60">
        Imagen para el cliente
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {conCompartir && (
          <button type="button" onClick={compartir} disabled={trabajando} className={`${boton} ${resaltado}`}>
            {Icono ? (
              <Icono className={`h-4 w-4 ${trabajando ? "animate-spin" : ""}`} />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Compartir
          </button>
        )}

        {conCopiar && (
          <button type="button" onClick={copiar} disabled={trabajando} className={`${boton} ${resaltado}`}>
            {Icono ? (
              <Icono className={`h-4 w-4 ${trabajando ? "animate-spin" : ""}`} />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copiar
          </button>
        )}

        <button type="button" onClick={descargar} disabled={trabajando} className={`${boton} ${resaltado}`}>
          {Icono ? (
            <Icono className={`h-4 w-4 ${trabajando ? "animate-spin" : ""}`} />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar
        </button>
      </div>

      {/* aria-live para que un lector de pantalla anuncie el resultado: el
          cambio de color del botón no le dice nada a quien no ve. */}
      <p className="mt-2 min-h-[1rem] text-[11px] text-white/45" aria-live="polite">
        {estado === "hecho" || estado === "error" ? aviso : ""}
      </p>
    </div>
  );
}
