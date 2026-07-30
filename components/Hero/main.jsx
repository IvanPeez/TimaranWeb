import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
// Ojo con las mayúsculas: el archivo en disco es timaranVid2.mov. Windows no
// distingue may/min, pero un build en Linux (CI, Vercel) sí y fallaría.
import HeroVid from "../../resources/vid/timaranVid2.mov";
import HeroPoster from "../../resources/img/hero-poster.jpg";
import { advisorMessage, whatsappLink } from "../../utils/contacto";

const Hero = () => {
  // El video pesa 55 MB. La imagen se pinta siempre y el video solo se
  // descarga en escritorio y sin ahorro de datos: así el visitante que llega
  // de Instagram con datos móviles no paga ese costo. Además el contenedor es
  // QuickTime, que Firefox no reproduce; ahí queda la imagen de fondo en vez
  // de un rectángulo negro.
  const [cargarVideo, setCargarVideo] = useState(false);

  useEffect(() => {
    const esEscritorio = window.matchMedia("(min-width: 768px)").matches;
    const ahorroDeDatos = navigator.connection?.saveData === true;
    if (esEscritorio && !ahorroDeDatos) setCargarVideo(true);
  }, []);

  return (
    <div id="home" className="relative h-screen w-full bg-ink">
      <img
        src={HeroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {cargarVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={HeroPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={HeroVid} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-b from-ink/50 via-ink/40 to-ink px-6 pb-16 text-center md:items-start md:px-8 md:text-start">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 text-[10px] uppercase tracking-[0.3em] text-champagne md:text-xs"
        >
          Insumos para perfumería fina · Cali, Colombia
        </motion.p>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4 font-titleAlt text-5xl font-extralight tracking-tighter text-white md:text-8xl"
        >
          Bienvenido a{" "}
          <motion.span
            initial={{ filter: "blur(10px)" }}
            whileInView={{ filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="block text-6xl italic text-white md:text-9xl"
          >
            Distribuciones Timaran
          </motion.span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="mb-8 max-w-[46rem] text-base font-light text-white/85 md:text-2xl"
        >
          Esencias, envases y todo lo que necesitas para crear tu propia línea
          de perfumería. Desde 120 gramos, con asesoría de principio a fin.
        </motion.p>

        {/* Acciones */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Link
            to="/esencias"
            className="flex items-center justify-center gap-2 rounded-xl bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne-light"
          >
            Ver esencias
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/envases"
            className="flex items-center justify-center rounded-xl border border-white/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            Insumos y envases
          </Link>

          <a
            href={whatsappLink(advisorMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-2 py-3 text-sm text-white/80 transition-colors hover:text-champagne"
          >
            <FaWhatsapp className="h-4 w-4" />
            Hablar con un asesor
          </a>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <ScrollLink
        to="products"
        smooth={true}
        duration={500}
        offset={-70}
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 cursor-pointer text-white/50 transition-colors hover:text-champagne md:block"
        aria-label="Ver productos"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </ScrollLink>
    </div>
  );
};

export default Hero;
