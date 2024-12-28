import React from 'react';
import { Link } from 'react-router-dom';

const CardsSection = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black text-center uppercase mb-8">Conoce Nuestros Procuctos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1 */}
          <div className="relative overflow-hidden rounded-lg shadow-lg group">
            <img
              src="https://www.cosmeticlatam.com/wp-content/uploads/2021/02/bulgari-packaging-vidrio-reciclado.jpg"
              alt="Fondo Tarjeta 1"
              className="object-cover w-full h-100 md:h-100 transition-transform duration-500 transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex items-end justify-center text-center p-4 transition-opacity duration-500 group-hover:bg-opacity-60">
              <div className='flex flex-col'>
                <h3 className="text-white text-2xl uppercase tracking-widest font-semibold">Catalogo Insumos</h3>
                <p className="text-gray-300 mt-2">
                    Explora nuestra línea de envases e insumos para perfumería. Calidad y estilo para tus creaciones aromáticas
                </p>
                <div className="flex justify-center pt-6">
                <Link to="/" className=" text-white tracking-widest uppercase relative group">Descubre
                    <div className="h-0.5 bg-white 
                    scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="relative overflow-hidden rounded-lg shadow-lg group">
            <img
              src="https://s2-quem.glbimg.com/6vjJHNEvrNvmYkOiOO4DO-eTlcA=/0x0:1400x1016/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_b0f0e84207c948ab8b8777be5a6a4395/internal_photos/bs/2022/F/H/opA8u0QA28Kemub4ThiA/fotojet-48-.jpg"
              alt="Fondo Tarjeta 2"
              className="object-cover w-full h-100 md:h-100 transition-transform duration-500 transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex items-end justify-center text-center p-4 transition-opacity duration-500 group-hover:bg-opacity-60">
              <div className='flex flex-col'>
                <h3 className="text-white text-2xl font-semibold">Catalogo de Esencias</h3>
                <p className="text-gray-300 mt-2">
                  Encuentra los insumos ideales para tu próxima creación.
                </p>
                <div className="flex justify-center pt-6">
                <Link to="/" className=" text-white tracking-widest uppercase relative group">Descubre
                    <div className="h-0.5 bg-white 
                    scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSection;