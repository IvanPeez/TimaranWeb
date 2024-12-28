import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoNav from '../../resources/SVG/logoNav.svg'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

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

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Usuario hace scroll hacia abajo
      setShowNavbar(false);
    } else {
      // Usuario hace scroll hacia arriba
      setShowNavbar(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    // Agregar el evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);


  return (
    <nav className={`fixed z-40 w-full bg-gradient-to-r border-solid border-b text-white transition-colors transition-transform duration-300 ${
      showNavbar ? `translate-y-0 ${window.scrollY !== 0 ? 'bg-black border-none' : '' }` : '-translate-y-full bg-transparent'
    }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              <img src={logoNav} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Menu para pantallas grandes */}
          <div className="hidden md:flex space-x-4 font-light  gap-6">
            <Link to="/" className="hover:text-yellow-200 text-xs">
              Inicio
            </Link>
            <Link to="/esencias" className="hover:text-yellow-200 text-xs">
              Esencias
            </Link>
            <Link to="/insumos" className="hover:text-yellow-200 text-xs">
              Insumos
            </Link>
            <Link to="/nosotros" className="hover:text-yellow-200 text-xs">
              Nosotros
            </Link>
          </div>
          <div className="hidden md:flex space-x-4  py-2 px-7">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 transition duration-300">
            <FaInstagram size={20} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition duration-300">
            <FaFacebook size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600 transition duration-300">
            <FaLinkedin size={20} />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition duration-300">
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
        <div className="bg-white w-64 h-full flex flex-col">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={toggleSidebar}
              className="text-cyan-950 hover:text-gray-400 focus:outline-none"
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
          <nav className="mt-4 space-y-2 flex-grow last:mt-auto">
            <Link
              to="/"
              onClick={toggleSidebar}
              className="block px-4 py-2 text-cyan-950 hover:text-gray-400"
            >
              Inicio
            </Link>
            <Link
              to="/esencias"
              onClick={toggleSidebar}
              className="block px-4 py-2 text-cyan-950 hover:text-gray-400"
            >
              Esencias
            </Link>
            <Link
              to="/insumos"
              onClick={toggleSidebar}
              className="block px-4 py-2 text-cyan-950 hover:text-gray-400"
            >
              Insumos
            </Link>
            <Link
              to="/nosotros"
              onClick={toggleSidebar}
              className="block px-4 py-2 text-cyan-950 hover:text-gray-400"
            >
              Nosotros
            </Link>
            <Link
              to="/insumos"
              onClick={toggleSidebar}
              className="block px-4 py-2 bg-slate-900 text-cyan-950 hover:text-gray-400 "
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
