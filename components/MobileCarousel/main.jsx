import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "../../resources/img/consume mas esencia1.jpeg"
import image2 from "../../resources/img/consume mas esencia2.jpeg"
import image3 from "../../resources/img/consume mas esencia3.jpeg"

const MobileCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Datos del carrusel
  const slides = [
    {
      id: 1,
      title: "Consume Más Esencia",
      text: "Tu aroma, tu historia.",
      image: image3,
    },
    {
      id: 2,
      title: "El Aroma que Cuenta tu Historia",
      text: "Cada gota guarda un recuerdo, una emoción, un sueño. Inspirados en la cultura de Dubái, donde los perfumes son identidad, nuestras esencias te invitan a crear tu propia narrativa. Tu aroma, tu legado.",
      image: image2,
    },
    {
      id: 3,
      title: "Un Nuevo Mundo de Posibilidades",
      text: "En Latinoamérica, estamos revolucionando la forma de percibir los perfumes. Con el poder de las esencias, llevamos el prestigio y la sofisticación directamente a tus manos. Porque mereces lo mejor, siempre.",
      image: image1,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div id='masEsenciaMobile' className="md:hidden relative w-full h-[40rem] overflow-hidden">
      {/* Carrusel */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {slides.map((slide, index) => (
            index === currentIndex && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Contenido de la diapositiva */}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center px-12 py-8 sm:px-24">
                  <h1 className="text-white font-title uppercase text-4xl sm:text-3xl mb-8">
                    {slide.title}
                  </h1>
                  <p className="text-white text-justify text-sm ">{slide.text}</p>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition sm:p-3"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition sm:p-3"
      >
        &#8250;
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            } transition sm:w-3 sm:h-3`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;