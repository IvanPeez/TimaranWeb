import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { advisorMessage, whatsappLink } from "../../utils/contacto";

/**
 * Acceso permanente a WhatsApp en móvil, donde el botón del navbar no cabe.
 * Aparece pasado el hero para no tapar el CTA principal.
 */
const WhatsAppFab = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setIsVisible(window.scrollY > window.innerHeight * 0.8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={whatsappLink(advisorMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/50 transition-all duration-300 md:hidden ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFab;
