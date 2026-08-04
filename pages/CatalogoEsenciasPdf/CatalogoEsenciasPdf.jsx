import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import CatalogHeader from "../../components/CatalogHeader/CatalogHeader";
import { PDF_ESENCIAS } from "../../utils/catalogos";
import { landingMessage, whatsappLink } from "../../utils/contacto";

// Mismo visor que envases, cargado aparte para no meter pdf.js en el bundle
// que descarga quien entra a la portada.
const PdfFlipbook = lazy(() => import("../../components/PdfFlipbook/PdfFlipbook"));

const MENSAJE = "Estoy viendo el catálogo de esencias en PDF y quiero cotizar.";

const CatalogoEsenciasPdf = () => {
  return (
    <div className="flex h-screen flex-col bg-ink">
      <CatalogHeader
        titulo="Catálogo de esencias en PDF"
        mensaje={landingMessage(MENSAJE)}
      />

      {/* Antes era un iframe al visor de Google Drive: no dejaba buscar dentro
          del catálogo, mostraba la interfaz de Drive encima de la marca y
          dependía de un archivo compartido que cualquiera podía mover. Ahora
          el PDF vive en el Blob de Vercel y lo abre el visor propio. */}
      <Suspense
        fallback={
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-champagne" />
          </div>
        }
      >
        <PdfFlipbook
          fileUrl={PDF_ESENCIAS}
          catalogoId="esencias"
          downloadName="catalogo-esencias-timaran.pdf"
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
                title="Buscar y filtrar por familia olfativa, género o inspiración"
                className="rounded-lg border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-champagne hover:text-champagne"
              >
                Catálogo interactivo
              </Link>
            </div>
          }
        />
      </Suspense>
    </div>
  );
};

export default CatalogoEsenciasPdf;
