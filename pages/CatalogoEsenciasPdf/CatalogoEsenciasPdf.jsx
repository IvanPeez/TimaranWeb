import React from "react";
import { Link } from "react-router-dom";
import CatalogHeader from "../../components/CatalogHeader/CatalogHeader";
import { landingMessage } from "../../utils/contacto";

const CatalogoEsenciasPdf = () => {
  return (
    <div className="flex h-screen flex-col bg-ink">
      <CatalogHeader
        titulo="Catálogo de esencias en PDF"
        mensaje={landingMessage(
          "Estoy viendo el catálogo de esencias en PDF y quiero cotizar."
        )}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center gap-3 p-4">
        <div className="w-full max-w-6xl flex-1 overflow-hidden rounded-lg shadow">
          <iframe
            src="https://drive.google.com/file/d/1fMwvLGH8Dwf6xY1lJ8Lw8rVmAKFI285U/preview"
            className="h-full w-full"
            allow="autoplay"
            title="Catálogo de esencias en PDF"
          />
        </div>

        <p className="text-center text-xs text-white/40">
          ¿Prefieres buscar y filtrar?{" "}
          <Link
            to="/esencias"
            className="text-champagne underline-offset-4 hover:underline"
          >
            Abre el catálogo interactivo
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CatalogoEsenciasPdf;
