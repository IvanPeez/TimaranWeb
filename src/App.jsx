import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "../pages/Home/main";
import CatalogoEsenciasView from "../pages/catalogoEsencias/CatalogoEsenciasView";

import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogEsens" element={<CatalogoEsenciasView />} />
      </Routes>
  );
}

export default App;
