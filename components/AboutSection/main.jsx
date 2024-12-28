import React from 'react';
import ScrollingX from "../../components/ScrollingX/main";
import CardsFounders from '../CardsFounders/main';

const AboutUsSection = () => {
  return (
    <section>
        <ScrollingX></ScrollingX>
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