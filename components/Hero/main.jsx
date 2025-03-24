import React from "react";
import { delay, motion } from "framer-motion";
import HeroVid from "../../resources/vid/TimaranVid2.mov"

const Hero = () => {
    return (
      <div 
      id="home"
      className="relative h-screen w-full"
      >  
        <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HeroVid}
        autoPlay
        loop
        muted
        >
        </video>

          <div className="absolute inset-0 px-8 bg-gradient-to-b from-transparent to-black flex flex-col items-center md:text-start md:items-start justify-end">
            {/* Título principal */}
            <motion.h1
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl font-titleAlt tracking-tighter font-extralight md:text-9xl mx-3 text-white mb-4">
              Bienvenido a <motion.span 
              initial={{ filter: "blur(10px)" }}
              whileInView={{ filter: "blur(0px)" }}
              transition={{ duration: 1,delay: 1, ease: "easeOut"}}
              className="block text-6xl md:text-9xl text-white italic">Distribuciones Timaran</motion.span>
            </motion.h1>
  
            {/* Subtítulo */}
            <motion.p 
             initial={{ y: -50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             transition={{ duration: 1 ,delay: 1.5, ease: "easeOut"}}
            className=" font-light text-base md:text-4xl text-white max-w-[50rem] mb-12 mx-3">
              Encuentra las mejores esencias e insumos para alta perfumería, diseñados para inspirar elegancia y sofisticación.
            </motion.p>
          </div>
          
      </div>
    );
  };

export default Hero;