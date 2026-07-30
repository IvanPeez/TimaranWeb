import React from 'react';
import Felipe from "../../resources/felipe.jpg"
import Owen from "../../resources/owen.jpg"
import Mauricio from "../../resources/Mauricio.jpg"

const FUNDADORES = [
    {
        img: Mauricio,
        nombre: "Mauricio Timaran",
        cargo: "CEO y Fundador",
        bio: "Líder visionario con amplia experiencia en la industria, apasionado por la innovación y la calidad.",
    },
    {
        img: Felipe,
        nombre: "Felipe Timaran",
        cargo: "Director Creativo",
        bio: "Responsable de la innovación y creatividad, con un enfoque en las tendencias del mercado.",
    },
    {
        img: Owen,
        nombre: "Owen Timaran",
        cargo: "Director de Operaciones",
        bio: "Experto en gestión y logística, comprometido con el crecimiento sostenible de la empresa.",
    },
];

const CardsFounders = () => {
    return (
        <div className="grid w-full grid-cols-1 items-center bg-ink md:grid-cols-3">
            {FUNDADORES.map((fundador) => (
                <div
                    key={fundador.nombre}
                    className="group relative flex h-full flex-col items-center overflow-hidden text-center transition duration-300 md:opacity-70 md:grayscale md:hover:opacity-100 md:hover:grayscale-0"
                >
                    <img
                        src={fundador.img}
                        alt={fundador.nombre}
                        loading="lazy"
                        className="h-[45vh] w-full object-cover object-top md:h-[80vh]"
                    />

                    {/* En móvil el texto va siempre visible: no hay hover en pantalla táctil */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink transition duration-300">
                        <div className="flex h-full flex-col justify-end px-8 pb-8 text-left text-white opacity-100 transition-opacity duration-500 md:px-12 md:opacity-0 md:group-hover:opacity-100">
                            <h4 className="font-titleAlt text-2xl italic">{fundador.nombre}</h4>
                            <p className="text-sm text-champagne">{fundador.cargo}</p>
                            <p className="mt-2 text-sm text-white/70">{fundador.bio}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardsFounders;
