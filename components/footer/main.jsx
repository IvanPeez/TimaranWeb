import React from "react";
import { motion } from "framer-motion";
import logoFooter from '../../resources/SVG/logoFull.svg'
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-8">
        <motion.div 
        initial={{y:100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contenido principal del footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sobre la empresa */}
                <div>
                    <Link to="/" className="text-xl font-bold">
                    <img src={logoFooter} alt="Logo" className="w-36" />
                    </Link>
                </div>

                {/* Enlaces rápidos */}
                <div>
                    <ul className="space-y-2">
                        <li>
                            <a href="#home" className="hover:text-white">Inicio</a>
                        </li>
                        <li>
                            <a href="#about" className="hover:text-white">Sobre Nosotros</a>
                        </li>
                        <li>
                            <a href="#services" className="hover:text-white">Servicios</a>
                        </li>
                        <li>
                            <a href="#contact" className="hover:text-white">Contacto</a>
                        </li>
                    </ul>
                </div>

                {/* Redes sociales y contacto */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contáctanos</h3>
                    <p className="text-sm mb-4">
                        Email: <a href="mailto:info@empresa.com" className="hover:text-white">info@empresa.com</a>
                    </p>
                    <p className="text-sm mb-4">
                        Teléfono: <a href="tel:+123456789" className="hover:text-white">+1 234 567 89</a>
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <i className="fab fa-facebook-f text-gray-400 hover:text-white"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                            <i className="fab fa-twitter text-gray-400 hover:text-white"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <i className="fab fa-instagram text-gray-400 hover:text-white"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in text-gray-400 hover:text-white"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Línea divisoria */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* Derechos reservados */}
            <div className="text-center text-sm">
                © {new Date().getFullYear()} Distribuciones Timaran. Todos los derechos reservados.
            </div>
        </motion.div>
    </footer>
  );
};

export default Footer;