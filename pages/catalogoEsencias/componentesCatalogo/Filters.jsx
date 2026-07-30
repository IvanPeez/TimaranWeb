import React, { useState } from "react";
import { ListFilter, Search, SlidersHorizontal, X } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown/Dropdown";
import FiltersPanelMobile from "../../../components/FiltersPanelMobile/FiltersPanelMobile";
import { SORT_OPTIONS } from "./catalogUtils";

const toggleValue = (values, value) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

export function Filters({
  searchQuery,
  setSearchQuery,
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  selectedFamily,
  setSelectedFamily,
  selectedBrands,
  setSelectedBrands,
  opcionesCategory,
  opcionesBrand,
  opcionesGender,
  opcionesFamily,
  sortBy,
  setSortBy,
  resultCount,
  totalCount,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeFilters = [
    ...selectedGender.map((value) => ({
      value,
      remove: () => setSelectedGender(toggleValue(selectedGender, value)),
    })),
    ...selectedCategory.map((value) => ({
      value,
      remove: () => setSelectedCategory(toggleValue(selectedCategory, value)),
    })),
    ...selectedFamily.map((value) => ({
      value,
      remove: () => setSelectedFamily(toggleValue(selectedFamily, value)),
    })),
    ...selectedBrands.map((value) => ({
      value,
      remove: () => setSelectedBrands(toggleValue(selectedBrands, value)),
    })),
  ];

  const activeCount = activeFilters.length;
  const hasActiveFilters = activeCount > 0 || searchQuery.length > 0;

  const clearAllFilters = () => {
    setSelectedGender([]);
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedFamily([]);
    setSearchQuery("");
  };

  const handleOpenFilters = (filterType) =>
    setOpenDropdown(openDropdown === filterType ? null : filterType);

  return (
    <>
      <div className="sticky top-14 z-40 border-y border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Búsqueda */}
            <div className="relative min-w-0 flex-1 md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                placeholder="Buscar por nombre o inspiración..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-white/35 focus:border-champagne/50 focus:outline-none focus:ring-1 focus:ring-champagne/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filtros desktop */}
            <div className="hidden items-center gap-1 md:flex">
              <Dropdown
                label="Género"
                options={opcionesGender}
                selectedValues={selectedGender}
                onChange={setSelectedGender}
                isOpen={openDropdown === "gender"}
                onToggle={() => handleOpenFilters("gender")}
              />
              <Dropdown
                label="Categoría"
                options={[...opcionesCategory, "Novedades"]}
                selectedValues={selectedCategory}
                onChange={setSelectedCategory}
                isOpen={openDropdown === "category"}
                onToggle={() => handleOpenFilters("category")}
              />
              <Dropdown
                label="Familia olfativa"
                align="right"
                options={opcionesFamily}
                selectedValues={selectedFamily}
                onChange={setSelectedFamily}
                isOpen={openDropdown === "family"}
                onToggle={() => handleOpenFilters("family")}
              />
              <Dropdown
                label="Inspiración"
                align="right"
                options={opcionesBrand}
                selectedValues={selectedBrands}
                onChange={setSelectedBrands}
                isOpen={openDropdown === "brand"}
                onToggle={() => handleOpenFilters("brand")}
              />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* Orden */}
              <div className="relative hidden lg:block">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Ordenar catálogo"
                  className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-8 text-sm text-white/80 focus:border-champagne/50 focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-ink-card text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón filtros móvil */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 md:hidden"
              >
                <ListFilter className="h-4 w-4" />
                Filtros
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-champagne px-1 text-[11px] font-semibold text-ink">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Chips activos + conteo */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="shrink-0 text-xs text-white/40">
              <span className="text-champagne">{resultCount}</span> de{" "}
              {totalCount} esencias
            </span>

            {activeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={filter.remove}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 py-1 pl-3 pr-2 text-xs text-champagne transition-colors hover:bg-champagne/20"
              >
                {filter.value}
                <X className="h-3 w-3" />
              </button>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="shrink-0 rounded-full px-3 py-1 text-xs text-white/45 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Limpiar todo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel de filtros móvil */}
      {isMobileFiltersOpen && (
        <FiltersPanelMobile
          onClose={() => setIsMobileFiltersOpen(false)}
          onClear={clearAllFilters}
          resultCount={resultCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFamily={selectedFamily}
          setSelectedFamily={setSelectedFamily}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          opcionesBrand={opcionesBrand}
          opcionesCategory={opcionesCategory}
          opcionesFamily={opcionesFamily}
          opcionesGender={opcionesGender}
        />
      )}

      {/* Cierre de dropdowns al hacer click afuera */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
}
