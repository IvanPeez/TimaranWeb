import React from "react";
import { motion } from "framer-motion";
import HeroVid from "../../resources/vid/heroVid.mp4"

const Hero = () => {
    return (
      <div className="relative h-screen w-full">  
        <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HeroVid}
        autoPlay
        loop
        muted
        >
        </video>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col items-center justify-end">
            {/* Título principal */}
            <h1 className="text-3xl font-light md:text-3xl uppercase  text-white mb-4">
              Bienvenido a <span className="text-white font-semibold">Distribuciones Timaran</span>
            </h1>
  
            {/* Subtítulo */}
            <motion.p 
             initial={{ y: -50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             transition={{ duration: 1 }}
            className=" font-light text-base md:text-base text-white max-w-2xl mb-12">
              Encuentra las mejores esencias e insumos para alta perfumería, diseñados para inspirar elegancia y sofisticación.
            </motion.p>
          </div>
          
      </div>
    );
  };

export default Hero;