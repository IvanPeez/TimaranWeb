import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "../pages/Home/main";
import CatalogoEsenciasView from "../pages/catalogoEsencias/CatalogoEsenciasView";
import CatalogoEnvasesView from "../pages/catalogoEnvases/CatalogoEnvasesView";
import CatalogoEsenciasPdf from "../pages/CatalogoEsenciasPdf/CatalogoEsenciasPdf";

import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogEsens" element={<CatalogoEsenciasView />} />
        <Route path="/catalogEnvases" element={<CatalogoEnvasesView />} />
        <Route path="/CatalogoEsenciasPdf" element={<CatalogoEsenciasPdf />} />
      </Routes>
  );
}

export default App;
