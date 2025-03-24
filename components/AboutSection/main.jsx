import CardsFounders from '../CardsFounders/main';
import React from "react";
import BlurText from '../../utils/BlurText';
import GalleryGrid from '../GalleryGrid/GalleryGrid';
import {motion} from 'framer-motion' 
const items = [
  'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  'https://i.postimg.cc/xd0dKf8X/gallery4.jpg',
  'https://i.postimg.cc/CxC1BBhy/gallery3.jpg',
  'https://i.postimg.cc/SKDxdBYD/gallery2.jpg',
  // 'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  // 'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  // 'https://i.postimg.cc/xd0dKf8X/gallery4.jpg',
  // 'https://i.postimg.cc/CxC1BBhy/gallery3.jpg',
  // 'https://i.postimg.cc/SKDxdBYD/gallery2.jpg',
  // 'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  // 'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  // 'https://i.postimg.cc/xd0dKf8X/gallery4.jpg',
  // 'https://i.postimg.cc/CxC1BBhy/gallery3.jpg',
  // 'https://i.postimg.cc/SKDxdBYD/gallery2.jpg',
  // 'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  // 'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  // 'https://i.postimg.cc/xd0dKf8X/gallery4.jpg',
  // 'https://i.postimg.cc/CxC1BBhy/gallery3.jpg',
  // 'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  // 'https://i.postimg.cc/SKDxdBYD/gallery2.jpg',
  // 'https://i.postimg.cc/CxC1BBhy/gallery3.jpg',
  // 'https://i.postimg.cc/xd0dKf8X/gallery4.jpg',
  // 'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  // 'https://i.postimg.cc/SKDxdBYD/gallery2.jpg',
  // 'https://i.postimg.cc/g2bj2qPq/gallery1.jpg',
  // 'https://i.postimg.cc/pTrX6sDx/gallery5.jpg',
  // Add more items as needed https://postimg.cc/gallery/qRmgbQB
];

const AboutUsSection = () => {
  
  return (
    <section id="aboutUs" >
         {/* Encabezado */}
      <div className='mt-36 mb-8 mx-9'>
          <BlurText
          text="Sobre Nosotros"
          delay={90}
          animateBy="letters"
          direction="top"
          className=" font-title text-6xl md:text-9xl mb-8"
        />
        <div
        className='w-full h-full flex flex-col justify-center mb-20'>
          <motion.p
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay:1, duration: 0.6, ease: "easeInOut"  }}
          viewport={{ once: true }}
          className="text-black text-xl font-light">
            ¿Has visto a alguien diligente en su trabajo?
            Se codeará con reyes; No estará delante de los de baja condición.
          </motion.p>
          <motion.span
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay:1.5, duration: 0.6, ease: "easeInOut"  }}
          viewport={{ once: true }}
          className="text-black text-base font-bold">
            Proverbios 22:29
          </motion.span>
        </div>
      </div>
      <div className='hidden md:block'>
        <GalleryGrid items={[...items, ...items, ...items, ...items, ...items, ...items]} />
      </div>
      
      {/*Misión y Visión
      <div className="-mt-8 mb-12 grid-cols-1 items-center max-w-7xl mx-auto ">
        {/* Misión 
        <div className=" bg-white text-black flex mx-12 flex-col md:flex-row  h-auto gap-24 shadow-lg rounded-lg p-6">
          <div>
          <h3 className="text-2xl font-semibold mb-4">Misión</h3>
          <p className="">
          Proveer esencias de alta calidad y los mejores insumos para inspirar la creación de productos que trascienden y generan experiencias inolvidables.
          </p>
          </div>
          <div>
          <h3 className="text-2xl font-semibold mb-4">Visión</h3>
          <p className="">
          Ser reconocidos como líderes en la industria de esencias e insumos, destacándonos por nuestra innovación, calidad y compromiso con el cliente.
          </p>
          </div>
        </div>
      </div>
      */}
        <div className="bg-neutral-900">
            <div className="flex h-64 items-center justify-center">
                <span className="text-3xl font-light uppercase border-b-2 text-white tracking-widest">
                    Nuestros Fundadores
                </span>
            </div>
            <CardsFounders></CardsFounders>
        </div>
        
    </section>

   
  );
};

export default AboutUsSection;