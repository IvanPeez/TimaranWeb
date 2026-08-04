import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import CatalogHeader from "../../components/CatalogHeader/CatalogHeader";
import { PDF_ENVASES } from "../../utils/catalogos";
import { landingMessage, whatsappLink } from "../../utils/contacto";

// pdf.js pesa ~350 KB minificado y sólo hace falta en esta pantalla: cargarlo
// aparte evita meterlo en el bundle que descarga quien entra a la portada.
const PdfFlipbook = lazy(() => import("../../components/PdfFlipbook/PdfFlipbook"));

const MENSAJE =
  "Estoy viendo el catálogo de envases e insumos y quiero cotizar.";

const CatalogoEnvasesView = () => {
  return (
    <div className="flex h-screen flex-col bg-ink">
      <CatalogHeader
        titulo="Envases e insumos"
        mensaje={landingMessage(MENSAJE)}
      />

      {/* Visor propio. Antes esto era un iframe a fliphtml5: no se podía buscar
          dentro del catálogo, ni controlarlo, ni saber si el servicio seguía
          en pie. Ahora el PDF vive en el Blob de Vercel y pdf.js lo renderiza
          aquí, con el buscador incluido. */}
      <Suspense
        fallback={
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-champagne" />
          </div>
        }
      >
        <PdfFlipbook
          fileUrl={PDF_ENVASES}
          catalogoId="envases"
          downloadName="catalogo-envases-timaran.pdf"
          actions={
            <div className="flex items-center gap-2">
              <a
                href={whatsappLink(landingMessage(MENSAJE))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-champagne px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-champagne-light"
              >
                <FaWhatsapp className="h-3.5 w-3.5" />
                Cotizar
              </a>
              <Link
                to="/esencias"
                className="rounded-lg border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-champagne hover:text-champagne"
              >
                Ver esencias
              </Link>
            </div>
          }
        />
      </Suspense>
    </div>
  );
};

export default CatalogoEnvasesView;
