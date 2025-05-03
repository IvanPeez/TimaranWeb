import React, { useRef } from "react";
import SectionContent from "../SectionContent/SectionContent";
import { motion, useTransform, useScroll } from "framer-motion";
import { Link } from "react-router-dom";

const CardsSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Ajustes de animación para dispositivos móviles
  const scale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "inset(0% 0% 0% 0%)",
      "inset(5% 5% 5% 5%)", // Menos agresivo en móviles
    ]
  );

  return (
    <section id="products">
      <SectionContent
        ref={targetRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-16 bg-white"
      >
        <motion.h2
          style={{ opacity }}
          className=" mb-12 text-center font-titleAlt italic text-gray-300 text-5xl lg:text-9xl font-bold"
        >
          Nuestros Productos
        </motion.h2>

        <div className="max-w-6xl w-full text-start mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Contenido de texto */}
          <div className="w-full z-20 md:w-[50rem] px-4">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="italic font-titleAlt text-3xl md:text-6xl font-semibold tracking-tighter mt-2"
            >
              Calidad y Exclusividad Garantizadas.
            </motion.h2>
            <motion.div
              initial={{ y: 70, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeInOut" }}
              className="w-full md:w-[30rem]"
            >
              <p className="text-gray-600 mt-4 text-justify tracking-tight text-sm ">
                Llevamos la esencia de la excelencia a cada uno de nuestros
                productos, ofreciendo insumos de alta calidad para que tu
                negocio de perfumería o cosmética se diferencie con
                exclusividad. Contamos con una amplia selección de esencias
                premium, ideales para perfumes de tocador, productos cosméticos,
                aromatizantes de ambiente y textiles. Además, proporcionamos
                materias primas esenciales como alcohol de alta pureza, bases
                especializadas y cremas corporales, asegurando que cada creación
                tenga un acabado profesional y duradero.
              </p>
              <p className="text-gray-600 mt-4 text-justify tracking-tight text-sm ">
                Para complementar tu producción, ofrecemos envases y accesorios
                elegantes, diseñados para realzar la presentación de tus
                perfumes, junto con maquinaria de precisión como grameras,
                máquinas de llenado y grafadoras que optimizan los procesos y
                garantizan eficiencia. Más que insumos, te brindamos la
                oportunidad de crear experiencias olfativas memorables y elevar
                la calidad de tus productos para destacar en un mercado
                competitivo.
              </p>
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

      {/* Sección de Tarjetas */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Tarjeta 1 */}
        <div className="relative h-[30rem] md:h-[50rem] overflow-hidden group">
          <img
            src="https://granvelada.com/modules/numericco_category_custom_fields/upload/275/img/275-1637844268.jpeg"
            alt="Fondo Tarjeta 1"
            className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-center p-4">
            <div className="flex max-w-[25rem] flex-col justify-center">
              <h3 className="text-white font-bold font-titleAlt italic text-4xl md:text-5xl uppercase">
                Insumos
              </h3>
              <p className="text-gray-300 text-center mt-2 text-sm md:text-base">
                Explora nuestra línea de envases e insumos para perfumería.
              </p>
              <Link
               to="/catalogEnvases"
                className="mt-6 px-8 md:px-16 py-2 border text-xs tracking-[0.2em] md:tracking-[0.8em] border-white text-white hover:bg-white hover:text-black transition"
              >
                DESCUBRE MÁS
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="relative h-[30rem] md:h-[50rem] overflow-hidden group">
          <img
            src="https://cdn.leonardo.ai/users/68017305-d176-45f0-934a-cf03250a2262/generations/8404ffd9-7778-4068-be0f-3f7f28e66d73/Leonardo_Phoenix_09_En_primer_plano_un_lujoso_taller_de_perfum_2.jpg"
            alt="Fondo Tarjeta 2"
            className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-center p-4">
            <div className="flex max-w-[25rem] flex-col justify-center">
              <h3 className="text-white font-titleAlt font-bold italic text-4xl md:text-5xl uppercase">
                Esencias
              </h3>
              <p className="text-gray-300 text-center mt-2 text-sm md:text-base">
                Encuentra los insumos ideales para tu próxima creación.
              </p>
              <Link
                to="/catalogEsens"
                className="mt-6 px-8 md:px-16 py-2 border text-xs tracking-[0.2em] md:tracking-[0.8em] border-white text-white hover:bg-white hover:text-black transition"
              >
                DESCUBRE MÁS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSection;
