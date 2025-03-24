import SectionContent from "../SectionContent/SectionContent";
import React, { useRef } from "react";
import ProductCard from "../ProductCard";
import { motion, useTransform, useScroll } from "framer-motion";
import Kit1Image from "../../resources/img/KITS-EMPRENDIMIENTO-1.jpg";
import Kit2Image from "../../resources/img/KITS-EMPRENDIMIENTO-2.jpg";
import Kit3Image from "../../resources/img/KITS-EMPRENDIMIENTO-3.jpg";
import Kit4Image from "../../resources/img/KITS-EMPRENDIMIENTO-4.jpg";

const KitsSection = () => {
  const products = [
    {
      id: 1,
      colorFrom: "#FDF4E3",
      colorTo: "#FFF9F0",
      image: "/path-to-product-image-1.jpg",
      name: "Kit Esencial",
      imageFull: Kit1Image,
      description: "Lo básico para iniciar en el mundo de la perfumería.",
      fullDescription: `5L de alcohol extra neutro 96%.
          500gr de Fijador.
          12 Esencias por 120gr C/U.
          144 envases Trinity 30ml.
          1 Gramera.
          48 Tiras de Stickers (4 tiras por cada referencia).
          13 Válvulas dosificadoras.`,
    },
    {
      id: 2,
      colorFrom: "#FFE1A8",
      colorTo: "#F5CBA7",
      image: "/path-to-product-image-2.jpg",
      name: "Kit Avanzado",
      imageFull: Kit2Image,
      description: "Más insumos para expandir tu emprendimiento.",
      fullDescription: `5L de alcohol extra neutro 96%.
            500gr de Fijador.
            20 Esencias por 120gr C/U.
            120 envases cilindro Tpte. de 1onz.
            120 envases Bala color mix de 1onz.
            1 Gramera.
            80 Tiras de Stickers (4 tiras por cada referencia).
            21 Válvulas dosificadoras.`,
    },
    {
      id: 3,
      colorFrom: "#AFC2D5",
      colorTo: "#E2E8F0",
      image: "/path-to-product-image-3.jpg",
      name: "Kit Profesional",
      imageFull: Kit3Image,
      description: " Un surtido amplio para tu negocio",
      fullDescription: `10L de alcohol extra neutro.
          1Kg de Fijador.
          25 Esencias por 120gr C/U.
          360 envases cilindro de 1onz + Maleta de 20 puestos.
          1 Gramera.
          63 - Unidades Rollon 7ml + maleta de 60 puestos.
          100 Tiras de Stickers (4 tiras por cada referencia).
          26 Válvulas dosificadoras.`,
    },
    {
      id: 4,
      colorFrom: "#F3E5C0",
      colorTo: "#FFF6E0",
      image: "/path-to-product-image-4.jpg",
      name: "Kit Empresarial",
      imageFull: Kit4Image,
      description: "La opción más completa para maximizar tu producción.",
      fullDescription: `10L de alcohol extra neutro.
            1Kg de Fijador.
            40 Esencias por 120gr C/U.
            180 envases cilindro color de 1onz + Maleta de 20 puestos 1onz.
            120 envases Bala 2onz + Maleta de 20 puestos 2onz.
            50 unidades - Cajas cilindro 1onz.
            130 unidades - Fundas cilindro 1onz.
            120 unidades - Fundas cilindro 2onz.
            1 Gramera.
            2 paquetes de probadores X 200 unds C/U
            160 Tiras de Stickers (4 tiras por cada referencia).
            41 Válvulas dosificadoras.`,
    },
  ];
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Ajustes de animación para dispositivos móviles
  

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    [
      "inset(20% 10% 20% 10%)",
      "inset(0% 0% 0% 0%)", // Menos agresivo en móviles
    ]
  );

  return (
    <SectionContent
    ref={targetRef}>
      <motion.div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.postimg.cc/85y4qmQ3/image-fx.png')`,
          clipPath
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
          className="relative z-10 flex flex-col justify-end text-center items-center h-full px-6 pb-24 sm:px-12 md:px-24 lg:px-32"
        >
          <h1
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1, ease: "easeInOut" }}
            className="text-white font-titleAlt italic tracking-tight text-5xl lg:text-8xl font-light mb-8 "
          >
            Kits de Emprendimiento
          </h1>
          <p className="text-white max-w-4xl text-sm lg:text-base">
            En Distribuciones Timaran, creemos en el poder de los emprendedores
            para transformar ideas en realidades. Al adquirir nuestros
            productos, no solo estás obteniendo calidad y confianza, sino
            también el respaldo de una entidad comprometida con tu éxito.
            Estamos aquí para impulsar tu crecimiento, apoyarte en cada paso y
            celebrar tus logros. Juntos, construimos un futuro lleno de
            oportunidades.
          </p>
          <div className="flex pt-6">
            <a
              href=""
              className=" text-white md:tracking-[0.5em] uppercase relative group"
            >
              Solicitar Asesoría
              <div className="h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* <motion.div
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="p-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 bg-white min-h-6xl"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            // image={product.image}
            name={product.name}
            imageFull={product.imageFull}
            colorFrom={product.colorFrom}
            colorTo={product.colorTo}
            description={product.description}
            fullDescription={product.fullDescription}
          />
        ))}
      </motion.div> */}
    </SectionContent>
  );
};

export default KitsSection;
