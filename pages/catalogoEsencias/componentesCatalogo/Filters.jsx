import React, { useState } from "react";
import { Search, X, ListFilterIcon } from "lucide-react";
import { label } from "motion/react-client";
import { Dropdown } from "../../../components/Dropdown/Dropdown";

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
  isScrolled,
}) {
  const [sectionsOpen, setSectionsOpen] = useState({
    gender: true,
    category: true,
    brand: true,
    family: true,
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleSection = (section) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedGender.length > 0 ||
    selectedCategory.length > 0 ||
    selectedBrands.length > 0 ||
    selectedFamily.length > 0;

  const clearAllFilters = () => {
    setSelectedGender([]);
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedFamily([]);
    setSearchQuery("");
  };

  const FiltersContent = () => (
    <>
      <div className="relative w-full md:w-auto md:flex">
        {/* Gender Filter */}
        <Dropdown
          label="Género"
          options={opcionesGender}
          selectedValues={selectedGender}
          onChange={setSelectedGender}
          isOpen={openDropdown === "gender"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "gender" ? null : "gender")
          }
        />

        {/* Category Filter */}
        <Dropdown
          label="Categoría"
          options={[...opcionesCategory, "Novedades"]}
          selectedValues={selectedCategory}
          onChange={setSelectedCategory}
          isOpen={openDropdown === "category"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "category" ? null : "category")
          }
        />

        {/* Family Filter */}
        <Dropdown
          label="Familia Olfativa"
          options={opcionesFamily}
          selectedValues={selectedFamily}
          onChange={setSelectedFamily}
          isOpen={openDropdown === "family"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "family" ? null : "family")
          }
        />

        {/* Brand Filter */}
        <Dropdown
          label="Marca"
          options={opcionesBrand}
          selectedValues={selectedBrands}
          onChange={setSelectedBrands}
          isOpen={openDropdown === "brand"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "brand" ? null : "brand")
          }
        />
      </div>
    </>
  );

  return (
    <>
      <div style={isScrolled ? {minWidth: "700px"} : {}} className={`${
        isScrolled 
          ? 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700' 
          : 'relative bg-transparent'
      } px-6 py-4 z-50 transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap">
        {/* Search Bar */}
          <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar perfume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                isScrolled 
                  ? 'bg-gray-500/20 border-gray-700 focus:text-gray-400' 
                  : 'bg-white border-gray-300 text-black focus:text-black'
              }`}
          />
          <Search className="absolute left-3 top-1/2  transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="hidden md:block">
          <FiltersContent />
          </div>
          {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <X className="w-4 h-4" />
            Borrar filtros
          </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Button */}
      <button
        onClick={() => setIsMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        <ListFilterIcon className="w-6 h-6" />
      </button>

      {/* Mobile Filters Panel */}
      {isMobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95">
          <div className="h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Filtros</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <FiltersContent />
            </div>
          </div>
        </div>
      )}
      {/* Click outside handler for dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
}
