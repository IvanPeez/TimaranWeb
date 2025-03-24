import React from "react";
import Navbar from "../../components/Navbar/main";
import { motion } from "framer-motion";
import image1 from "../../resources/img/consume mas esencia1.jpeg"
import image2 from "../../resources/img/consume mas esencia2.jpeg"
import image3 from "../../resources/img/consume mas esencia3.jpeg"

const ParallaxSection = ({ title, text, bgImage }) => {
    return (
      <div
        className="relative flex items-center justify-center h-screen bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          className="relative text-center text-white max-w-2xl px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg">{text}</p>
        </motion.div>
      </div>
    );
  };

const AboutUs = () =>{
    return(
      <div className="bg-black text-white">
        <Navbar></Navbar>
        <section>
          
        </section>
      </div>
        
    )
}

export default AboutUs