import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import logoNav from "../../resources/SVG/logoNav.svg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Función para manejar el scroll
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const windowWidth = window.innerWidth;

    if (windowWidth > 768) {
      // Solo aplicar lógica si la pantalla es mayor que 768px
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false); // Usuario hace scroll hacia abajo
      } else {
        setShowNavbar(true); // Usuario hace scroll hacia arriba
      }
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    // Agregar el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed  z-40 w-full bg-gradient-to-r border-solid border-b text-white  transition-transform duration-300 ${
        showNavbar
          ? `translate-y-0 ${
              window.scrollY !== 0 ? "bg-black border-none " : ""
            }`
          : "-translate-y-full bg-transparent"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="#home" className="text-xl font-bold">
              <img src={logoNav} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Menu para pantallas grandes */}
          <ul className="hidden md:flex space-x-4 font-light  gap-6">
            <li>
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                offset={-70}
                className="hover:text-secondary  text-sm cursor-pointer"
              >
                Inicio
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="products"
                smooth={true}
                duration={500}
                className="hover:text-secondary  text-sm cursor-pointer"
              >
                Productos
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="masEsencia"
                smooth={true}
                duration={500}
                className="hover:text-secondary text-sm cursor-pointer"
              >
                Consume Mas Esencia
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="aboutUs"
                smooth={true}
                duration={500}
                className="hover:text-secondary  text-sm cursor-pointer"
              >
                Nosotros
              </ScrollLink>
            </li>
          </ul>
          <div className="hidden md:flex space-x-4  py-2 px-7">
            <a
              href="https://www.instagram.com/distribuciones_timaran?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition duration-300"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition duration-300"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 transition duration-300"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://api.whatsapp.com/message/TQ6FRZIABEBPE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition duration-300"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>

          {/* Botón de menú para móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar para móviles */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="bg-white w-80 h-screen flex flex-col">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={toggleSidebar}
              className="text-primary hover:text-gray-400 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="h-full flex flex-col justify-around items-center space-y-2 ">
            <div className="items-start w-full px-12 text-left">
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                onClick={toggleSidebar}
                offset={-70}
                className="cursor-pointer block px-4 py-2 text-primary hover:text-gray-400"
              >
                Inicio
              </ScrollLink>
              <ScrollLink
                to="products"
                smooth={true}
                duration={500}
                onClick={toggleSidebar}
                offset={-70}
                className="cursor-pointer block px-4 py-2 text-primary hover:text-gray-400"
              >
                Productos
              </ScrollLink>
              <ScrollLink
                to="masEsenciaMobile"
                smooth={true}
                duration={500}
                onClick={toggleSidebar}
                offset={-70}
                className="cursor-pointer block px-4 py-2 text-primary hover:text-gray-400"
              >
                Consume Más Esencia
              </ScrollLink>
              <ScrollLink
                to="aboutUs"
                smooth={true}
                duration={500}
                onClick={toggleSidebar}
                offset={-70}
                className="cursor-pointer block px-4 py-2 text-primary hover:text-gray-400"
              >
                Nosotros
              </ScrollLink>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/distribuciones_timaran?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-pink-400 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-blue-400 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-blue-600 transition duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://api.whatsapp.com/message/TQ6FRZIABEBPE1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-green-400 transition duration-300"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
