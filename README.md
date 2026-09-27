# TimaranWeb

Sitio de Distribuciones Timarán: portada, catálogo interactivo de esencias y
catálogos en PDF (esencias y envases).

```bash
npm install
npm run dev
```

Las variables de entorno (WhatsApp y URLs de los catálogos en PDF) están
documentadas en [`.env.example`](.env.example). Copiar ese archivo como `.env`.

## Caché: qué se actualiza solo y qué no

Es la pregunta que más vuelve —"corregí el catálogo y sigue saliendo el
viejo"—, así que conviene tener claro de dónde sale cada cosa.

**Catálogos en PDF** (`/envases`, `/esencias/pdf`). Viven en el Blob de Vercel,
fuera del repositorio. Se actualizan re-subiendo el archivo, sin desplegar.

Cada catálogo pesa ~13 MB y el Blob se factura por byte servido, así que el
visor está construido para descargarlo **una vez por persona y por versión**:

1. Al abrir la pantalla se muestra la copia que el navegador ya tiene guardada
   (Cache Storage, no la caché HTTP: no la desaloja el `max-age`). Sale al
   instante y no cuesta transferencia.
2. En paralelo se pide por `HEAD` la fecha y el tamaño del archivo publicado
   —unos 300 bytes— y se comparan con los de la copia guardada.
3. Sólo si esa huella cambió se bajan los 13 MB, y el catálogo se reemplaza solo
   en pantalla. Quien entra ve siempre lo último publicado.

El botón **Sincronizar** de la barra repite el paso 2 a pedido: comprueba los
metadatos, no vuelve a descargar el documento. Sirve para quien dejó el catálogo
abierto en una pestaña y quiere asegurarse de que no salió uno nuevo.

Descargar el PDF desde el visor tampoco toca el Blob: se guarda desde los bytes
que ya están en el navegador.

Todo eso vive en `utils/catalogoCache.js` (dónde se guarda y cómo se sabe si
sirve), `utils/catalogos.js` (cómo se pregunta la versión) y
`components/PdfFlipbook/useCatalogo.js` (el orden en que se usan). Subir los
archivos con `--cache-control-max-age 86400`; el porqué está en `.env.example`.

**Catálogo interactivo de esencias** (`/esencias`). Los productos están
escritos en `src/services/esenciasBack.js`, es decir, dentro del código: para
cambiar un precio o agregar una esencia hay que editar ese archivo y desplegar.
No hay caché de por medio —`vercel.json` hace que el sitio se revalide en cada
visita—, pero tampoco se actualiza sin un despliegue.

**Resto del sitio.** `vercel.json` cachea para siempre los archivos de
`/assets` (llevan un hash del contenido en el nombre, así que un cambio genera
otro nombre) y obliga a revalidar todo lo demás, `index.html` incluido. Un
despliegue nuevo se ve de inmediato.

## Imágenes rápidas

Las fotos de portada y las fotos disponibles del catálogo se sirven en WebP
como assets propios, con nombres que Vite versiona por contenido. No se
precargan todas las fotos del catálogo: las tarjetas fuera de pantalla usan
carga diferida. Las rutas también se cargan por separado, incluido el visor PDF.

Al agregar o cambiar URLs `picture` en `src/services/esenciasBack.js`, ejecutar:

```bash
npm run images:optimize
```

El script descarga las fuentes, valida que sean imágenes y genera
`resources/optimized/` y `src/services/catalogImages.js`. Incluir ambos en el
commit. Las fuentes descargadas quedan en `.cache/images/` (ignorada por Git);
el build de producción utiliza los archivos versionados, sin descargar fotos.
Las URLs que no responden se registran en `scripts/unavailable-images.json`;
conservan la URL original y el reemplazo local al fallar. Volver a ejecutar el
script permite recuperarlas cuando el proveedor las restablezca. Con
`npm run images:optimize -- --offline` se regeneran solo las fuentes en caché.
Para renovar una imagen cuyo proveedor conservó la misma URL, eliminar su copia
de esa caché antes de ejecutar el script.

La foto de Insumos usa `resources/img/gallery5.jpg`: el antiguo proveedor
externo devuelve 403. El video de portada conserva su duración, sin audio,
con H.264 a 1280px/24fps y `faststart`. Para regenerarlo con FFmpeg:

```bash
ffmpeg -i resources/vid/timaranVid2.mov -an -vf 'scale=1280:-2,fps=24' \
  -c:v libx264 -preset medium -crf 29 -pix_fmt yuv420p -movflags +faststart \
  resources/vid/hero-optimized.mp4
```

El video se descarga después de la carga inicial, solo en escritorio, sin
ahorro de datos ni preferencia de movimiento reducido.
