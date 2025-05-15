import {React, useEffect} from 'react';
import { X } from 'lucide-react';

export function PerfumeModal({ perfume, onClose }) {
   
  if (!perfume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0  bg-black/20" onClick={onClose} />
      
      <div className="relative bg-[#1A1A1A]/65 backdrop-blur-lg rounded-3xl overflow-hidden w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:opacity-80"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center w-full md:flex-row">
          {/* Left side - Image a
          nd notes */}
          
            <div className="px-12 pt-24 w-[25rem] md:w-[40rem] md:h-[40rem]">
              <img
                src={perfume.picture}
                alt={perfume["newName"]}
                className="object-cover object-bottom h-[450px] w-full rounded-lg"
              />
            </div>
          

          {/* Right side - Details */}
          <div className="w-full flex flex-col justify-center text-start p-8">

            {/* Title */}
            <h2 className="text-5xl font-bold font-titleAlt text-white italic mb-2">
              {perfume["newName"]}
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-300 mb-6">
              {perfume.name}
            </p>

            {/* Tags */}
            <div className="flex gap-2 mb-8">
              <span className="px-3 py-1 bg-[#333] text-white rounded-full text-sm">
                {perfume.gender}
              </span>
              <span className="px-3 py-1 bg-[#333] text-white rounded-full text-sm">
                {perfume.category}
              </span>
              <span className="px-3 py-1 bg-[#333] text-white rounded-full text-sm">
              {perfume.family}
              </span>
            </div>

            {/* Prices */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Precios X Gramo
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">10 KG EN ADELANTE:</div>
                  <div className="text-white font-bold">{perfume["10 KG EN ADELANTE"].toFixed(3)}</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">5 KG A 9,99 KG:</div>
                  <div className="text-white font-bold">{perfume["5 KG A 9,99 KG"].toFixed(3)}</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">1 KG A 4,99 KG:</div>
                  <div className="text-white font-bold">{perfume["1 KG A 4,99 KG"].toFixed(3)}</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">DE 500 A 999 GR:</div>
                  <div className="text-white font-bold">{perfume["DE 500 A 999 GRS"].toFixed(3)}</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">DE 250 A 499 GR:</div>
                  <div className="text-white font-bold">{perfume["DE 250 A 499 GRS"].toFixed(3)}</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">DE 120 A 249 GR:</div>
                  <div className="text-white font-bold">{perfume["DE 120 A 249 GRS"].toFixed(3)}</div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-300 mt-6">
                Nuestras esencias son creaciones propias inspiradas en fragancias reconocidas. No son réplicas ni copias, ni guardan relación con las marcas mencionadas, cuyos nombres se usan sólo como referencia olfativa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}