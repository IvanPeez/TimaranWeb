import SectionContent from "../SectionContent/SectionContent";

const MapSection = () => {
  return (
    <SectionContent className="relative h-screen bg-cover bg-center bg-black">
      <div className="flex text-end items-end gap-8 text-white py-16 px-20 w-full flex-col">
        <h2 className="italic font-titleAlt text-6xl font-semibold tracking-tighter">
          Presencia Nacional e Internacional
        </h2>
        <p className="text-end  tracking-tight text-sm w-[40rem]">
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
