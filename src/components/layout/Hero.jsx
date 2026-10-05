export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto mt-10 px-4">
      <div className="bg-[#e5e5e5] h-64 md:h-96 flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
        <span className="text-gray-400 tracking-widest text-sm">[ PLACEHOLDER FOTOGRAFÍA ESTILO EDITORIAL ]</span>
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      </div>
      <div className="text-center mt-10">
        <button className="bg-dark text-white px-10 py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300">
          Agendar Cita
        </button>
      </div>
    </section>
  );
}