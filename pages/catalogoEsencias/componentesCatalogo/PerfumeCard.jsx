import React from "react";
import { Check, Plus, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  esNovedad,
  handleImageError,
  inspiredBy,
  pictureOf,
  singleQuoteMessage,
  whatsappLink,
} from "./catalogUtils";

export function PerfumeCard({ perfume, isSelected, onToggleSelect, onOpen, index = 0 }) {
  const family =
    perfume.family && perfume.family !== "Desconocido" ? perfume.family : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card text-left shadow-lg shadow-black/40 transition-all duration-500 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-2xl hover:shadow-black/60 animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 9) * 45}ms` }}
    >
      {/* Imagen */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver detalle de ${perfume.newName}`}
        className="relative block aspect-[4/5] w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
      >
        <img
          src={pictureOf(perfume)}
          onError={handleImageError}
          alt={perfume.newName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-card via-ink-card/10 to-transparent" />

        {/* Etiquetas */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {esNovedad(perfume) && (
            <span className="flex items-center gap-1 rounded-full bg-champagne px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
              <Sparkles className="h-3 w-3" />
              Novedad
            </span>
          )}
          {perfume.category === "Nicho" && (
            <span className="rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
              Nicho
            </span>
          )}
        </div>

        {/* Guardar en la selección */}
        <span
          role="button"
          tabIndex={0}
          aria-label={
            isSelected ? "Quitar de mi selección" : "Agregar a mi selección"
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleSelect();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onToggleSelect();
            }
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            isSelected
              ? "border-champagne bg-champagne text-ink"
              : "border-white/25 bg-black/40 text-white hover:border-champagne hover:text-champagne"
          }`}
        >
          {isSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </span>

        {/* Pill de hover (desktop) */}
        <span className="pointer-events-none absolute inset-x-0 bottom-3 hidden justify-center md:flex">
          <span className="translate-y-3 rounded-full border border-white/25 bg-black/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Ver detalle
          </span>
        </span>
      </button>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <p className="min-h-[14px] text-[10px] uppercase tracking-[0.22em] text-champagne/70">
          {family || " "}
        </p>

        <h3 className="mt-1 font-titleAlt text-xl italic leading-tight text-white">
          {perfume.newName}
        </h3>

        <p className="mt-1 text-xs leading-snug text-white/45">
          Inspirada en {inspiredBy(perfume.name)}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            onClick={onToggleSelect}
            className={`flex-1 rounded-lg border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
              isSelected
                ? "border-champagne/60 bg-champagne/10 text-champagne"
                : "border-white/15 text-white/70 hover:border-champagne/60 hover:text-champagne"
            }`}
          >
            {isSelected ? "Agregada" : "Cotizar"}
          </button>

          <a
            href={whatsappLink(singleQuoteMessage(perfume))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar ${perfume.newName} por WhatsApp`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors duration-300 hover:border-[#25D366] hover:text-[#25D366]"
          >
            <FaWhatsapp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
