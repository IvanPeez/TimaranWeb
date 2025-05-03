import CatalogoEnvases from "./EnvasesComponente/CatalogoEnvases";
import React from "react";

function CatalogoEnvasesView() {
    return (
      <div className="min-h-screen bg-[#141416] p-4">
        <header className="text-white text-center py-6">
          <h1 className="text-4xl font-titleAlt italic font-bold">Catálogo de Productos</h1>
          <p className="text-gray-400 mt-2">Desliza las páginas para explorar</p>
        </header>
  
        {/* Aquí se renderiza el PDF como flipbook */}
        <div className="flex justify-center h-[100vh] w-full">
          <CatalogoEnvases />
        </div>
      </div>
    );
  }
  
  export default CatalogoEnvasesView;