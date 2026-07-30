import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el sitio bajo /TimaranWeb/, pero Vercel lo sirve desde la
// raíz del dominio. Con un base fijo, uno de los dos queda con todos los assets
// en 404, así que se decide según el entorno (Vercel define VERCEL=1).
const base = process.env.VERCEL ? '/' : '/TimaranWeb/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  // La app usa BrowserRouter (URLs sin #). En dev, Vite ya sirve index.html
  // para cualquier ruta desconocida; en producción el fallback lo dan
  // vercel.json (rewrites) y dist/404.html (GitHub Pages).
  server: {
    // Permite levantar el dev server en un puerto asignado por el entorno.
    port: Number(process.env.PORT) || 5173,
  },
  optimizeDeps: {
    // pdf.js se publica como UMD; pre-empaquetarlo evita que Vite lo re-analice
    // en caliente la primera vez que se abre el visor del catálogo. El worker
    // NO va aquí: se importa con `?url` y debe quedar como asset suelto.
    include: ['pdfjs-dist/build/pdf'],
  },
})
