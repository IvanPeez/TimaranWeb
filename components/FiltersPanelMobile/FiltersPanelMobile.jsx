import React, { useState } from "react";
import { X } from "lucide-react";

import { DropdownMobile } from "../DropdownMobile/DropdownMobile";
import { tr } from "motion/react-client";

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
  onClose,
}) => {
  const [openDropdownMobile, setOpenDropdowMobile] = useState({
    gender: true,
    category: true,
    family: true,
    brand: true,
  });

  const handleOpenFilters = (filterType) => {
    const newState = { ...openDropdownMobile };
    newState[filterType] = !newState[filterType];
    setOpenDropdowMobile(newState);
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/95">
      <div className="h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Filtros</h2>
          <button
            onClick={() => onClose && onClose(false)}
            className="text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative w-full md:w-auto md:flex">
            {/* Gender Filter */}
            <DropdownMobile
              label="Género"
              options={opcionesGender}
              selectedValues={selectedGender}
              onChange={setSelectedGender}
              isOpen={openDropdownMobile.gender}
              onToggle={() => handleOpenFilters("gender")}
            />

            {/* Category Filter */}
            <DropdownMobile
              label="Categoría"
              options={[...opcionesCategory, "Novedades"]}
              selectedValues={selectedCategory}
              onChange={setSelectedCategory}
              isOpen={openDropdownMobile.category}
              onToggle={() => handleOpenFilters("category")}
            />

            {/* Family Filter */}
            <DropdownMobile
              label="Familia Olfativa"
              options={opcionesFamily}
              selectedValues={selectedFamily}
              onChange={setSelectedFamily}
              isOpen={openDropdownMobile.family}
              onToggle={() => handleOpenFilters("family")}
            />

            {/* Brand Filter */}
            <DropdownMobile
              label="Marca"
              options={opcionesBrand}
              selectedValues={selectedBrands}
              onChange={setSelectedBrands}
              isOpen={openDropdownMobile.brand}
              onToggle={() => handleOpenFilters("brand")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanelMobile;
