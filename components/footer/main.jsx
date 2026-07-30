import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaWhatsapp } from "react-icons/fa";
import logoFooter from "../../resources/SVG/logoFull.svg";
import {
  advisorMessage,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "../../utils/contacto";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-ink border-t border-white/10 text-white py-12">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Marca */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/">
              <img src={logoFooter} alt="Distribuciones Timarán" className="w-36" />
            </Link>
            <p className="text-sm text-white/50 max-w-xs">
              Insumos para perfumería fina: esencias, envases, alcohol,
              fijadores y maquinaria.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-champagne mb-4">
              Explora
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <ScrollLink
                  to="home"
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="cursor-pointer hover:text-champagne"
                >
                  Inicio
                </ScrollLink>
              </li>
              <li>
                <Link to="/esencias" className="hover:text-champagne">
                  Catálogo de esencias
                </Link>
              </li>
              <li>
                <Link to="/envases" className="hover:text-champagne">
                  Insumos y envases
                </Link>
              </li>
              <li>
                <Link to="/esencias/pdf" className="hover:text-champagne">
                  Catálogo en PDF
                </Link>
              </li>
              <li>
                <ScrollLink
                  to="faqs"
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="cursor-pointer hover:text-champagne"
                >
                  Preguntas frecuentes
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="nosotros"
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="cursor-pointer hover:text-champagne"
                >
                  Nosotros
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-champagne mb-4">
              Contáctanos
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <a
                  href="mailto:distribucionestimaran7@gmail.com"
                  className="hover:text-champagne"
                >
                  distribucionestimaran7@gmail.com
                </a>
              </li>
              <li>{WHATSAPP_DISPLAY} · 300 7625437 · 300 6585835</li>
              <li>Cra. 5 # 36A-36 B/ Las Delicias — Cali, Colombia</li>
            </ul>

            <a
              href={whatsappLink(advisorMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-champagne px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-champagne-light"
            >
              <FaWhatsapp size={16} />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 my-8"></div>

        <div className="text-center text-xs text-white/40">
          © {new Date().getFullYear()} Distribuciones Timaran. Todos los
          derechos reservados.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
