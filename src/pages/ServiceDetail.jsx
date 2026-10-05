import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function ServiceDetail() {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [subServicios, setSubServicios] = useState([]);
  const [subSeleccionado, setSubSeleccionado] = useState(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/services');
        const data = await respuesta.json();
        
        const dataLimpia = data.map(s => ({
          ...s,
          nombre: s.nombre.replace(/ 1x1/gi, '').replace(/\s*\(.*?\)\s*/g, '').trim()
        }));

        if (id === 'extensiones-agrupadas') {
          const extensionesNombres = ["set", "retiro"];
          const sets = dataLimpia.filter(s => extensionesNombres.some(n => s.nombre.toLowerCase().includes(n)));
          
          sets.sort((a, b) => {
            const aEsRetiro = a.nombre.toLowerCase().includes('retiro');
            const bEsRetiro = b.nombre.toLowerCase().includes('retiro');
            if (aEsRetiro && !bEsRetiro) return 1;
            if (!aEsRetiro && bEsRetiro) return -1;
            return 0;
          });
          
          setServicio({
            isGroup: true,
            nombre: 'Extensiones de Pestañas',
            descripcion: 'Descubre nuestra variedad de diseños de extensiones. Cada set está creado para adaptarse a la forma de tu ojo, cuidando la salud de tu pestaña natural.',
          });
          setSubServicios(sets);
          if (sets.length > 0) setSubSeleccionado(sets[0]);
        } else {
          const servicioEncontrado = dataLimpia.find(s => String(s.id) === String(id));
          setServicio(servicioEncontrado);
        }
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) return <div className="text-center mt-32 tracking-widest text-gray-400">Cargando detalles...</div>;
  if (!servicio) return <div className="text-center mt-32 tracking-widest text-red-400">Servicio no encontrado</div>;

  if (servicio.isGroup) {
    return (
      <ScrollReveal>
        <section className="max-w-5xl mx-auto mt-12 px-4 mb-32">
          <Link to="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-dark transition-colors border-b border-transparent hover:border-dark pb-1 mb-8 inline-block">
            ← Volver al Menú
          </Link>
          
          <div className="bg-[#f0efed] w-full h-64 md:h-96 flex items-center justify-center rounded-sm mb-12">
            <span className="text-gray-400 text-xs tracking-widest uppercase">[ FOTO PANORÁMICA PESTAÑAS ]</span>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-serif mb-6">{servicio.nombre}</h1>
            <p className="text-gray-500 leading-relaxed">{servicio.descripcion}</p>
          </div>

          <div className="border-b border-gray-200 mb-12 flex justify-start space-x-8 overflow-x-auto px-2 pb-2">
            {subServicios.map(sub => (
              <button 
                key={sub.id}
                onClick={() => setSubSeleccionado(sub)}
                className={`tracking-widest uppercase text-xs md:text-sm pb-4 border-b-2 transition-colors whitespace-nowrap ${
                  subSeleccionado?.id === sub.id ? 'border-dark text-dark font-medium' : 'border-transparent text-gray-400 hover:text-dark'
                }`}
              >
                {sub.nombre}
              </button>
            ))}
          </div>

          {subSeleccionado && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-12" key={subSeleccionado.id}>
              <div className="flex flex-col space-y-4">
                <div className="bg-[#e5e5e5] h-80 flex items-center justify-center rounded-sm">
                  <span className="text-gray-500 text-[10px] uppercase tracking-widest">[ FOTO DEL {subSeleccionado.nombre} ]</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-serif mb-4">{subSeleccionado.nombre}</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-2xl font-medium">${subSeleccionado.precio}</span>
                  <span className="text-xs text-dark bg-light px-3 py-1 rounded-sm tracking-widest">{subSeleccionado.duracion_minutos} MIN</span>
                </div>
                <p className="text-gray-500 leading-relaxed mb-8">{subSeleccionado.descripcion}</p>
                <Link to="/#agendar" className="bg-dark text-white py-5 text-center tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 shadow-sm w-full block">
                  {subSeleccionado.nombre.toLowerCase().includes('retiro') ? 'Agendar este Servicio' : 'Agendar este Set'}
                </Link>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <section className="max-w-4xl mx-auto mt-12 px-4 mb-32">
        <Link to="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-dark transition-colors border-b border-transparent hover:border-dark pb-1 mb-8 inline-block">
          ← Volver al Menú
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
          <div className="flex flex-col space-y-4">
            <div className="bg-[#f0efed] h-96 flex items-center justify-center rounded-sm">
              <span className="text-gray-400 text-xs tracking-widest uppercase">[ Foto Principal ]</span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-serif mb-4">{servicio.nombre}</h1>
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-2xl font-medium">${servicio.precio}</span>
              <span className="text-xs text-dark bg-light px-3 py-1 rounded-sm tracking-widest">{servicio.duracion_minutos} MIN</span>
            </div>
            
            <p className="text-gray-500 leading-relaxed mb-10">{servicio.descripcion}</p>

            <Link to="/#agendar" className="bg-dark text-white py-5 text-center tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 shadow-sm w-full block">
              Agendar este servicio
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}