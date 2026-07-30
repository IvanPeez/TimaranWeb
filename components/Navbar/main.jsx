import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { ChevronDown, Menu, X } from "lucide-react";
import logoNav from "../../resources/SVG/logoNav.svg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { advisorMessage, whatsappLink } from "../../utils/contacto";

// Las dos puertas de entrada al catálogo, tal como se ven en el menú "Productos".
const PRODUCTOS = [
  {
    to: "/esencias",
    titulo: "Esencias",
    descripcion: "869 fragancias de autor, filtrables por familia y género.",
  },
  {
    to: "/envases",
    titulo: "Insumos",
    descripcion: "Envases, alcohol, fijadores y maquinaria para producir.",
  },
];

const SECCIONES = [
  { to: "nosotros", label: "Nosotros" },
  { to: "contacto", label: "Contacto" },
];

const REDES = [
  {
    href: "https://www.instagram.com/distribuciones_timaran?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://facebook.com",
    icon: FaFacebook,
    label: "Facebook",
  },
  {
    href: "https://linkedin.com",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const productsRef = useRef(null);

  // La barra queda siempre visible: el botón de WhatsApp es el único CTA
  // permanente de la página y antes desaparecía justo al hacer scroll.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menú de productos al hacer click afuera o con Escape
  useEffect(() => {
    if (!isProductsOpen) return undefined;

    const handleClickOutside = (event) => {
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setIsProductsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsProductsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProductsOpen]);

  // Con el menú abierto el fondo no debe desplazarse: además de ser molesto,
  // el scroll cambiaba el fondo de la barra y arrastraba al drawer con ella.
  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isSidebarOpen]);

  const closeAll = () => {
    setIsSidebarOpen(false);
    setIsProductsOpen(false);
    setIsMobileProductsOpen(false);
  };

  return (
    <nav
      className={`fixed z-50 w-full text-white transition-all duration-300 ${
        isScrolled || isProductsOpen
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" onClick={closeAll} aria-label="Inicio">
            <img src={logoNav} alt="Distribuciones Timarán" className="h-10 w-auto" />
          </Link>

          {/* Menú desktop */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                offset={-70}
                className="cursor-pointer text-sm transition-colors hover:text-champagne"
              >
                Inicio
              </ScrollLink>
            </li>

            {/* Productos: despliega Esencias / Insumos */}
            <li className="relative" ref={productsRef}>
              <button
                type="button"
                onClick={() => setIsProductsOpen((prev) => !prev)}
                aria-expanded={isProductsOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isProductsOpen ? "text-champagne" : "hover:text-champagne"
                }`}
              >
                Productos
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProductsOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-4 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-ink-card/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
                  {PRODUCTOS.map((producto) => (
                    <Link
                      key={producto.to}
                      to={producto.to}
                      onClick={closeAll}
                      className="group block border-b border-white/[0.06] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-white/[0.05]"
                    >
                      <span className="block font-titleAlt text-xl italic text-white transition-colors group-hover:text-champagne">
                        {producto.titulo}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/45">
                        {producto.descripcion}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {SECCIONES.map((seccion) => (
              <li key={seccion.to}>
                <ScrollLink
                  to={seccion.to}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="cursor-pointer text-sm transition-colors hover:text-champagne"
                >
                  {seccion.label}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {/* Redes + CTA desktop */}
          <div className="hidden items-center gap-5 md:flex">
            {REDES.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white transition-colors duration-300 hover:text-champagne"
              >
                <Icon size={18} />
              </a>
            ))}
            <a
              href={whatsappLink(advisorMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-champagne-light"
            >
              <FaWhatsapp size={14} />
              Cotizar
            </a>
          </div>

          {/* Botón de menú móvil */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menú"
            className="text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Menú móvil: se monta en el body porque al hacer scroll el <nav> gana
          backdrop-blur y eso vuelve a la barra el bloque contenedor de sus
          descendientes fixed, dejando el drawer encerrado en sus 64px. */}
      {createPortal(
        <div
          className={`fixed inset-0 z-50 md:hidden ${
            isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            onClick={closeAll}
            className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-ink transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <img src={logoNav} alt="Distribuciones Timarán" className="h-8 w-auto" />
              <button
                type="button"
                onClick={closeAll}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                offset={-70}
                onClick={closeAll}
                className="block cursor-pointer py-3 text-lg text-white"
              >
                Inicio
              </ScrollLink>

              {/* Productos desplegable */}
              <button
                type="button"
                onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                aria-expanded={isMobileProductsOpen}
                className="flex w-full items-center justify-between py-3 text-left text-lg text-white"
              >
                Productos
                <ChevronDown
                  className={`h-4 w-4 text-white/50 transition-transform duration-300 ${
                    isMobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileProductsOpen && (
                <div className="mb-2 ml-1 space-y-1 border-l border-white/10 pl-4">
                  {PRODUCTOS.map((producto) => (
                    <Link
                      key={producto.to}
                      to={producto.to}
                      onClick={closeAll}
                      className="block py-2.5"
                    >
                      <span className="block font-titleAlt text-lg italic text-champagne">
                        {producto.titulo}
                      </span>
                      <span className="block text-xs text-white/45">
                        {producto.descripcion}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {SECCIONES.map((seccion) => (
                <ScrollLink
                  key={seccion.to}
                  to={seccion.to}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  onClick={closeAll}
                  className="block cursor-pointer py-3 text-lg text-white"
                >
                  {seccion.label}
                </ScrollLink>
              ))}
            </nav>

            <div className="border-t border-white/10 px-5 py-5">
              <a
                href={whatsappLink(advisorMessage())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
                className="flex items-center justify-center gap-2 rounded-xl bg-champagne px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink"
              >
                <FaWhatsapp size={16} />
                Cotizar por WhatsApp
              </a>

              <div className="mt-5 flex justify-center gap-6">
                {REDES.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white/70 transition-colors duration-300 hover:text-champagne"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
