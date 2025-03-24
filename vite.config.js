import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TimaranWeb/',
  server: {
    historyApiFallback: true, // Permite manejar rutas en recargas
  },
})
