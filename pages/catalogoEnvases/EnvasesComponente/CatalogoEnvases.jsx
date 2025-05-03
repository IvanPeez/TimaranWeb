import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Configura el worker de PDF.js
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const CatalogoEnvases = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const loadingTask = getDocument(`${import.meta.env.BASE_URL}catalogo-envases.pdf`);
        const pdf = await loadingTask.promise;

        const pageImages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { willReadFrequently: true });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          pageImages.push(canvas.toDataURL());
        }

        setPages(pageImages);
      } catch (error) {
        console.error("Error al cargar el PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, []);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      {loading ? (
        <p className="text-white text-center">Cargando catálogo...</p>
      ) : (
        <HTMLFlipBook
          width={350}
          height={500}
          size="stretch"
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-2xl rounded-md"
        >
          {pages.map((src, index) => (
            <div key={index} className="bg-white w-full h-full flex items-center justify-center">
              <img src={src} alt={`Página ${index + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
};

export default CatalogoEnvases;