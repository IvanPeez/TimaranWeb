import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import logoNav from "../../resources/SVG/logoNav.svg";
import { perfumes } from "../../src/services/esenciasBack";
import { Filters } from "./componentesCatalogo/Filters";
import { PerfumeModal } from "./componentesCatalogo/PerfumeModal";
import { PerfumeCard } from "./componentesCatalogo/PerfumeCard";
import { QuoteTray } from "./componentesCatalogo/QuoteTray";
import { useSelection } from "./componentesCatalogo/useSelection";
import {
  advisorMessage,
  DISCLAIMER,
  esNovedad,
  porMasReciente,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "./componentesCatalogo/catalogUtils";

const PAGE_SIZE = 40;

const HERO_IMAGE =
  "https://cdn.leonardo.ai/users/68017305-d176-45f0-934a-cf03250a2262/generations/8404ffd9-7778-4068-be0f-3f7f28e66d73/Leonardo_Phoenix_09_En_primer_plano_un_lujoso_taller_de_perfum_2.jpg";

const BENEFICIOS = [
  { icon: ShieldCheck, title: "Calidad garantizada", text: "Concentración alta y fijación prolongada en cada lote." },
  { icon: Package, title: "Desde 120 gramos", text: "Arranca pequeño y escala: mejor precio por gramo al crecer." },
  { icon: Truck, title: "Envíos a todo el país", text: "Despachamos a toda Colombia con embalaje seguro." },
  { icon: Headphones, title: "Asesoría real", text: "Te ayudamos a elegir las esencias que más rotan." },
];

const getOpciones = (field) =>
  Array.from(new Set(perfumes.map((perfume) => perfume[field]))).filter(Boolean);

function CatalogoEsenciasView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [sortBy, setSortBy] = useState("destacados");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selection = useSelection();
  const sentinelRef = useRef(null);
  const catalogRef = useRef(null);

  const scrollToCatalog = () =>
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const opcionesCategory = useMemo(() => getOpciones("category").sort(), []);
  const opcionesBrand = useMemo(() => getOpciones("brand").sort(), []);
  const opcionesGender = useMemo(() => getOpciones("gender"), []);
  const opcionesFamily = useMemo(
    () => getOpciones("family").filter((family) => family !== "Desconocido").sort(),
    []
  );

  // Posición de cada esencia en el catálogo: sirve para desempatar el orden
  // "más reciente" cuando varias comparten fecha.
  const ordenDeAlta = useMemo(
    () => new Map(perfumes.map((perfume, indice) => [perfume.id, indice])),
    []
  );
  const masReciente = useMemo(() => porMasReciente(ordenDeAlta), [ordenDeAlta]);

  const totals = useMemo(
    () => ({
      total: perfumes.length,
      novedades: perfumes.filter((perfume) => esNovedad(perfume)).length,
    }),
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPerfumes = useMemo(() => {
    const searchPattern = searchQuery
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => `(?=.*${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`)
      .join("");

    const regex = searchQuery ? new RegExp(searchPattern, "i") : /.*/;

    const result = perfumes.filter((perfume) => {
      const searchMatch =
        regex.test(perfume.newName) ||
        regex.test(perfume.brand) ||
        regex.test(perfume.name);

      const genderMatch =
        selectedGender.length === 0 || selectedGender.includes(perfume.gender);

      const realCategories = selectedCategory.filter(
        (categoria) => categoria !== "Novedades"
      );
      const categoryMatch =
        realCategories.length === 0 || realCategories.includes(perfume.category);

      const novedadMatch =
        !selectedCategory.includes("Novedades") || esNovedad(perfume);

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
        novedadMatch
      );
    });

    const byName = (a, b) => a.newName.localeCompare(b.newName, "es");

    // Con el filtro de Novedades activo se muestran siempre de la más nueva a
    // la más vieja, sin que el usuario tenga que cambiar el orden a mano.
    if (selectedCategory.includes("Novedades") && sortBy === "destacados") {
      return result.sort(masReciente);
    }

    switch (sortBy) {
      case "recientes":
        return result.sort(masReciente);
      case "az":
        return result.sort(byName);
      case "za":
        return result.sort((a, b) => byName(b, a));
      case "marca":
        return result.sort(
          (a, b) => a.brand.localeCompare(b.brand, "es") || byName(a, b)
        );
      default:
        return result;
    }
  }, [
    searchQuery,
    selectedGender,
    selectedCategory,
    selectedFamily,
    selectedBrands,
    sortBy,
    masReciente,
  ]);

  // Reinicia la paginación cada vez que cambian los filtros
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredPerfumes]);

  const visiblePerfumes = useMemo(
    () => filteredPerfumes.slice(0, visibleCount),
    [filteredPerfumes, visibleCount]
  );

  const hasMore = visibleCount < filteredPerfumes.length;

  const loadMore = useCallback(
    () => setVisibleCount((prev) => prev + PAGE_SIZE),
    []
  );

  // Carga automática al llegar al final de la grilla
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-ink text-left font-generalSans">
      {/* Barra superior */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <img src={logoNav} alt="Distribuciones Timarán" className="h-7 w-auto" />
          </Link>

          <a
            href={whatsappLink(advisorMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-champagne/40 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-champagne transition-colors hover:bg-champagne hover:text-ink"
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hablar con un asesor</span>
            <span className="sm:hidden">Asesor</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
              Catálogo de esencias
            </p>
            <h1 className="mt-5 font-titleAlt text-5xl italic leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              La esencia que
              <br />
              se vuelve tu marca
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              {totals.total} fragancias de autor inspiradas en los perfumes más
              deseados del mundo. Alta concentración, fijación prolongada y
              asesoría para que tu línea de perfumería nazca con sello propio.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="flex items-center justify-center gap-2 rounded-xl bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne-light"
              >
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whatsappLink(advisorMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
              >
                <FaWhatsapp className="h-4 w-4" />
                Pedir asesoría
              </a>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              {[
                { value: totals.total, label: "Esencias" },
                { value: totals.novedades, label: "Novedades" },
                { value: "120 g", label: "Pedido mínimo" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-titleAlt text-3xl italic text-champagne sm:text-4xl">
                    {item.value}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/45">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-white/[0.07] bg-ink-soft">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {BENEFICIOS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-ink-soft px-6 py-8">
              <Icon className="h-5 w-5 text-champagne" />
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filtros */}
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
        sortBy={sortBy}
        setSortBy={setSortBy}
        resultCount={filteredPerfumes.length}
        totalCount={totals.total}
      />

      {/* Grilla */}
      <section
        ref={catalogRef}
        className="mx-auto max-w-[1600px] scroll-mt-32 px-4 py-10 sm:px-6"
      >
        {filteredPerfumes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visiblePerfumes.map((perfume, index) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  index={index % PAGE_SIZE}
                  isSelected={selection.ids.has(perfume.id)}
                  onToggleSelect={() => selection.toggle(perfume)}
                  onOpen={() => setSelectedPerfume(perfume)}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-px w-full" />

            {hasMore && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                  Mostrando {visiblePerfumes.length} de {filteredPerfumes.length}
                </p>
                <button
                  type="button"
                  onClick={loadMore}
                  className="rounded-xl border border-white/15 px-8 py-3 text-sm uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-champagne hover:text-champagne"
                >
                  Ver más esencias
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Sparkles className="h-8 w-8 text-champagne/60" />
            <p className="font-titleAlt text-2xl italic text-white">
              No encontramos esa esencia
            </p>
            <p className="max-w-sm text-sm text-white/45">
              Prueba con otro nombre o quita algunos filtros. Si buscas una
              fragancia puntual, escríbenos: la conseguimos por ti.
            </p>
            <a
              href={whatsappLink(advisorMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded-xl bg-champagne px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne-light"
            >
              <FaWhatsapp className="h-4 w-4" />
              Pregúntanos
            </a>
          </div>
        )}
      </section>

      {/* Cierre de conversión */}
      <section className="relative overflow-hidden border-t border-white/[0.07] bg-ink-soft">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
            Tu marca empieza aquí
          </p>
          <h2 className="mt-5 font-titleAlt text-4xl italic leading-tight text-white sm:text-5xl">
            ¿Listo para crear tu línea de perfumería?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55">
            Arma tu selección, envíanosla por WhatsApp y te devolvemos la
            cotización con precios por gramo, presentaciones y tiempos de
            entrega.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink(advisorMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-champagne-light"
            >
              <FaWhatsapp className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
            <Link
              to="/envases"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-champagne hover:text-champagne"
            >
              Ver envases e insumos
            </Link>
          </div>
        </div>
      </section>

      {/* Pie */}
      <footer className="border-t border-white/[0.07] bg-ink px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <img
              src={logoNav}
              alt="Distribuciones Timarán"
              className="mx-auto h-8 w-auto md:mx-0"
            />
            <p className="mt-3 text-xs text-white/40">
              distribucionestimaran7@gmail.com · {WHATSAPP_DISPLAY}
            </p>
          </div>
          <p className="max-w-2xl text-xs leading-relaxed text-white/55">
            {DISCLAIMER}
          </p>
        </div>
      </footer>

      {/* Espacio para que la bandeja no tape el contenido */}
      {selection.items.length > 0 && <div className="h-24" />}

      <QuoteTray
        items={selection.items}
        onRemove={selection.remove}
        onClear={selection.clear}
      />

      <PerfumeModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        isSelected={
          selectedPerfume ? selection.ids.has(selectedPerfume.id) : false
        }
        onToggleSelect={() =>
          selectedPerfume && selection.toggle(selectedPerfume)
        }
      />
    </div>
  );
}

export default CatalogoEsenciasView;
