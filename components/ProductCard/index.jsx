import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { landingMessage, whatsappLink } from "../../utils/contacto";

const ProductCard = ({ name, imageFull, fullDescription, description, index = 0 }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card text-left transition-colors duration-300 hover:border-champagne/40"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageFull}
          alt={name}
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-titleAlt text-2xl italic text-white">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
          {description}
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-5 w-full rounded-lg border border-white/15 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-champagne hover:text-champagne"
        >
          Ver qué incluye
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col justify-between gap-8 px-2 md:flex-row md:items-center">
          <div className="md:w-1/2">
            <img
              className="h-[16rem] w-full rounded-lg object-cover md:h-[26rem]"
              src={imageFull}
              alt={name}
            />
          </div>
          <div className="text-sm md:w-1/2">
            <h2 className="mb-4 text-left font-titleAlt text-3xl italic">
              {name}
            </h2>
            <p className="whitespace-pre-line text-left text-black/80">
              {fullDescription}
            </p>

            <a
              href={whatsappLink(
                landingMessage(
                  `Me interesa el *${name}*. ¿Me comparten precio y disponibilidad?`
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            >
              <FaWhatsapp className="h-4 w-4" />
              Cotizar este kit
            </a>
            <span className="mt-3 flex justify-start text-xs text-gray-500">
              Contactarás con uno de nuestros asesores
            </span>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ProductCard;
