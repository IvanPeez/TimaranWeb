import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
const Home = lazy(() => import("../pages/Home/main"));
const CatalogoEsenciasView = lazy(() => import("../pages/catalogoEsencias/CatalogoEsenciasView"));
const CatalogoEnvasesView = lazy(() => import("../pages/catalogoEnvases/CatalogoEnvasesView"));
const CatalogoEsenciasPdf = lazy(() => import("../pages/CatalogoEsenciasPdf/CatalogoEsenciasPdf"));

function App() {
  return (
      <Suspense fallback={<div role="status" className="flex min-h-screen items-center justify-center bg-ink text-champagne">Cargando…</div>}>
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
      </Suspense>
  );
}

export default App;
