import React from "react";
import { X } from "lucide-react";

export function PerfumeModal({ perfume, onClose }) {
  if (!perfume) return null;
  console.log(perfume);
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20  z-40"
        onClick={onClose}
      />

      {/* Sliding Modal */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          perfume ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky bg-white top-0 border-b-2 border-solid border-black text-black px-6 py-2 flex justify-between items-center">
            <h2 className="md:text-5xl text-3xl font-titleAlt italic font-bold">
              {perfume["NUEVO NOMBRE"]}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-black hover:text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6 text-start">
              <p className="text-sm text-gray-500">{perfume.name}</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                  {perfume.gender}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                  {perfume.category}
                </span>
                {perfume.isNew && (
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                    Novedad
                  </span>
                )}
              </div>
            </div>

            {/* Mock Image */}
            <div className=" flex justify-center mb-8 bg-cover w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={perfume.picture}
                alt={perfume["NUEVO NOMBRE"]}
                className="max-w-[20rem] h-full object-cover"
              />
            </div>

            {/* Compact Price Grid */}
            <div>
              <h3 className="font-bold text-start text-lg mb-4">
                Precios X Gramo
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-start">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">10 KG EN ADELANTE</div>
                  <div className="font-bold">
                    ${perfume["10 KG EN ADELANTE"].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">5 KG A 9,99 KG</div>
                  <div className="font-bold">
                    ${perfume["5 KG A 9,99 KG"].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">1 KG A 4,99 KG</div>
                  <div className="font-bold">
                    ${perfume["1 KG A 4,99 KG"].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">DE 500 A 999 GRS</div>
                  <div className="font-bold">
                    ${perfume["DE 500 A 999 GRS"].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">DE 250 A 499 GRS</div>
                  <div className="font-bold">
                    ${perfume["DE 250 A 499 GRS"].toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-600 mb-1">DE 120 A 249 GRS</div>
                  <div className="font-bold">
                    ${perfume["DE 120 A 249 GRS"].toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
