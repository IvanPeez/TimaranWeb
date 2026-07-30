import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { landingMessage, whatsappLink } from "../../utils/contacto";

// Contenido tomado de la sección "Preguntas frecuentes" de
// https://distribucionestimaran.odoo.com/ para que ambos sitios digan lo mismo.
export const PREGUNTAS = [
  {
    pregunta: "¿Las esencias ya vienen listas para hacer perfumes?",
    respuesta:
      "Nuestras esencias son fragancias inspiradas en perfumes reconocidos. Para crear un perfume terminado deben diluirse en alcohol siguiendo la proporción adecuada.",
  },
  {
    pregunta: "¿También venden los insumos para preparar perfumes?",
    respuesta:
      "Sí. Además de esencias, contamos con alcohol, fijadores, envases, atomizadores y otros insumos necesarios para crear perfumes listos para la venta.",
  },
  {
    pregunta: "¿Puedo comprar si apenas estoy empezando?",
    respuesta:
      "Claro. Muchos de nuestros clientes están iniciando su propia perfumería. Contamos con kits y asesoría básica para ayudarte a dar tus primeros pasos.",
  },
  {
    pregunta: "¿Las fragancias son similares a perfumes de marca?",
    respuesta:
      "Nuestro catálogo está compuesto por esencias inspiradas en fragancias reconocidas, desarrolladas para ofrecer perfiles olfativos similares y una excelente calidad.",
  },
  {
    pregunta: "¿Realizan envíos a todo el país?",
    respuesta:
      "Sí. Realizamos envíos a nivel nacional para que puedas recibir nuestros productos sin importar en qué ciudad te encuentres.",
  },
];

// Datos estructurados para que las preguntas puedan salir en Google.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PREGUNTAS.map(({ pregunta, respuesta }) => ({
    "@type": "Question",
    name: pregunta,
    acceptedAnswer: { "@type": "Answer", text: respuesta },
  })),
};

const Faqs = () => {
  const [abierta, setAbierta] = useState(0);

  return (
    <section id="faqs" className="bg-ink-soft px-4 py-20 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">
            Antes de escribirnos
          </p>
          <h2 className="mt-4 font-titleAlt text-4xl italic text-white sm:text-5xl">
            Preguntas frecuentes
          </h2>
        </div>

        <dl className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {PREGUNTAS.map((item, index) => {
            const estaAbierta = abierta === index;

            return (
              <div key={item.pregunta}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setAbierta(estaAbierta ? null : index)}
                    aria-expanded={estaAbierta}
                    aria-controls={`faq-respuesta-${index}`}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-champagne"
                  >
                    <span
                      className={`text-base font-medium sm:text-lg ${
                        estaAbierta ? "text-champagne" : "text-white"
                      }`}
                    >
                      {item.pregunta}
                    </span>
                    <span className="mt-1 shrink-0 text-champagne">
                      {estaAbierta ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </dt>

                <dd
                  id={`faq-respuesta-${index}`}
                  hidden={!estaAbierta}
                  className="pb-6 pr-10 text-sm leading-relaxed text-white/55"
                >
                  {item.respuesta}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-white/45">¿Tu duda no está aquí?</p>
          <a
            href={whatsappLink(
              landingMessage("Tengo una pregunta sobre sus productos:")
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            <FaWhatsapp className="h-4 w-4" />
            Pregúntanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
