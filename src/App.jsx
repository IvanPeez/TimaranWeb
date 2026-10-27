import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
const Home = lazy(() => import("../pages/Home/main"));
const CatalogoEsenciasView = lazy(() => import("../pages/catalogoEsencias/CatalogoEsenciasView"));
const CatalogoEnvasesView = lazy(() => import("../pages/catalogoEnvases/CatalogoEnvasesView"));
const CatalogoEsenciasPdf = lazy(() => import("../pages/CatalogoEsenciasPdf/CatalogoEsenciasPdf"));

// "Novedades" no es una vista de la app: es una página aparte servida desde public/novedades.
// Si se llega a /novedades por el router (o por el 404.html de GitHub Pages), se carga esa página.
function IrANovedades() {
  useEffect(() => {
    window.location.replace(`${import.meta.env.BASE_URL}novedades/`);
  }, []);
  return null;
}

function App() {
  return (
      <Suspense fallback={<div role="status" className="flex min-h-screen items-center justify-center bg-ink text-champagne">Cargando…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/esencias" element={<CatalogoEsenciasView />} />
        <Route path="/envases" element={<CatalogoEnvasesView />} />
        <Route path="/esencias/pdf" element={<CatalogoEsenciasPdf />} />
        <Route path="/novedades" element={<IrANovedades />} />

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
