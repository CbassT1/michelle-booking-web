import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function CursosView() {
  const [textoCursos, setTextoCursos] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      const { data } = await supabase.from('configuracion').select('texto_cursos').eq('id', 1).single();
      if (data) setTextoCursos(data.texto_cursos || '');
      setCargando(false);
    };
    fetchCursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    const { error } = await supabase.from('configuracion').update({ texto_cursos: textoCursos }).eq('id', 1);
    
    if (!error) {
      setMensaje('Información de cursos actualizada.');
      setTimeout(() => setMensaje(null), 3000);
    } else {
      setMensaje('Error al guardar. Intenta de nuevo.');
    }
    setGuardando(false);
  };

  if (cargando) return <div className="animate-pulse tracking-widest text-gray-400 text-xs">Cargando módulo de cursos...</div>;

  return (
    <div className="animate-fade-in-up max-w-4xl">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-serif">Gestión de Cursos</h1>
        <button className="bg-gray-200 text-gray-400 cursor-not-allowed px-6 py-2 text-xs tracking-widest uppercase rounded-sm transition-colors">
          + Nuevo Curso (Próximamente)
        </button>
      </div>
      
      {mensaje && (
        <div className={`p-4 mb-6 text-sm tracking-widest border rounded-sm ${mensaje.includes('Error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
          {mensaje}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Descripción General de la Academia</label>
            <p className="text-xs text-gray-400 mb-4">Este texto aparece en la sección "Cursos" de tu página principal.</p>
            <textarea 
              rows="4" 
              value={textoCursos} 
              onChange={e => setTextoCursos(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark"
              placeholder="Ej. Aprende las mejores técnicas de diseño de miradas..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button disabled={guardando} className="bg-dark text-white px-8 py-3 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 disabled:opacity-50 shadow-sm">
              {guardando ? 'Guardando...' : 'Guardar Información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}