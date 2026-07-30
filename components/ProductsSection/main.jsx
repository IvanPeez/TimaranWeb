import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PUERTAS = [
  {
    to: "/catalogo/esencias",
    titulo: "Esencias",
    texto: "Fragancias de autor para perfumes, cosmética y aromatización.",
    imagen:
      "https://cdn.leonardo.ai/users/68017305-d176-45f0-934a-cf03250a2262/generations/8404ffd9-7778-4068-be0f-3f7f28e66d73/Leonardo_Phoenix_09_En_primer_plano_un_lujoso_taller_de_perfum_2.jpg",
  },
  {
    to: "/catalogo/envases",
    titulo: "Insumos",
    texto: "Envases, alcohol, fijadores, válvulas y maquinaria de precisión.",
    imagen:
      "https://granvelada.com/modules/numericco_category_custom_fields/upload/275/img/275-1637844268.jpeg",
  },
];

const CardsSection = () => {
  return (
    <section id="products" className="bg-ink">
      {/* Intro */}
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
          Nuestros productos
        </p>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-4 max-w-3xl font-titleAlt text-4xl italic tracking-tight text-white sm:text-6xl"
        >
          Calidad y exclusividad garantizadas
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base"
        >
          Esencias premium, alcohol de alta pureza, bases y cremas, envases
          elegantes y maquinaria de precisión. Todo lo que tu línea de
          perfumería necesita, en un solo proveedor.
        </motion.p>
      </div>

      {/* Las dos puertas del catálogo */}
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {PUERTAS.map((puerta) => (
          <Link
            key={puerta.to}
            to={puerta.to}
            className="group relative block h-[26rem] overflow-hidden md:h-[38rem]"
          >
            <img
              src={puerta.imagen}
              alt={puerta.titulo}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/45" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="font-titleAlt text-4xl italic text-white md:text-5xl">
                {puerta.titulo}
              </h3>
              <p className="mt-3 max-w-xs text-sm text-white/70">
                {puerta.texto}
              </p>
              <span className="mt-7 flex items-center gap-2 border border-white/60 px-8 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink">
                Ver catálogo
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CardsSection;
