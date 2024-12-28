import React from 'react';
import {motion} from "framer-motion"
import Felipe from "../../resources/felipe.jpeg"
import Owen from "../../resources/owen.jpeg"
import Mauricio from "../../resources/Mauricio.jpeg"

const CardsFounders = () => {
    return(
        <div className="grid w-full grid-cols-1 md:grid-cols-3 items-center bg-black">
        {/* Fundador 1 */}
        <div className="relative group filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition duration-300 overflow-hidden flex flex-col h-full items-center text-center">
            <img
            src={Mauricio}
            alt="Fundador 1"
            className="w-full h-full  object-cover mb-4"
            />
            <div className='opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-b from-transparent to-black absolute inset-0 '>
                <div className='flex h-full justify-end flex-col pb-8 text-white'>
                    <h4 className="text-xl uppercase font-medium ">Mauricio Timaran</h4>
                    <p className="text-sm">CEO y Fundador</p>
                    <p className="mt-2 ">
                        Líder visionario con amplia experiencia en la industria, apasionado por la innovación y la calidad.
                    </p>
                </div> 
            </div>
        </div>

        {/* Fundador 2 */}
        <div className="relative group filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition duration-300 overflow-hidden flex flex-col h-full items-center text-center">
            <img
            src={Felipe}
            alt="Fundador 2"
            className="w-full h-full object-cover bg-no-repeat mb-4"
            />
            <div className='opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-b from-transparent to-black absolute inset-0 '>
                <div className='flex h-full justify-end flex-col pb-8 text-white'>
                    <h4 className="text-xl font-medium">Felipe Timaran</h4>
                    <p className=" text-sm">Director Creativo</p>
                    <p className="mt-2 ">
                        Responsable de la innovación y creatividad, con un enfoque en las tendencias del mercado.
                    </p>
                </div>
                
            </div>
            
        </div>

        {/* Fundador 3 */}
        <div className="relative group filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition duration-300 overflow-hidden flex flex-col h-full items-center text-center">
            <img
            src={Owen}
            alt="Fundador 3"
            className="w-full h-full object-cover bg-no-repeat mb-4"
            />
            <div className='opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-b from-transparent to-black absolute inset-0 '>
                <div className='flex h-full justify-end flex-col pb-8 text-white'>
                    <h4 className="text-xl font-medium ">Owen Timaran</h4>
                    <p className="text-sm">Director de Operaciones</p>
                    <p className="mt-2 ">
                        Experto en gestión y logística, comprometido con el crecimiento sostenible de la empresa.
                    </p>
                </div>
                
            </div>
            
        </div>
    </div>

    );
       
}

export default CardsFounders;