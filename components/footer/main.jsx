import React from "react";
import { motion } from "framer-motion";
import logoFooter from '../../resources/SVG/logoFull.svg'
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
        <motion.div 
        initial={{y:100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contenido principal del footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Sobre la empresa */}
                <div className="flex justify-center text-center">
                    <Link to="/" className="text-xl font-bold">
                    <img src={logoFooter} alt="Logo" className="w-36" />
                    </Link>
                </div>

                {/* Enlaces rápidos */}
                <div>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <a href="#home" className="hover:text-secondary">Inicio</a>
                        </li>
                        <Link to="/about">
                            <a className="hover:text-secondary">Sobre Nosotros</a>
                        </Link>
                        <li>
                            <a href="#services" className="hover:text-secondary">Servicios</a>
                        </li>
                        <li>
                            <a href="#contact" className="hover:text-secondary">Contacto</a>
                        </li>
                    </ul>
                </div>

                {/* Redes sociales y contacto */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contáctanos</h3>
                    <p className="text-sm mb-4">
                       distribucionestimaran7@gmail.com
                    </p>
                    <p className="text-sm mb-4">
                        (+57) 320 7541234 - 300 7625437 - 300 6585835 
                    </p>
                    <p className="text-sm mb-4">
                        Cra. 5 # 36A-36 B/ Las Delicias
                    </p>
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