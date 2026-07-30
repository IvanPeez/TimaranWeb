import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 🔹 SOLO aquí debe ir el Router
import "./index.css";
import App from "./App.jsx";

// URLs limpias, sin "#". El basename lo pone Vite: "/" en Vercel y
// "/TimaranWeb/" en GitHub Pages (ver vite.config.js).
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);