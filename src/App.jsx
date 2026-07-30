import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/main";
import CatalogoEsenciasView from "../pages/catalogoEsencias/CatalogoEsenciasView";
import CatalogoEnvasesView from "../pages/catalogoEnvases/CatalogoEnvasesView";
import CatalogoEsenciasPdf from "../pages/CatalogoEsenciasPdf/CatalogoEsenciasPdf";

import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/esencias" element={<CatalogoEsenciasView />} />
        <Route path="/envases" element={<CatalogoEnvasesView />} />
        <Route path="/esencias/pdf" element={<CatalogoEsenciasPdf />} />

        {/* Rutas antiguas: se mantienen redirigiendo para no romper enlaces ya compartidos */}
        <Route path="/catalogo/esencias/pdf" element={<Navigate to="/esencias/pdf" replace />} />
        <Route path="/catalogo/esencias" element={<Navigate to="/esencias" replace />} />
        <Route path="/catalogo/envases" element={<Navigate to="/envases" replace />} />
        <Route path="/catalogo" element={<Navigate to="/esencias" replace />} />
        <Route path="/catalogEsens" element={<Navigate to="/esencias" replace />} />
        <Route path="/catalogEnvases" element={<Navigate to="/envases" replace />} />
        <Route path="/CatalogoEsenciasPdf" element={<Navigate to="/esencias/pdf" replace />} />

        {/* Cualquier otra ruta vuelve al inicio en vez de mostrar una página en blanco */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
