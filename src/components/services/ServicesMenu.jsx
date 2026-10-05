import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ServicesMenu() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/services');
        if (!respuesta.ok) throw new Error('Error al cargar los servicios');
        
        const data = await respuesta.json();
        // Limpiamos "1x1" de los nombres que vengan de la base de datos
        const dataLimpia = data.map(s => ({
          ...s,
          nombre: s.nombre.replace(/ 1x1/gi, '')
        }));
        setServicios(dataLimpia);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerServicios();
  }, []);

  if (cargando) return <p className="text-center text-gray-500 tracking-widest animate-pulse mt-20">Cargando catálogo...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  // --- FILTROS INTELIGENTES ---
  const microNombres = ["punteado", "liner", "strokes", "powder", "híbridas", "remoción", "blush", "neutralización"];
  const micropigmentacion = servicios.filter(s => microNombres.some(n => s.nombre.toLowerCase().includes(n)));
  const semiTemporales = servicios.filter(s => !microNombres.some(n => s.nombre.toLowerCase().includes(n)));

  const extensionesNombres = ["set", "retiro"];
  const extensiones = semiTemporales.filter(s => extensionesNombres.some(n => s.nombre.toLowerCase().includes(n)));
  const otrosSemi = semiTemporales.filter(s => !extensionesNombres.some(n => s.nombre.toLowerCase().includes(n)));

  // Mocks para Recomendados y Promociones
  const recomendados = servicios.filter(s => s.nombre.toLowerCase().includes('laminado') || s.nombre.toLowerCase().includes('blush'));
  const promociones = servicios.filter(s => s.nombre.toLowerCase().includes('lifting')); // Ejemplo de promo

  // Tarjeta virtual agrupadora
  const tarjetaExtensiones = {
    id: 'extensiones-agrupadas',
    nombre: 'Extensiones de pestañas',
    descripcion: 'Diseños personalizados para realzar tu mirada. Selecciona para ver Foxy, Anime, Tradicional, Sirena, Rimel y Retiro.',
    precio: 'Varios',
    duracion_minutos: '120+'
  };

  const semiTemporalesAgrupados = [...otrosSemi, tarjetaExtensiones];

  // Configuración de la vista activa
  let serviciosAMostrar = [];
  let tituloSeccion = "";

  if (categoriaSeleccionada === 'semi') {
    serviciosAMostrar = semiTemporalesAgrupados;
    tituloSeccion = 'Servicios Semi Temporales';
  } else if (categoriaSeleccionada === 'micro') {
    serviciosAMostrar = micropigmentacion;
    tituloSeccion = 'Micropigmentación';
  } else if (categoriaSeleccionada === 'recomendados') {
    serviciosAMostrar = recomendados;
    tituloSeccion = 'Selección de la Artista';
  } else if (categoriaSeleccionada === 'promociones') {
    serviciosAMostrar = promociones;
    tituloSeccion = 'Promociones del Mes';
  }

  return (
    <section className="max-w-5xl mx-auto mt-20 px-4 mb-24 min-h-[600px]">
      
      {!categoriaSeleccionada ? (
        <div className="animate-fade-in-up" key="categorias">
          <h2 className="text-2xl tracking-widest uppercase mb-10 border-b border-gray-300 pb-4 text-center">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div onClick={() => setCategoriaSeleccionada('recomendados')} className="group cursor-pointer bg-white border border-gray-200 p-0 text-center rounded-sm hover-glow overflow-hidden flex flex-col">
              <div className="bg-[#f0efed] h-40 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"><span className="text-gray-400 text-xs tracking-widest uppercase">[ FOTO RECOMENDADOS ]</span></div>
              <div className="p-8 bg-white relative z-10"><h3 className="text-xl font-serif mb-2">Recomendados</h3><p className="text-gray-400 text-xs tracking-widest uppercase">Los favoritos del estudio</p></div>
            </div>

            <div onClick={() => setCategoriaSeleccionada('promociones')} className="group cursor-pointer bg-white border border-gray-200 p-0 text-center rounded-sm hover-glow overflow-hidden flex flex-col">
              <div className="bg-[#f0efed] h-40 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"><span className="text-gray-400 text-xs tracking-widest uppercase">[ FOTO PROMOCIONES ]</span></div>
              <div className="p-8 bg-white relative z-10"><h3 className="text-xl font-serif mb-2 text-red-800">Promociones</h3><p className="text-gray-400 text-xs tracking-widest uppercase">Ofertas por tiempo limitado</p></div>
            </div>

            <div onClick={() => setCategoriaSeleccionada('semi')} className="group cursor-pointer bg-white border border-gray-200 p-0 text-center rounded-sm hover-glow overflow-hidden flex flex-col">
              <div className="bg-[#f0efed] h-40 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"><span className="text-gray-400 text-xs tracking-widest uppercase">[ FOTO SEMI ]</span></div>
              <div className="p-8 bg-white relative z-10"><h3 className="text-xl font-serif mb-2">Semi Temporales</h3><p className="text-gray-400 text-xs tracking-widest uppercase">Cejas y Pestañas</p></div>
            </div>

            <div onClick={() => setCategoriaSeleccionada('micro')} className="group cursor-pointer bg-white border border-gray-200 p-0 text-center rounded-sm hover-glow overflow-hidden flex flex-col">
              <div className="bg-[#f0efed] h-40 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"><span className="text-gray-400 text-xs tracking-widest uppercase">[ FOTO MICRO ]</span></div>
              <div className="p-8 bg-white relative z-10"><h3 className="text-xl font-serif mb-2">Micropigmentación</h3><p className="text-gray-400 text-xs tracking-widest uppercase">Ojos, Cejas y Labios</p></div>
            </div>

          </div>
        </div>
      ) : (
        <div className="animate-fade-in-up" key={`lista-${categoriaSeleccionada}`}>
          
          <div className="flex flex-col items-center mb-12">
            <button onClick={() => setCategoriaSeleccionada(null)} className="mb-8 text-xs tracking-widest uppercase text-gray-400 hover:text-dark transition-colors border-b border-transparent hover:border-dark pb-1">
              ← Volver a categorías
            </button>
            <h2 className="text-2xl tracking-widest uppercase border-b border-gray-300 pb-4 text-center w-full max-w-3xl">
              {tituloSeccion}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviciosAMostrar.map((servicio) => (
              <Link 
                to={`/servicio/${servicio.id}`}
                key={servicio.id} 
                className="hover-glow bg-white border border-gray-200 flex flex-col rounded-sm cursor-pointer overflow-hidden group"
              >
                {/* Nueva área de Preview de Imagen */}
                <div className="bg-[#f0efed] h-48 w-full flex items-center justify-center border-b border-gray-100 transition-transform duration-500 group-hover:scale-105">
                  <span className="text-gray-400 text-[10px] tracking-widest uppercase px-4 text-center">[ Preview {servicio.nombre} ]</span>
                </div>
                
                <div className="p-6 flex flex-col justify-between flex-grow bg-white relative z-10">
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-3">{servicio.nombre}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{servicio.descripcion}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-xl font-medium">
                      {servicio.precio === 'Varios' ? '' : '$'}{servicio.precio}
                    </span>
                    <span className="text-xs text-dark bg-light px-3 py-1 rounded-sm tracking-widest">
                      {servicio.duracion_minutos} MIN
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}