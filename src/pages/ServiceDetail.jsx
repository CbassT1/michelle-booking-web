import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function ServiceDetail() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulamos la carga de datos por ahora
    const cargarDetalle = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/services');
        const data = await respuesta.json();
        const servicioEncontrado = data.find(s => s.id === parseInt(id));
        setServicio(servicioEncontrado);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) return <div className="text-center mt-32 tracking-widest text-gray-400">Cargando detalles...</div>;
  if (!servicio) return <div className="text-center mt-32 tracking-widest text-red-400">Servicio no encontrado</div>;

  return (
    <ScrollReveal>
      <section className="max-w-4xl mx-auto mt-12 px-4 mb-32">
        <Link to="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-dark transition-colors border-b border-transparent hover:border-dark pb-1 mb-8 inline-block">
          ← Volver al Menú
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
          {/* Columna Izquierda: Fotos */}
          <div className="flex flex-col space-y-4">
            <div className="bg-[#f0efed] h-96 flex items-center justify-center rounded-sm">
              <span className="text-gray-400 text-xs tracking-widest uppercase">[ Foto Principal ]</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0efed] h-32 flex items-center justify-center rounded-sm"><span className="text-gray-400 text-[10px] uppercase">[ Detalle 1 ]</span></div>
              <div className="bg-[#f0efed] h-32 flex items-center justify-center rounded-sm"><span className="text-gray-400 text-[10px] uppercase">[ Detalle 2 ]</span></div>
            </div>
          </div>

          {/* Columna Derecha: Información y Cuidados */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-serif mb-4">{servicio.nombre}</h1>
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-2xl font-medium">${servicio.precio}</span>
              <span className="text-xs text-dark bg-light px-3 py-1 rounded-sm tracking-widest">{servicio.duracion_minutos} MIN</span>
            </div>
            
            <p className="text-gray-500 leading-relaxed mb-10">{servicio.descripcion}</p>

            <div className="border-t border-gray-200 pt-8 mb-10">
              <h3 className="text-lg font-medium mb-4">Cuidados Posteriores</h3>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li className="flex items-start"><span className="mr-2 text-dark">•</span> Evitar contacto con agua por 24 hrs.</li>
                <li className="flex items-start"><span className="mr-2 text-dark">•</span> No aplicar maquillaje sobre la zona.</li>
                <li className="flex items-start"><span className="mr-2 text-dark">•</span> Evitar la exposición directa al sol y saunas.</li>
              </ul>
            </div>

            {/* Aquí podríamos redirigir al Home con el estado seteado a "Agendar", pero por ahora solo es un botón visual */}
            <button className="w-full bg-dark text-white py-5 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 shadow-sm hover:shadow-md">
              Agendar este servicio
            </button>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}