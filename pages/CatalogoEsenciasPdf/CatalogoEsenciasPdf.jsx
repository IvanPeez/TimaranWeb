const CatalogoEsenciasPdf = () => {
    return (
    <div className="p-4 min-h-screen bg-neutral-700 flex flex-col items-center">
      <div className="w-full max-w-6xl aspect-[9/16] md:aspect-[4/3] rounded shadow overflow-hidden">
        <iframe
          src="https://drive.google.com/file/d/1fMwvLGH8Dwf6xY1lJ8Lw8rVmAKFI285U/preview"
          className="w-full h-full"
          allow="autoplay"
          title="Catálogo PDF"
        />
      </div>
    </div>
  );
};

  export default CatalogoEsenciasPdf;