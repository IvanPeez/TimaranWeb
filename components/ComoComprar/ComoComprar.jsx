import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { landingMessage, whatsappLink } from "../../utils/contacto";

// Cifras redondeadas a la baja a propósito: así no hay que tocar la landing
// cada vez que crece el catálogo, y evitamos importar esenciasBack.js (497 KB)
// en la página de inicio.
const EVIDENCIA = [
  { dato: "+860", texto: "esencias en catálogo" },
  { dato: "30", texto: "novedades recientes" },
  { dato: "120 g", texto: "pedido mínimo por referencia" },
  { dato: "6", texto: "países atendidos" },
];

const PASOS = [
  {
    n: "01",
    titulo: "Elige tus esencias",
    texto:
      "Explora el catálogo, filtra por familia olfativa o género y arma tu selección. No necesitas registrarte.",
  },
  {
    n: "02",
    titulo: "Te cotizamos",
    texto:
      "Nos envías la lista por WhatsApp y un asesor te responde con precios por gramo, presentaciones y disponibilidad.",
  },
  {
    n: "03",
    titulo: "Recibes tu pedido",
    texto:
      "Coordinamos el despacho a toda Colombia. Desde 120 gramos por referencia, sin pedidos mínimos imposibles.",
  },
];

const ComoComprar = () => {
  return (
    <section className="bg-ink px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Franja de evidencia */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/10 pb-12 md:grid-cols-4">
          {EVIDENCIA.map((item) => (
            <div key={item.texto} className="text-center">
              <dt className="font-titleAlt text-4xl italic text-champagne sm:text-5xl">
                {item.dato}
              </dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/45">
                {item.texto}
              </dd>
            </div>
          ))}
        </dl>

        {/* Pasos */}
        <div className="pt-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
            Sin carrito, sin vueltas
          </p>
          <h2 className="mt-4 font-titleAlt text-4xl italic text-white sm:text-5xl">
            Cómo se compra
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {PASOS.map((paso, index) => (
            <motion.div
              key={paso.n}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-ink-card px-7 py-9 text-left"
            >
              <span className="font-titleAlt text-3xl italic text-champagne/40">
                {paso.n}
              </span>
              <h3 className="mt-3 text-base font-semibold uppercase tracking-[0.1em] text-white">
                {paso.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {paso.texto}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Por qué no hay precios publicados */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/40">
          ¿Por qué no ves precios en la web? Porque el valor por gramo cambia
          según la cantidad que lleves: cotizamos a tu medida en lugar de
          publicar una lista que no aplicaría a tu caso.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/esencias"
            className="flex items-center justify-center rounded-xl bg-champagne px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne-light"
          >
            Empezar por el catálogo
          </Link>
          <a
            href={whatsappLink(
              landingMessage(
                "Quiero cotizar esencias e insumos para perfumería. ¿Me ayudan?"
              )
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            <FaWhatsapp className="h-4 w-4" />
            Pedir cotización
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComoComprar;
