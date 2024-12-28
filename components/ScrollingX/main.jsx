import { motion, useTransform, useScroll} from "framer-motion";
import { useRef } from "react";

const ScrollingX = () => {
  return (
    <div className="bg-neutral-900">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-white">
          SOBRE NOSOSTROS
        </span>
      </div>
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
    <section style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
      ref={targetRef}  className="relative bg-cover bg-no-repeat h-[300vh]">
        <div  className=" sticky top-0 flex items-center overflow-hidden ">
          <motion.div style={{x}} className="flex h-screen w-max">
            <div className="w-[100vw] flex flex-col justify-center text-center items-center h-full">
              <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h3 className="text-9xl uppercase font-light text-white mb-4">Somos Timaran</h3>
                <p className="text-white text-base font-light">
                ¿Has visto a alguien diligente en su trabajo?
                Se codeará con reyes; No estará delante de los de baja condición.
                </p>
                <span className="text-white text-sm font-light">Proverbios 22:29</span>
              </motion.div>
            </div>
            <div className="w-[100vw] flex flex-col bg-cover bg-no-repeat text-left items-start h-full">
            <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="max-w-md pl-16 pt-40">
              <h3 className="text-9xl uppercase font-light text-white mb-4">Nuestra Misión</h3>
              <p className="text-white text-base font-light text-justify">
              Proveer esencias de alta calidad y los mejores insumos para inspirar la creación de productos que trascienden y generan experiencias inolvidables.
              </p>
            </motion.div>
            </div>
            <div className=" w-[100vw] flex flex-col bg-cover bg-no-repeat justify-end text-left items-start h-full">
              <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="max-w-md pl-24 pb-20">
                  <h3 className="text-9xl uppercase font-light text-white mb-4">Nuestra Visión</h3>
                  <p className="text-white text-base font-base text-justify">
                    Ser reconocidos como líderes en la industria de esencias e insumos, destacándonos por nuestra innovación, calidad y compromiso con el cliente.
                  </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
    </section>
    
  );
};



export default ScrollingX;



