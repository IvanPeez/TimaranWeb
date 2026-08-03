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
fuera del repositorio. Se actualizan re-subiendo el archivo, sin desplegar. El
navegador de quien ya lo abrió guardaba el PDF durante días, así que la app
consulta primero qué versión hay publicada y pide la URL con un `?v=` que sólo
cambia cuando cambia el archivo (`utils/catalogos.js`). Subirlos siempre con
`--cache-control-max-age 60`; el detalle está en `.env.example`.

**Catálogo interactivo de esencias** (`/esencias`). Los productos están
escritos en `src/services/esenciasBack.js`, es decir, dentro del código: para
cambiar un precio o agregar una esencia hay que editar ese archivo y desplegar.
No hay caché de por medio —`vercel.json` hace que el sitio se revalide en cada
visita—, pero tampoco se actualiza sin un despliegue.

**Resto del sitio.** `vercel.json` cachea para siempre los archivos de
`/assets` (llevan un hash del contenido en el nombre, así que un cambio genera
otro nombre) y obliga a revalidar todo lo demás, `index.html` incluido. Un
despliegue nuevo se ve de inmediato.
