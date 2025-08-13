import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Filters } from "./componentesCatalogo/Filters";
import { perfumes } from "../../src/services/esenciasBack";
import { PerfumeModal } from "./componentesCatalogo/PerfumeModal";
import { motion, useTransform, useScroll } from "framer-motion";


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
  const [isScrolled, setIsScrolled] = useState(false);
  const opcionesCategory = getOpciones("category");
  const opcionesBrand = getOpciones("brand").sort();
  const opcionesGender = getOpciones("gender");
  const opcionesFamily = getOpciones("family").sort();
  console.log(opcionesFamily);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      const searchMatch = regex.test(perfume.newName) || regex.test(perfume.brand) || regex.test(perfume.name);

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
        searchMatch &&
        genderMatch &&
        categoryMatch &&
        familyMatch &&
        brandMatch &&
        IsNewMatch
      );
    });
  }, [
    searchQuery,
    selectedGender,
    selectedCategory,
    selectedFamily,
    selectedBrands,
  ]);

  // Count perfumes by category for the header
  const perfumeCounts = useMemo(() => {
    return {
      designer: perfumes.filter((p) => p.category === "Diseñador").length,
      niche: perfumes.filter((p) => p.category === "Nicho").length,
    };
  }, []);

  return (
    <div className="min-h-screen px-4 bg-[#141416]">
      {/* Header */}
      <header className=" text-white p-4">
        <div className=" container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-center md:text-left">
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

      <div className="container mx-auto py-6">
        {/* <div className="flex flex-col lg:flex-row gap-6 md:h-[calc(100vh-8rem)]"> */}
        {/* Filters Component - Full width on mobile, sidebar on desktop */}
        <div className={`${isScrolled ? 'pt-24' : 'pt-6'} pb-6 transition-all duration-300`}>
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
            isScrolled={isScrolled}
          />
        </div>

        {/* Perfume List */}
        <div className="flex w-full justify-stretch mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {filteredPerfumes.map((perfume) => (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
                key={perfume.id}
                className="relative flex justify-center items-center w-full h-80 overflow-hidden group rounded-2xl"
              >
                <img
                  src={perfume.picture}
                  alt="Descripción"
                  className="object-cover w-full h-full transition-transform duration-500 rounded-2xl transform group-hover:scale-105"
                  
                />

                <button
                  onClick={() => setSelectedPerfume(perfume)}
                  className="absolute group rounded-full z-10 w-6 h-6 text-center backdrop-blur-lg text-white text-sm flex items-center justify-center group-hover:w-24 duration-500"
                >
                  <Plus
                    size={16}
                    className="group-hover:opacity-0 delay-200 transition-opacity "
                  />
                  <span className="absolute opacity-0 transition-opacity duration-300 delay-200 group-hover:opacity-100">
                    Ver más
                  </span>
                </button>

                <div
                onClick={() => setSelectedPerfume(perfume)}
                className="absolute cursor-pointer bg-gradient-to-b from-transparent to-black/70 opacity-0 h-full group-hover:opacity-100 w-full p-6 gap-4 transition duration-500 overflow-hidden flex-col ">
                  <div className=" flex flex-col h-full items-center justify-end gap-2">
                    <span className="font-bold text-ellipsis text-white text-sm">
                      {perfume.name}
                    </span>
                    <span className="font-normal text-ellipsis text-white text-sm">
                      {perfume.newName}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredPerfumes.length === 0 && (
            <div className="text-center w-full text-gray-500">
              No se encontraron perfumes con los filtros seleccionados
            </div>
          )}
        </div>

        {/* </div> */}
      </div>
      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />
    </div>
  );
}

export default CatalogoEsenciasView;
