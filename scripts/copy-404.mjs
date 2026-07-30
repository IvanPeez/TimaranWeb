// GitHub Pages no tiene rewrites: al recargar /TimaranWeb/esencias
// devuelve un 404 y sirve 404.html. Copiando ahí el index.html construido, la
// app arranca igual y BrowserRouter resuelve la ruta.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("dist/404.html creado (fallback SPA para GitHub Pages)");
