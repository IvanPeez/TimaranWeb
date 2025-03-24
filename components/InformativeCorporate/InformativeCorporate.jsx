import { useRef, useState } from "react";
import { motion, useTransform, useScroll, useMotionValue } from "framer-motion";

const InformativeCorporate = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const blurValue = useTransform(scrollYProgress, [0, 0.2], ["0px", "800px"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden h-[200vh] bg-black text-white px-6 md:px-20"
    >
      <motion.div
        style={{ y, scale, opacity, filter: `blur(${blurValue})` }}
        className="absolute inset-0 z-0 h-screen w-full flex justify-center  items-center "
      >
        <motion.div className="px-12">
          <h2 className="text-4xl lg:text-7xl md:text-4xl font-titleAlt leading-tight">
            Líderes del mercado <br /> en insumos para perfumería
          </h2>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default InformativeCorporate;
