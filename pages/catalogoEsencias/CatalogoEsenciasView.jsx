import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Filters } from "./componentesCatalogo/Filters";
import { perfumes } from "../../src/services/esenciasBack";
import { PerfumeModal } from "./componentesCatalogo/PerfumeModal";

// Sample data with complete information
// const perfumes = [
//   {
//     id: '001',
//     name: 'A. DOMINGUEZ - AGUA FRESCA DE ROSAS',
//     category: 'Diseñador',
//     gender: 'Mujer',
//     brand: 'A. Dominguez'
//   },
//   {
//     id: '002',
//     name: 'A. DOMINGUEZ - BAMBU HER',
//     category: 'Diseñador',
//     gender: 'Mujer',
//     brand: 'A. Dominguez'
//   },
//   {
//     id: '003',
//     name: 'ANGEL SCHLESSER - FEMME',
//     category: 'Nicho',
//     gender: 'Mujer',
//     brand: 'Angel Schlesser'
//   },
//   {
//     id: '004',
//     name: 'AMOUAGE - GOLD',
//     category: 'Nicho',
//     gender: 'Unisex',
//     brand: 'Amouage'
//   },
//   {
//     id: '005',
//     name: 'ARMANI - ACQUA DI GIO',
//     category: 'Diseñador',
//     gender: 'Hombre',
//     brand: 'Armani'
//   },
//   {
//     id: '006',
//     name: 'BALENCIAGA - PARIS',
//     category: 'Diseñador',
//     gender: 'Mujer',
//     brand: 'Balenciaga'
//   },
// ];

const getOpciones = (field) => {
  const fieldData = perfumes.map((perf) => perf[field]);
  const setDataField = new Set(fieldData);
  return Array.from(setDataField).filter(Boolean);
};

function CatalogoEsenciasView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const opcionesCategory = getOpciones("category");
  const opcionesBrand = getOpciones("brand").sort();
  const opcionesGender = getOpciones("gender");
  const opcionesFamily = getOpciones("family").sort()
  console.log(opcionesFamily)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter perfumes based on selected filters and search query
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => {
      // Create a case-insensitive regex pattern that matches words in any order
      const searchPattern = searchQuery
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => `(?=.*${word})`)
        .join("");

      const regex = searchQuery ? new RegExp(searchPattern, "i") : /.*/;
      const searchMatch = regex.test(perfume.name) || regex.test(perfume.brand);

      const genderMatch =
        selectedGender.length === 0 || selectedGender.includes(perfume.gender);

      const categoryMatch =
        selectedCategory.filter((categoria) => categoria !== "Novedades")
          .length === 0 ||
        selectedCategory
          .filter((categoria) => categoria !== "Novedades")
          .includes(perfume.category);
      const IsNewMatch =
        selectedCategory.length === 0 ||
        (selectedCategory.includes("Novedades") ? perfume.isNew : true);

        const familyMatch =
        selectedFamily.length === 0 || selectedFamily.includes(perfume.family);

      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(perfume.brand);

      return (
        searchMatch && genderMatch && categoryMatch && familyMatch && brandMatch && IsNewMatch 
      );
    });
  }, [searchQuery, selectedGender, selectedCategory, selectedFamily, selectedBrands]);

  // Count perfumes by category for the header
  const perfumeCounts = useMemo(() => {
    return {
      designer: perfumes.filter((p) => p.category === "Diseñador").length,
      niche: perfumes.filter((p) => p.category === "Nicho").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className=" mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-titleAlt italic font-bold">
            Listado de Perfumes
          </h1>
          <div className="text-sm">
            <span>PERFUMES DISEÑADOR: {perfumeCounts.designer}</span>
            <span className="mx-2">-</span>
            <span>PERFUMES NICHO: {perfumeCounts.niche}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto py-6">
        <div className="flex flex-col lg:flex-row gap-6 md:h-[calc(100vh-8rem)]">
          {/* Filters Component - Full width on mobile, sidebar on desktop */}
          <div className="w-full  md:overflow-y-auto lg:w-72">
            <Filters
              opcionesCategory={opcionesCategory}
              opcionesBrand={opcionesBrand}
              opcionesGender={opcionesGender}
              opcionesFamily={opcionesFamily}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedFamily={selectedFamily}
              setSelectedFamily={setSelectedFamily}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
          </div>

          {/* Perfume List */}
          <div className="flex-1 md:pr-6 md:overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {filteredPerfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  className="flex justify-between items-center bg-white/30 backdrop-blur-lg p-4 border border-white/80 hover:bg-white/60 transition rounded-2xl"
                >
                  <img
                    src={perfume.picture}
                    alt="Descripción"
                    className="w-40 h-40 object-cover rounded-lg"
                  />

                  <div className="w-full p-12 gap-4 flex items-center overflow-hidden flex-col ">
                    <span className="font-normal text-ellipsis  text-sm">
                      {perfume.name}
                    </span>

                    <button
                      onClick={() => setSelectedPerfume(perfume)}
                      className="rounded-full w-6 h-6 bg-gray-900/20 text-center backdrop-blur-lg text-white text-sm flex items-center justify-center transition-all duration-300 group  hover:w-24 "
                    >
                      <Plus
                        size={16}
                        className="group-hover:hidden transition-opacity duration-200"
                      />
                      <span className="hidden h-6 group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver más
                      </span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredPerfumes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron perfumes con los filtros seleccionados
                </div>
              )}
            </div>
          </div>
          <PerfumeModal
            perfume={selectedPerfume}
            onClose={() => setSelectedPerfume(null)}
          />
        </div>
      </div>
    </div>
  );
}

export default CatalogoEsenciasView;
