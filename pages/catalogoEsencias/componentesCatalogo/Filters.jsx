import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { label } from "motion/react-client";

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
}) {
  const [sectionsOpen, setSectionsOpen] = useState({
    gender: true,
    category: true,
    brand: true,
    family: true,
  });

  const toggleSection = (section) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedGender.length > 0 ||
    selectedCategory.length > 0 ||
    selectedBrands.length > 0||
    selectedFamily.length > 0;

  const clearAllFilters = () => {
    setSelectedGender([]);
    setSelectedCategory([]);
    setSelectedBrands([]);
    setSelectedFamily([]);
    setSearchQuery("");
  };
  console.log(selectedGender,selectedCategory,selectedBrands,selectedFamily);
  

  return (
    <div className="w-full py-2 px-6">
      {/* Search Bar */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar perfume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex items-center justify-between font-bold mb-2 hover:text-gray-600"
        >
          <span className="font-semibold">Género</span>
          {sectionsOpen.gender ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {sectionsOpen.gender && (
          <div className="flex flex-wrap capitalize gap-2">
            {opcionesGender.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGender.includes(gender)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  onChange={() => {
                    setSelectedGender((prev) =>
                      prev.includes(gender)
                        ? prev.filter((g) => g !== gender)
                        : [...prev, gender]
                    );
                    window.scrollTo(0, 0);
                  }}
                />
                <span className="text-sm">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between font-bold mb-2 hover:text-gray-600"
        >
          <span className="font-semibold">Categoría</span>
          {sectionsOpen.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {sectionsOpen.category && (
          <div className="flex flex-wrap gap-2">
            {[...opcionesCategory, "Novedades"].map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory.includes(category)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  onClick={() => {
                    setSelectedCategory((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    );

                    window.scrollTo(0, 0);
                  }}
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Family Filter */}
      <div>
        <button
          onClick={() => toggleSection("family")}
          className="w-full flex items-center justify-between font-bold mb-2 hover:text-gray-600"
        >
          <span className="font-semibold">Familia Olfativa</span>
          {sectionsOpen.family ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {sectionsOpen.family && (
          <div className="grid items-start justify-start grid-cols-1 gap-2">
            {opcionesFamily.map((family) => (
              <label
                key={family}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFamily.includes(family)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  onClick={() => {
                    setSelectedFamily((prev) =>
                      prev.includes(family)
                        ? prev.filter((f) => f !== family)
                        : [...prev, family]
                    );
                    window.scrollTo(0, 0);
                  }}
                />
                <span className="text-sm">
                  {family}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between font-bold mb-2 hover:text-gray-600"
        >
          <span className="font-semibold">Marca</span>
          {sectionsOpen.brand ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {sectionsOpen.brand && (
          <div className="grid items-start justify-start grid-cols-1 gap-2">
            {opcionesBrand.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  onClick={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    );
                    window.scrollTo(0, 0);
                  }}
                />
                <span className="text-sm">
                  {brand
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      

      {hasActiveFilters && (
        <div className="sticky bottom-0 left-0 right-0 mt-auto p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Borrar filtros
          </button>
        </div>
      )}
    </div>
  );
}
