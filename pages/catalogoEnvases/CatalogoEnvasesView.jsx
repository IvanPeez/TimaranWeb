import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import CatalogHeader from "../../components/CatalogHeader/CatalogHeader";
import { landingMessage, whatsappLink } from "../../utils/contacto";

const MENSAJE =
  "Estoy viendo el catálogo de envases e insumos y quiero cotizar.";

const CatalogoEnvasesView = () => {
  return (
    <div className="flex h-screen flex-col bg-ink">
      <CatalogHeader
        titulo="Envases e insumos"
        mensaje={landingMessage(MENSAJE)}
      />

      <div className="min-h-0 flex-1">
        <iframe
          src="https://online.fliphtml5.com/oeure/qxis/"
          title="Catálogo de envases e insumos"
          className="h-full w-full"
          frameBorder="0"
          allowFullScreen
        />
      </div>

      {/* Salida siempre visible: el flipbook no ofrece ninguna acción propia */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-3 border-t border-white/10 bg-ink-soft px-4 py-3 sm:flex-row">
        <p className="text-xs text-white/45">
          ¿Encontraste lo que buscabas? Te cotizamos por WhatsApp.
        </p>
        <div className="flex gap-2">
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
            to="/catalogo/esencias"
            className="rounded-lg border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-champagne hover:text-champagne"
          >
            Ver esencias
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CatalogoEnvasesView;
