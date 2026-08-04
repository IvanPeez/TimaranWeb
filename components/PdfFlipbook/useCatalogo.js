import { useCallback, useEffect, useRef, useState } from "react";
import { consultarPublicado } from "../../utils/catalogos";
import { copiaGuardada, descargar, guardarCopia } from "../../utils/catalogoCache";

const VACIO = {
  fase: "consultando", // consultando | descargando | listo | sin-configurar | error
  datos: null,
  progreso: 0,
  error: null,
  registro: null,
  desdeCache: false,
  actualizando: false,
};

// Marcador para el catálogo que se pudo bajar pero no versionar: se muestra,
// no se guarda y no se anuncia como copia local.
const SIN_REGISTRO = {
  llave: null,
  version: null,
  bytes: null,
  publicadoEn: null,
  guardadoEn: null,
};

// Avisos de la sincronización manual que se retiran solos de la pantalla.
const AVISOS_PASAJEROS = new Set(["al-dia", "actualizado", "sin-verificar", "error"]);

/**
 * Consigue el catálogo gastando lo menos posible del Blob.
 *
 * El orden importa y es el que decide todo lo demás:
 *
 *   1. Se muestra la copia guardada, si la hay. Sin red, sin espera, sin gastar
 *      un byte de cuota. A partir de la segunda visita éste es el camino normal.
 *   2. Se pregunta por HEAD qué versión hay publicada (~300 bytes).
 *   3. Sólo si la huella cambió —o si no había copia— se descargan los 13 MB.
 *
 * Así el visitante SIEMPRE ve lo último publicado, que es el requisito, sin que
 * «siempre lo último» signifique «siempre descargando».
 *
 * El paso 2 es exactamente lo que hace el botón «Sincronizar»: comprobar, no
 * descargar. Si resulta que hay algo nuevo, entonces sí baja el archivo.
 *
 * @param url URL pública del PDF en el Blob.
 * @param id  Nombre corto y estable del catálogo ("envases", "esencias"). Es la
 *            entrada del índice local, así que cambiarlo hace que el navegador
 *            deje de reconocer lo que ya tenía guardado.
 */
export function useCatalogo(url, id) {
  const [estado, setEstado] = useState(() => ({
    ...VACIO,
    fase: url ? "consultando" : "sin-configurar",
  }));

  // Resultado de la última comprobación de versión. Separado del estado del
  // archivo porque tiene otro ciclo de vida: el catálogo se queda en pantalla,
  // el aviso de «ya lo tienes al día» se desvanece a los pocos segundos.
  const [sincronizacion, setSincronizacion] = useState({ fase: "reposo", en: null });

  // Qué versión está en pantalla ahora mismo. Va en un ref y no en el estado
  // porque lo leen las rutinas asíncronas: con el valor capturado en el
  // closure, una comprobación lanzada antes de una actualización compararía
  // contra la versión anterior y volvería a bajar el archivo por nada.
  const vigenteRef = useRef(null);
  // Revisión en curso, identificada por un número en vez de un booleano. Con un
  // booleano, una revisión abortada al cambiar de catálogo limpiaba la bandera
  // en su `finally` y dejaba pasar una segunda revisión simultánea sobre la que
  // ya había arrancado: dos descargas de 13 MB a la vez. Comparando el número,
  // la que ya no manda no toca nada.
  const revisionRef = useRef(0);
  const contadorRef = useRef(0);
  // El AbortController del montaje. También lo usan las sincronizaciones
  // manuales, para que salir de la pantalla corte una descarga en curso.
  const controlRef = useRef(null);

  /** Deja el archivo en pantalla y anota qué versión es. */
  const publicar = useCallback((datos, registro, { desdeCache }) => {
    vigenteRef.current = registro;
    setEstado({
      fase: "listo",
      datos,
      progreso: 1,
      error: null,
      registro,
      desdeCache,
      actualizando: false,
    });
  }, []);

  /**
   * Descarga una versión concreta y la guarda para la próxima visita.
   *
   * `teniaCopia` cambia la cara que pone la pantalla: sin copia previa esto es
   * «cargando el catálogo» y ocupa la vista entera; con copia previa el cliente
   * ya está leyendo, así que la descarga es un aviso discreto y el reemplazo
   * ocurre cuando termina.
   */
  const traer = useCallback(
    async (publicado, { signal, manual, teniaCopia }) => {
      setEstado((previo) => ({
        ...previo,
        fase: teniaCopia ? previo.fase : "descargando",
        actualizando: teniaCopia,
        progreso: 0,
        error: null,
      }));
      if (manual) setSincronizacion({ fase: "actualizando", en: null });

      // El progreso se redondea antes de tocar el estado: son ~200 trozos por
      // archivo y repintar la barra en cada uno no cambia nada en pantalla.
      let ultimoPorciento = -1;
      const datos = await descargar(publicado.url, {
        signal,
        onProgreso: (avance) => {
          const porciento = Math.round(avance * 100);
          if (porciento === ultimoPorciento) return;
          ultimoPorciento = porciento;
          setEstado((previo) => ({ ...previo, progreso: avance }));
        },
      });
      if (signal?.aborted) return;

      // Sin huella no hay llave con la que reconocer esto después, así que no
      // se guarda: ocuparía 13 MB en el equipo del cliente para nada.
      const registro = publicado.version
        ? await guardarCopia(id, {
            llave: publicado.url,
            version: publicado.version,
            datos,
            bytes: publicado.bytes,
            publicadoEn: publicado.publicadoEn,
          })
        : null;

      if (signal?.aborted) return;

      publicar(datos, registro ?? { ...SIN_REGISTRO, bytes: datos.byteLength }, {
        desdeCache: false,
      });
      setSincronizacion({ fase: teniaCopia ? "actualizado" : "reposo", en: Date.now() });
    },
    [id, publicar]
  );

  /**
   * Comprueba si lo publicado es distinto de lo que hay en pantalla.
   *
   * Ésta es la operación barata, la que puede correr en cada visita y cada vez
   * que alguien toque «Sincronizar». Descargar es la excepción, no la regla.
   */
  const revisar = useCallback(
    async ({ signal, manual }) => {
      if (!url || revisionRef.current) return;
      const mia = ++contadorRef.current;
      revisionRef.current = mia;
      if (manual) setSincronizacion({ fase: "consultando", en: null });

      try {
        const publicado = await consultarPublicado(url, { signal });
        if (signal?.aborted) return;

        const vigente = vigenteRef.current;

        if (vigente?.version && publicado.version && vigente.version === publicado.version) {
          setSincronizacion({ fase: manual ? "al-dia" : "reposo", en: Date.now() });
          return;
        }

        // Publicado sin cabeceras con las que versionar. Teniendo copia se
        // prefiere conservarla: volver a bajar 13 MB «por si acaso» es
        // exactamente el gasto que este camino existe para evitar.
        if (vigente && !publicado.version) {
          setSincronizacion({ fase: manual ? "sin-verificar" : "reposo", en: Date.now() });
          return;
        }

        await traer(publicado, { signal, manual, teniaCopia: Boolean(vigente) });
      } catch (error) {
        if (signal?.aborted || error?.name === "AbortError") return;

        // Con copia en pantalla, no poder comprobar la versión no es un fallo
        // que valga romper nada: el catálogo se sigue leyendo igual. Pasa al
        // entrar sin señal, que es cuando más se agradece tenerlo guardado.
        if (vigenteRef.current) {
          console.warn("[catalogos] No se pudo comprobar la versión publicada:", error);
          setSincronizacion({ fase: "error", en: Date.now(), error });
          return;
        }

        // Sin copia y sin poder preguntar la versión, queda intentar la URL de
        // siempre. Un catálogo servido desde alguna caché intermedia es mejor
        // que una pantalla de error.
        try {
          await traer(
            { url, version: null, bytes: null, publicadoEn: null },
            { signal, manual, teniaCopia: false }
          );
        } catch (fallo) {
          if (signal?.aborted || fallo?.name === "AbortError") return;
          setEstado((previo) => ({ ...previo, fase: "error", actualizando: false, error: fallo }));
          setSincronizacion({ fase: "error", en: Date.now(), error: fallo });
        }
      } finally {
        if (revisionRef.current === mia) revisionRef.current = 0;
      }
    },
    [url, traer]
  );

  useEffect(() => {
    if (!url) {
      // Es un fallo de despliegue —la variable de entorno del catálogo quedó
      // vacía—, no un error de red. Se distingue para poder mostrarle al cliente
      // "no disponible" y dejarle a quien despliega la causa real en la consola.
      console.error(
        "[catalogos] No hay URL del catálogo. Define VITE_CATALOGO_ENVASES_PDF / " +
          "VITE_CATALOGO_ESENCIAS_PDF con la URL pública del Blob de Vercel (ver .env.example)."
      );
      vigenteRef.current = null;
      setEstado({ ...VACIO, fase: "sin-configurar" });
      return undefined;
    }

    const control = new AbortController();
    controlRef.current = control;
    let vivo = true;

    // Lo que hubiera en curso quedó abortado por la limpieza anterior, así que
    // no cuenta como revisión viva: sin esto, cambiar de catálogo dejaba la
    // ranura ocupada y el nuevo nunca llegaba a comprobar su versión.
    revisionRef.current = 0;
    vigenteRef.current = null;
    setEstado({ ...VACIO, fase: "consultando" });
    setSincronizacion({ fase: "reposo", en: null });

    (async () => {
      const copia = await copiaGuardada(id);
      if (!vivo) return;
      if (copia) publicar(copia.datos, copia.registro, { desdeCache: true });

      // Aunque haya copia se pregunta igual: el requisito es que el cliente vea
      // lo último publicado, no lo último que descargó.
      await revisar({ signal: control.signal, manual: false });
    })();

    return () => {
      vivo = false;
      control.abort();
    };
  }, [url, id, publicar, revisar]);

  // El aviso de la sincronización manual se retira solo. Se conserva el `en`
  // para poder seguir diciendo cuándo fue la última comprobación.
  useEffect(() => {
    if (!AVISOS_PASAJEROS.has(sincronizacion.fase)) return undefined;
    const temporizador = setTimeout(
      () => setSincronizacion((previo) => ({ fase: "reposo", en: previo.en })),
      6000
    );
    return () => clearTimeout(temporizador);
  }, [sincronizacion]);

  /**
   * Lo que dispara el botón: comprobar metadatos, NO descargar el documento.
   * Sólo baja el archivo si la comprobación dice que hay uno nuevo.
   */
  const sincronizar = useCallback(() => {
    if (!url || revisionRef.current) return;
    revisar({ signal: controlRef.current?.signal, manual: true });
  }, [url, revisar]);

  return { ...estado, sincronizacion, sincronizar };
}
