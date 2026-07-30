import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionContent from "../SectionContent/SectionContent";

const AboutUs = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <SectionContent
      ref={targetRef}
      className="bg-ink px-4 py-20 sm:px-6 lg:py-28"
    >
      {/* Grid de 2 columnas sin anchos fijos: antes el texto medía 50rem
          dentro de media columna y se montaba encima de la imagen. */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 text-start lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[11px] uppercase tracking-[0.3em] text-champagne"
          >
            Sobre nosotros
          </motion.p>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="mt-4 font-titleAlt text-4xl italic tracking-tight text-white lg:text-6xl"
          >
            La excelencia no es una opción, es nuestra esencia
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 lg:text-base"
          >
            Distribuimos insumos para perfumería fina desde Cali, Colombia.
            Abastecemos a perfumerías de todo el país y llegamos también a
            Chile, Ecuador, Venezuela, Puerto Rico y Costa Rica.
          </motion.p>
        </div>

        {/* Imagen */}
        <div className="relative mx-auto h-[320px] w-full overflow-hidden rounded-2xl lg:h-[480px]">
          <motion.img
            src="https://i.postimg.cc/WzJm7zGD/image-fx-2.png"
            alt="Perfumería"
            loading="lazy"
            style={{ scale }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </SectionContent>
  );
};

export default AboutUs;
