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
  // Nota: no hace falta historyApiFallback. La app usa HashRouter, así que la
  // ruta viaja en el hash y cualquier recarga directa la sirve index.html.
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.js'],
  },
})
