// Copia local de los catálogos en PDF: dónde se guarda y cómo se sabe si sirve.
//
// ————————————————————————————————————————————————————————————
// EL PROBLEMA
// ————————————————————————————————————————————————————————————
// Cada catálogo pesa ~13 MB y vive en el Blob de Vercel, que factura por byte
// servido. La app pedía el PDF en cada apertura del visor y el Blob se sube con
// `--cache-control-max-age 60`, así que la caché del navegador lo soltaba al
// minuto: quien entraba dos veces en la misma tarde pagaba 26 MB de cuota. Con
// unos cientos de visitas al mes se agotó el límite del plan.
//
// La caché HTTP no se podía usar para arreglarlo. La gobierna el servidor con
// `max-age` y el navegador la desaloja cuando le hace falta espacio, sin avisar
// ni dejar preguntar qué guardó. Y subir el `max-age` a semanas era justo el
// problema que este repositorio ya había resuelto en sentido contrario: un
// precio corregido tardaba un mes en verse.
//
// ————————————————————————————————————————————————————————————
// LA SOLUCIÓN: DOS COSAS SEPARADAS
// ————————————————————————————————————————————————————————————
// 1. El ARCHIVO se guarda en Cache Storage, que es almacenamiento de la
//    aplicación y no caché del protocolo: sobrevive al cierre del navegador y
//    sólo desaparece si el usuario borra los datos del sitio. Un catálogo se
//    baja una vez y se abre gratis para siempre.
//
// 2. La FRESCURA se comprueba aparte, con un HEAD de ~300 bytes que devuelve la
//    huella de lo publicado (ver consultarPublicado en catalogos.js). Comparar
//    esa huella con la de la copia guardada responde «¿hay algo nuevo?» sin
//    descargar nada. Eso es lo que permite verificar en CADA visita, y también
//    lo que hace el botón «Sincronizar».
//
// ————————————————————————————————————————————————————————————
// LA LLAVE ES LA VERSIÓN, Y ESO NO ES UN DETALLE
// ————————————————————————————————————————————————————————————
// Cada entrada se guarda con la URL VERSIONADA (…/esencias.pdf?v=<huella>) como
// llave. Así «¿tengo lo último?» se contesta con una coincidencia exacta: si la
// huella publicada es la de mi llave, no hay nada que bajar; si no, no la tengo
// y punto.
//
// La alternativa —guardar el archivo bajo su URL pelada y anotar la versión en
// un registro aparte— parece igual pero se desincroniza: el navegador puede
// desalojar el archivo y dejar el registro, o al revés, y entonces el registro
// afirma tener una versión que no está. Aquí ese estado no se puede representar.
//
// El índice de localStorage que se lleva abajo es SÓLO para mostrar en pantalla
// («catálogo del 3 de agosto, 13,2 MB») y para saber qué llave buscar. Nunca es
// la autoridad sobre qué hay guardado: eso lo dice Cache Storage.

const CACHE = "catalogos-timaran-v1";
const INDICE = "timaran:catalogos";

/**
 * ¿Se puede guardar en este navegador?
 *
 * Cache Storage exige contexto seguro (https o localhost) y no existe en el
 * modo privado de algunos navegadores. Cuando falta, la app funciona igual —
 * baja el PDF en cada visita, como antes— en vez de romperse. Es exactamente el
 * caso que hay que degradar en silencio: el visitante no puede hacer nada al
 * respecto y el catálogo sí se le puede mostrar.
 */
export const puedeGuardar = () =>
  typeof window !== "undefined" && "caches" in window && window.isSecureContext !== false;

const abrirCache = () => caches.open(CACHE);

// ---------------------------------------------------------------------------
// Índice: qué copia hay de cada catálogo (sólo para mostrar y para saber
// qué llave pedirle a Cache Storage)
// ---------------------------------------------------------------------------

// Todo lo de localStorage va envuelto en try/catch: en modo privado de Safari
// escribir lanza QuotaExceededError, y perder el índice no puede tumbar el
// visor. Sin índice simplemente se vuelve a descargar el catálogo.

function leerIndice() {
  try {
    const crudo = localStorage.getItem(INDICE);
    const datos = crudo ? JSON.parse(crudo) : null;
    return datos && typeof datos === "object" ? datos : {};
  } catch {
    return {};
  }
}

function escribirIndice(indice) {
  try {
    localStorage.setItem(INDICE, JSON.stringify(indice));
  } catch {
    // Sin índice se pierde el "guardado el 3 de agosto" de la pantalla y la
    // próxima visita vuelve a bajar el PDF. Molesto, no grave.
  }
}

/** Lo que se anotó de un catálogo, sin comprobar que el archivo siga ahí. */
export function registroDe(id) {
  const registro = leerIndice()[id];
  return registro && registro.version && registro.llave ? registro : null;
}

// ---------------------------------------------------------------------------
// Leer y guardar el archivo
// ---------------------------------------------------------------------------

/**
 * La copia guardada de un catálogo, si de verdad está.
 *
 * Devuelve `null` cuando no hay nada útil, incluido el caso de que el índice
 * anote una versión cuyo archivo el navegador ya desalojó. En ese caso además
 * se limpia el índice, para que la pantalla no prometa una copia que no existe.
 *
 * Los bytes salen como Uint8Array —lo mismo que devuelve `descargar`— para que
 * a quien los use le dé igual de dónde vinieron.
 */
export async function copiaGuardada(id) {
  const registro = registroDe(id);
  if (!registro || !puedeGuardar()) return null;

  try {
    const cache = await abrirCache();
    const respuesta = await cache.match(registro.llave);
    if (!respuesta) {
      olvidarRegistro(id);
      return null;
    }
    return { datos: new Uint8Array(await respuesta.arrayBuffer()), registro };
  } catch (error) {
    console.warn("[catalogos] No se pudo leer la copia guardada:", error);
    return null;
  }
}

/**
 * Guarda el catálogo recién bajado y tira las versiones anteriores.
 *
 * El borrado de lo viejo va aquí y no en un mantenimiento aparte porque es el
 * único momento en que se sabe con certeza cuál es la llave vigente. Sin él,
 * cada temporada dejaría 13 MB más de basura en el equipo del cliente.
 *
 * Si guardar falla (cuota llena, almacenamiento bloqueado) no se propaga el
 * error: el catálogo ya está descargado y en pantalla, y lo único que se pierde
 * es la ventaja en la próxima visita. El registro se devuelve igual —la pantalla
 * lo usa para decir qué versión se está leyendo— pero con `guardado` en false, y
 * el índice no se escribe: un índice que promete una copia que no existe hace
 * que la próxima visita la busque, no la encuentre y la borre.
 */
export async function guardarCopia(id, { llave, version, datos, bytes, publicadoEn }) {
  const registro = {
    llave,
    version,
    bytes: bytes ?? datos.byteLength,
    publicadoEn: publicadoEn ?? null,
    guardadoEn: Date.now(),
    guardado: false,
  };

  if (puedeGuardar()) {
    try {
      const cache = await abrirCache();

      // Fuera lo anterior de ESTE catálogo, y ANTES de guardar lo nuevo. Se
      // filtra por la URL sin query para no llevarse por delante el otro
      // catálogo, que vive en el mismo Cache Storage.
      //
      // Borrar primero es lo que lo hace seguro. Al revés habría que excluir la
      // llave recién escrita comparándola con la que devuelve Cache Storage, y
      // eso depende de que la URL normalizada por el navegador coincida carácter
      // a carácter con la nuestra; si algún día no coincidiera, el barrido
      // borraría justo lo que se acaba de guardar y nunca habría copia.
      const base = llave.split("?")[0];
      for (const peticion of await cache.keys()) {
        if (peticion.url.split("?")[0] === base) await cache.delete(peticion);
      }

      // El Response se construye aquí en vez de guardar el de la red porque el
      // cuerpo de aquél ya se consumió al leerlo con progreso.
      await cache.put(
        llave,
        new Response(datos, { headers: { "content-type": "application/pdf" } })
      );

      registro.guardado = true;
      escribirIndice({ ...leerIndice(), [id]: registro });
    } catch (error) {
      console.warn("[catalogos] No se pudo guardar el catálogo para la próxima visita:", error);
    }
  }

  return registro;
}

/** Olvida lo anotado de un catálogo (el archivo puede seguir en la caché). */
function olvidarRegistro(id) {
  const indice = leerIndice();
  if (!(id in indice)) return;
  delete indice[id];
  escribirIndice(indice);
}

// ---------------------------------------------------------------------------
// Descargar
// ---------------------------------------------------------------------------

/** Junta los trozos leídos del cuerpo en un solo bloque de bytes. */
function unir(trozos, total) {
  const salida = new Uint8Array(total);
  let offset = 0;
  for (const trozo of trozos) {
    salida.set(trozo, offset);
    offset += trozo.length;
  }
  return salida;
}

/**
 * Baja el catálogo entero informando el avance.
 *
 * Se lee el cuerpo a mano, trozo a trozo, en vez de un `arrayBuffer()` de una
 * sola vez: son 13 MB y sin barra de progreso la pantalla se queda varios
 * segundos en blanco y parece rota. Ésta es la única función del módulo que
 * gasta cuota del Blob, y por eso todo lo demás existe — para llamarla lo menos
 * posible.
 *
 * NO lleva `cache: "no-store"`. Es a propósito: la URL ya viene versionada, así
 * que una copia en la caché HTTP del navegador no puede estar desactualizada, y
 * si el navegador puede responder con ella se ahorra otra descarga.
 */
export async function descargar(url, { signal, onProgreso } = {}) {
  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) throw new Error(`No se pudo descargar el catálogo (HTTP ${respuesta.status})`);

  const total = Number(respuesta.headers.get("content-length")) || 0;

  // Sin cuerpo transmisible (navegadores viejos) se cae al camino simple: se
  // pierde la barra de progreso, no el catálogo.
  if (!respuesta.body?.getReader) {
    const datos = new Uint8Array(await respuesta.arrayBuffer());
    onProgreso?.(1);
    return datos;
  }

  const lector = respuesta.body.getReader();
  const trozos = [];
  let recibido = 0;

  while (true) {
    const { done, value } = await lector.read();
    if (done) break;
    trozos.push(value);
    recibido += value.length;
    if (total) onProgreso?.(Math.min(1, recibido / total));
  }

  onProgreso?.(1);
  return unir(trozos, recibido);
}
