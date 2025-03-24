import SectionContent from "../SectionContent/SectionContent";
import { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

const AboutUs = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Ajustes de animación para dispositivos móviles
  const scale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const clipPath = useTransform(scrollYProgress, [0, 1], [
    "inset(0% 0% 0% 0%)",
    "inset(5% 5% 5% 5%)", // Menos agresivo en móviles
  ]);

  return (
    <SectionContent
      ref={targetRef}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-16 bg-white"
    >
      <motion.h2
        style={{ opacity }}
        className="text-center mb-12 font-titleAlt italic text-gray-300 text-4xl lg:text-9xl font-bold"
      >
        Sobre Nosotros
      </motion.h2>

      <div className="max-w-6xl text-start mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Contenido de texto */}
        <div className="w-full md:w-[50rem] z-20 px-4">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-base md:text-lg font-semibold tracking-tight text-black"
          >
            La excelencia no es una opción,
            <br />
            es nuestra esencia.
          </motion.h2>
          <motion.h3
            initial={{ y: 70, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
            className="italic font-titleAlt text-3xl lg:text-6xl font-semibold tracking-tighter mt-2"
          >
            Somos Distribuciones Timaran
          </motion.h3>
          <motion.div
            initial={{ y: 70, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
            className="w-full md:w-[30rem]"
          >
            <p className="text-gray-600 mt-4 text-justify tracking-tight text-sm">
              En un mercado donde la calidad lo es todo, somos la única elección
              que garantiza excelencia, innovación y confianza. Nos hemos
              posicionado como la empresa más sólida en la distribución de
              insumos para perfumería fina, asegurando que cada uno de nuestros
              clientes tenga acceso a los mejores productos y el servicio más
              eficiente del sector.
            </p>
            <p className="text-gray-600 mt-4 text-justify tracking-tight text-sm ">
              Contamos con más de 2 años revolucionando el mercado de la
              perfumería con insumos de la más alta calidad. Llegamos a cada
              rincón del país y expandimos nuestra excelencia a Sudamérica y
              Centroamérica, abasteciendo a las mejores perfumerías con
              productos premium.
            </p>
          </motion.div>

          {/* Botón */}
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeInOut" }}
          >
            <button className="mt-6 px-8 md:px-16 py-2 border text-xs tracking-[0.2em] md:tracking-[0.8em] border-black text-black hover:bg-black hover:text-white transition">
              DESCUBRE MÁS
            </button>
          </motion.div>
        </div>

        {/* Imagen */}
        <div className="relative w-full md:w-[400px] h-[300px] md:h-[500px] overflow-hidden mx-auto">
          <motion.img
            src="https://i.postimg.cc/WzJm7zGD/image-fx-2.png"
            alt="Perfumería"
            style={{ scale, clipPath }}
            className="absolute w-full h-full object-cover"
          />
        </div>
      </div>
    </SectionContent>
  );
};

export default AboutUs;