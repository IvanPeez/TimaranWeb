import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logoNav from "../../resources/SVG/logoNav.svg";
import { advisorMessage, whatsappLink } from "../../utils/contacto";

/**
 * Barra superior compartida por las tres vistas de catálogo. Garantiza que
 * ninguna sea un callejón sin salida: siempre hay vuelta al inicio y WhatsApp.
 */
const CatalogHeader = ({ titulo, mensaje }) => {
  return (
    <header className="sticky top-0 z-50 h-14 shrink-0 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 text-white/60 transition-colors hover:text-white"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <img
              src={logoNav}
              alt="Distribuciones Timarán"
              className="h-7 w-auto"
            />
          </Link>
          {titulo && (
            <span className="hidden truncate border-l border-white/10 pl-3 text-sm text-white/50 sm:inline">
              {titulo}
            </span>
          )}
        </div>

        <a
          href={whatsappLink(mensaje || advisorMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full border border-champagne/40 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-champagne transition-colors hover:bg-champagne hover:text-ink"
        >
          <FaWhatsapp className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Hablar con un asesor</span>
          <span className="sm:hidden">Asesor</span>
        </a>
      </div>
    </header>
  );
};

export default CatalogHeader;
