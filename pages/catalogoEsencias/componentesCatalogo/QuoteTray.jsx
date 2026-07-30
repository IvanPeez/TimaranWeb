import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  handleImageError,
  inspiredBy,
  listQuoteMessage,
  pictureOf,
  whatsappLink,
} from "./catalogUtils";

export function QuoteTray({ items, onRemove, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] animate-tray-in px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-champagne/30 bg-ink-soft/95 shadow-2xl shadow-black/70 backdrop-blur-xl">
        {/* Lista desplegable */}
        {isOpen && (
          <div className="max-h-64 overflow-y-auto border-b border-white/[0.07] p-3">
            <ul className="space-y-1">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
                >
                  <img
                    src={pictureOf(item)}
                    onError={handleImageError}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate font-titleAlt text-base italic text-white">
                      {item.newName}
                    </p>
                    <p className="truncate text-[11px] text-white/40">
                      Inspirada en {inspiredBy(item.name)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Quitar ${item.newName}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onClear}
              className="mt-2 flex items-center gap-2 px-2 py-1 text-xs text-white/40 transition-colors hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Vaciar selección
            </button>
          </div>
        )}

        {/* Barra principal */}
        <div className="flex items-center gap-3 p-3">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne font-semibold text-ink">
              {items.length}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white">
                Mi selección
              </span>
              <span className="block truncate text-[11px] text-white/45">
                {items.length === 1
                  ? "1 esencia lista para cotizar"
                  : `${items.length} esencias listas para cotizar`}
              </span>
            </span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
            ) : (
              <ChevronUp className="h-4 w-4 shrink-0 text-white/40" />
            )}
          </button>

          <a
            href={whatsappLink(listQuoteMessage(items))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-champagne px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:bg-champagne-light sm:px-6 sm:text-sm"
          >
            <FaWhatsapp className="h-4 w-4" />
            <span className="hidden sm:inline">Solicitar cotización</span>
            <span className="sm:hidden">Cotizar</span>
          </a>
        </div>
      </div>
    </div>
  );
}
