import React, { useEffect } from "react";
import { Check, Droplets, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { AccionesImagen } from "./AccionesImagen";
import {
  DISCLAIMER,
  PRESENTACIONES,
  esNovedad,
  handleImageError,
  inspiredBy,
  pictureOf,
  singleQuoteMessage,
  tieneFoto,
  whatsappLink,
} from "./catalogUtils";

const BENEFICIOS = [
  { icon: Droplets, text: "Alta concentración y fijación prolongada" },
  { icon: ShieldCheck, text: "Calidad constante lote a lote" },
  { icon: Truck, text: "Envíos a todo el país" },
];

export function PerfumeModal({ perfume, onClose, isSelected, onToggleSelect }) {
  useEffect(() => {
    if (!perfume) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [perfume, onClose]);

  if (!perfume) return null;

  const tags = [perfume.gender, perfume.category, perfume.family].filter(
    (tag) => tag && tag !== "Desconocido"
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={perfume.newName}
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-ink-soft shadow-2xl shadow-black/80 sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-colors hover:border-champagne hover:text-champagne"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2">
          {/* Imagen */}
          <div className="relative h-64 w-full overflow-hidden bg-ink md:h-full md:min-h-[34rem]">
            <img
              src={pictureOf(perfume)}
              onError={handleImageError}
              alt={perfume.newName}
              className="h-full w-full object-cover"
            />
            {/* `pointer-events-none`: el degradado es decoración y estaba
                tapando la foto, así que el clic derecho caía sobre él y el
                menú del navegador se quedaba sin "Copiar imagen". */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink-soft" />
            {esNovedad(perfume) && (
              <span className="absolute left-4 top-4 rounded-full bg-champagne px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                Novedad
              </span>
            )}
          </div>

          {/* Detalle */}
          <div className="flex flex-col gap-6 p-6 text-left sm:p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-champagne/80">
                Esencia de autor
              </p>
              <h2 className="mt-2 font-titleAlt text-4xl italic leading-none text-white sm:text-5xl">
                {perfume.newName}
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Inspirada en{" "}
                <span className="text-white/80">{inspiredBy(perfume.name)}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* La foto es lo que el vendedor le manda al cliente, así que va
                arriba: sin esto tocaba clic derecho sobre la imagen, que en
                celular no existe. */}
            {tieneFoto(perfume) && (
              <AccionesImagen perfume={perfume} url={pictureOf(perfume)} />
            )}

            {/* Presentaciones (sin precios) */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.22em] text-white/60">
                Presentaciones disponibles
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESENTACIONES.map((item) => (
                  <span
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85"
                  >
                    {item.label}
                    {item.note && (
                      <span className="ml-2 text-[10px] uppercase tracking-[0.1em] text-champagne/70">
                        {item.note}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/45">
                El precio por gramo mejora a mayor cantidad. Escríbenos y un
                asesor te arma la cotización a tu medida.
              </p>
            </div>

            {/* Beneficios */}
            <ul className="grid gap-2 border-t border-white/[0.07] pt-5">
              {BENEFICIOS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-white/70"
                >
                  <Icon className="h-4 w-4 shrink-0 text-champagne" />
                  {text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(singleQuoteMessage(perfume))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-champagne px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne-light"
              >
                <FaWhatsapp className="h-4 w-4" />
                Pedir precio
              </a>
              <button
                type="button"
                onClick={onToggleSelect}
                className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                  isSelected
                    ? "border-champagne/60 bg-champagne/10 text-champagne"
                    : "border-white/20 text-white/80 hover:border-champagne hover:text-champagne"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="h-4 w-4" /> En mi selección
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Agregar
                  </>
                )}
              </button>
            </div>

            <p className="text-xs leading-relaxed text-white/55">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
