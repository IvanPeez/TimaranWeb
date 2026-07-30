import SectionContent from "../SectionContent/SectionContent";

const MapSection = () => {
  return (
    <SectionContent 
      style={{
          backgroundImage: `url('https://iili.io/KGlqjg1.png')`,
        }}
    className="relative h-[70vh] md:h-screen bg-cover bg-center bg-black">
      <div className="flex w-full flex-col items-end gap-6 px-6 py-16 text-end text-white sm:px-10 lg:px-20">
        <h2 className="font-titleAlt text-4xl font-semibold italic tracking-tighter sm:text-5xl lg:text-6xl">
          Presencia Nacional e Internacional
        </h2>
        <p className="w-full max-w-[40rem] text-end text-sm tracking-tight">
          Desde nuestra sede en Cali, Colombia, hemos logrado una expansión sin
          precedentes. No solo abastecemos cada rincón de Colombia, sino que
          también llevamos nuestra calidad a Suramérica Chile, Ecuador,
          Venezuela y Centroamérica Puerto Rico, Costa Rica.
        </p>
      </div>
    </SectionContent>
  );
};

export default MapSection;
