import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import SectionContent from "../SectionContent/SectionContent";
import ProductCard from "../ProductCard";
import { landingMessage, whatsappLink } from "../../utils/contacto";
import Kit1Image from "../../resources/img/KITS-EMPRENDIMIENTO-1.jpg";
import Kit2Image from "../../resources/img/KITS-EMPRENDIMIENTO-2.jpg";
import Kit3Image from "../../resources/img/KITS-EMPRENDIMIENTO-3.jpg";
import Kit4Image from "../../resources/img/KITS-EMPRENDIMIENTO-4.jpg";

const KitsSection = () => {
  const products = [
    {
      id: 1,
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
      name: "Kit Profesional",
      imageFull: Kit3Image,
      description: "Un surtido amplio para tu negocio.",
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

  return (
    <SectionContent className="bg-ink">
      {/* Portada de la sección. Sin clip-path animado: recortaba el bloque
          entero (texto incluido) mientras se hacía scroll. */}
      <div className="relative h-[60vh] overflow-hidden md:h-[75vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.postimg.cc/85y4qmQ3/image-fx.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink" />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
            Para empezar de cero
          </p>
          <h2 className="mt-4 font-titleAlt text-5xl font-light italic tracking-tight text-white lg:text-7xl">
            Kits de Emprendimiento
          </h2>
          <p className="mt-5 max-w-xl text-sm text-white/60 lg:text-base">
            Todo lo necesario para producir desde el primer día: esencias,
            alcohol, fijador, envases y herramientas.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={whatsappLink(
                landingMessage(
                  "Quiero información sobre los kits de emprendimiento para montar mi línea de perfumería."
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne-light"
            >
              <FaWhatsapp className="h-4 w-4" />
              Solicitar asesoría
            </a>
            <Link
              to="/esencias"
              className="rounded-xl border border-white/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
            >
              Ver esencias
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Los 4 kits con su contenido real */}
      <div className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                index={index}
                name={product.name}
                imageFull={product.imageFull}
                description={product.description}
                fullDescription={product.fullDescription}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionContent>
  );
};

export default KitsSection;
