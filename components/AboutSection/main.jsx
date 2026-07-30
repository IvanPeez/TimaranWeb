import React from "react";
import CardsFounders from "../CardsFounders/main";

const AboutUsSection = () => {
  return (
    <section className="bg-ink">
      <div className="flex h-40 items-center justify-center px-4 md:h-56">
        <h2 className="border-b border-champagne/40 pb-3 font-titleAlt text-3xl italic text-white md:text-4xl">
          Nuestros Fundadores
        </h2>
      </div>
      <CardsFounders />
    </section>
  );
};

export default AboutUsSection;
