import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Sin exit: el modal se desmonta de golpe al no estar envuelto en
          AnimatePresence, así que animar la salida no haría nada. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white bg-opacity-85 backdrop-blur-sm mx-12 rounded-lg shadow-lg max-w-[50rem] w-full p-4 relative"
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Contenido del Modal */}
        <div className="text-center">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
