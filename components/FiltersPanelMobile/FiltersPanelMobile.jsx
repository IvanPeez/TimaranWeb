import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { DropdownMobile } from "../DropdownMobile/DropdownMobile";
import { SORT_OPTIONS } from "../../pages/catalogoEsencias/componentesCatalogo/catalogUtils";

const FiltersPanelMobile = ({
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  selectedFamily,
  setSelectedFamily,
  selectedBrands,
  setSelectedBrands,
  opcionesGender,
  opcionesCategory,
  opcionesFamily,
  opcionesBrand,
  sortBy,
  setSortBy,
  resultCount,
  onClear,
  onClose,
}) => {
  const [openSection, setOpenSection] = useState("gender");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-ink md:hidden">
      {/* Encabezado */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="font-titleAlt text-2xl italic text-white">Filtros</h2>
        <button
          type="button"
          onClick={() => onClose && onClose(false)}
          aria-label="Cerrar filtros"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto px-5 scrollbar-thin">
        <div className="py-2">
          <p className="pt-4 text-xs uppercase tracking-[0.2em] text-white/40">
            Ordenar por
          </p>
          <div className="mt-3 flex flex-wrap gap-2 pb-4">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortBy(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  sortBy === option.value
                    ? "border-champagne bg-champagne/10 text-champagne"
                    : "border-white/10 text-white/60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <DropdownMobile
          label="Género"
          options={opcionesGender}
          selectedValues={selectedGender}
          onChange={setSelectedGender}
          isOpen={openSection === "gender"}
          onToggle={() => toggleSection("gender")}
        />
        <DropdownMobile
          label="Categoría"
          options={[...opcionesCategory, "Novedades"]}
          selectedValues={selectedCategory}
          onChange={setSelectedCategory}
          isOpen={openSection === "category"}
          onToggle={() => toggleSection("category")}
        />
        <DropdownMobile
          label="Familia olfativa"
          options={opcionesFamily}
          selectedValues={selectedFamily}
          onChange={setSelectedFamily}
          isOpen={openSection === "family"}
          onToggle={() => toggleSection("family")}
        />
        <DropdownMobile
          label="Inspiración"
          options={opcionesBrand}
          selectedValues={selectedBrands}
          onChange={setSelectedBrands}
          isOpen={openSection === "brand"}
          onToggle={() => toggleSection("brand")}
        />
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 items-center gap-3 border-t border-white/[0.07] bg-ink-soft px-5 py-4">
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={() => onClose && onClose(false)}
          className="flex-1 rounded-xl bg-champagne px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink"
        >
          Ver {resultCount} esencias
        </button>
      </div>
    </div>
  );
};

export default FiltersPanelMobile;
