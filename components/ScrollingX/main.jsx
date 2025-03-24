import { motion, useTransform, useScroll,AnimatePresence} from "framer-motion";
import { useRef, useState } from "react";

const ScrollingX = () => {
  return (
    <div className="bg-neutral-900">
      
      <HorizontalScrollCarousel/>
      
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  return (
    <section id="masEsencia" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
      ref={targetRef}  className="hidden md:block relative bg-cover bg-no-repeat h-[300vh]">
        <div  className=" bg-black bg-opacity-40 sticky top-0 flex items-center overflow-hidden ">
          <motion.div style={{x}} className="flex h-screen w-max">
            <div className="w-[100vw] flex flex-col justify-center text-center items-center h-full">
              <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h3 className="text-9xl font-title uppercase font-light text-white mb-4">Consume Más Esencia</h3>
                <p className="text-white text-4xl font-light">
                Tu aroma, tu historia.
                </p>
              </motion.div>
            </div>
            <div className="w-[100vw] flex flex-col bg-cover bg-no-repeat text-left items-start h-full">
            <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="max-w-2xl pl-16 pt-40">
              <h3 className="text-8xl uppercase font-title font-light text-white mb-4">El Aroma que Cuenta tu Historia</h3>
              <p className="text-white text-base font-light text-justify">
              Cada gota guarda un recuerdo, una emoción, un sueño. Inspirados en la cultura de Dubái, donde los perfumes son identidad, nuestras esencias te invitan a crear tu propia narrativa. Tu aroma, tu legado.
              </p>
            </motion.div>
            </div>
            <div className=" w-[100vw] flex flex-col bg-cover bg-no-repeat justify-end text-left items-start h-full">
              <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="max-w-2xl pl-24 pb-20">
                  <h3 className="text-8xl uppercase font-title font-light text-white mb-4">Un Nuevo Mundo de Posibilidades</h3>
                  <p className="text-white text-base font-base text-justify">
                  En Latinoamérica, estamos revolucionando la forma de percibir los perfumes. Con el poder de las esencias, llevamos el prestigio y la sofisticación directamente a tus manos. Porque mereces lo mejor, siempre.
                  </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
    </section>
    
  );
};



export default ScrollingX;



