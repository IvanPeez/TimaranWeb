import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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
