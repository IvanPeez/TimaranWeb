import React, { useState } from "react";
import Modal from "../Modal/Modal";
import {motion} from "framer-motion"

const ProductCard = ({ image, name, imageFull, fullDescription,description,colorFrom,colorTo }) => {
  const [modalOpen, setModalOpen] = useState(false);
    return (
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        background: `linear-gradient(to bottom right, ${colorFrom}, ${colorTo})`,
      }}
      className={`max-w-full rounded-2xl m-2 shadow-md overflow-hidden`}>
        
        {/* <img className="w-full h-[30rem] object-cover" src={image} alt={name} /> */}
        <div className="flex flex-col gap-2 justify-between h-full p-4">
          <h2 className="text-6xl font-bold text-start text-black">{name}</h2>
          <p className="text-xl font-normal text-start text-black">{description}</p>
          <div className="flex justify-end mt-3">
            <a onClick={() => setModalOpen(true)} className=" text-linkColor cursor-pointer font-semibold relative group"> Mas Info.
            <div className="h-0.5 bg-linkColor 
            scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
          </div>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col md:flex-row justify-between gap-8 px-2 md:items-center">
            <div>
              <img className="rounded-lg w-full h-[20rem] md:h-[30rem] object-scale-down md:object-cover" src={imageFull} alt={name} />
            </div>
            <div className="w-[25rem] text-sm">
              <h2 className="text-left text-2xl font-bold mb-4">{name}</h2>
              <p className="text-left text-black whitespace-pre-line">{fullDescription}</p>
              <div className="flex justify-start pt-6">
                <a href="https://api.whatsapp.com/message/TQ6FRZIABEBPE1?autoload=1&app_absent=0" className=" text-linkColor font-semibold uppercase relative group"> Adquirir
                    <div className="h-0.5 bg-linkColor 
                    scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </a>
              </div>
              <span className="pt-4 text-gray-400 text-start justify-start flex">Contactarás con uno de nuestros asesores</span>
            </div>
            
          </div>
        </Modal>
      </motion.div>
  );
};
  
  export default ProductCard;