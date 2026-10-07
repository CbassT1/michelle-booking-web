import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchServicio = async () => {
      // Buscamos el servicio exacto por su ID en la base de datos
      const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setServicio(data);
      setCargando(false);
    };
    
    fetchServicio();
    // Hacemos scroll hacia arriba al entrar a la página
    window.scrollTo(0, 0);
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 tracking-widest text-xs animate-pulse uppercase">Cargando detalles...</p>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Servicio no encontrado</h2>
        <Link to="/" className="text-xs tracking-widest uppercase border-b border-dark pb-1 hover:text-gray-500 transition-colors">
          Volver al menú principal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-in-up">
      
      {/* Botón de regreso */}
      <div className="mb-12">
        <button 
          onClick={() => navigate('/')} 
          className="text-xs tracking-widest uppercase text-gray-400 hover:text-dark transition-colors"
        >
          ← Volver al menú
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Columna Izquierda: Espacio para Foto */}
        <div className="bg-[#f0efed] aspect-square flex items-center justify-center rounded-sm">
          <span className="text-gray-400 text-xs tracking-widest uppercase">[ Foto Principal ]</span>
        </div>

        {/* Columna Derecha: Información y Botón */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">{servicio.nombre}</h1>
          
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-xl font-medium">${servicio.precio}</span>
            <span className="text-xs tracking-widest uppercase text-gray-400">{servicio.duracion_minutos} min</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-10 text-sm whitespace-pre-wrap">
            {servicio.descripcion}
          </p>

          {/* Botón Inteligente: Redirige al Home activando la pestaña agendar y pasando el ID del servicio */}
          <button 
            onClick={() => navigate('/#agendar', { state: { servicioIdPredeterminado: id } })}
            className="bg-dark text-white w-full py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 shadow-sm"
          >
            Agendar este servicio
          </button>
        </div>
        
      </div>
    </div>
  );
}