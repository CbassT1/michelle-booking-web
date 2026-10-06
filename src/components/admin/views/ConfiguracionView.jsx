import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function ConfiguracionView() {
  // Ya no traemos texto_cursos al estado local
  const [config, setConfig] = useState({
    id: 1, biografia: '', direccion: '', maps_url: '', telefono: '', instagram_url: '', facebook_url: ''
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('textos');

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracion').select('id, biografia, direccion, maps_url, telefono, instagram_url, facebook_url').eq('id', 1).single();
      if (data) setConfig(data);
      setCargando(false);
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    const { error } = await supabase.from('configuracion').update(config).eq('id', config.id);
    
    if (!error) {
      setMensaje('Configuración guardada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } else {
      setMensaje('Error al guardar. Intenta de nuevo.');
    }
    setGuardando(false);
  };

  if (cargando) return <div className="animate-pulse tracking-widest text-gray-400 text-xs">Cargando configuración...</div>;

  return (
    <div className="animate-fade-in-up max-w-4xl">
      <h1 className="text-3xl font-serif mb-8 border-b border-gray-200 pb-4">Configuración del Sitio</h1>
      
      {mensaje && (
        <div className={`p-4 mb-6 text-sm tracking-widest border rounded-sm ${mensaje.includes('Error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
          {mensaje}
        </div>
      )}

      <div className="border-b border-gray-200 mb-8 flex justify-start space-x-8 overflow-x-auto px-2">
        <button onClick={() => setPestanaActiva('textos')} className={`tracking-widest uppercase text-xs pb-4 border-b-2 transition-colors whitespace-nowrap ${pestanaActiva === 'textos' ? 'border-dark text-dark font-medium' : 'border-transparent text-gray-400 hover:text-dark'}`}>Biografía</button>
        <button onClick={() => setPestanaActiva('contacto')} className={`tracking-widest uppercase text-xs pb-4 border-b-2 transition-colors whitespace-nowrap ${pestanaActiva === 'contacto' ? 'border-dark text-dark font-medium' : 'border-transparent text-gray-400 hover:text-dark'}`}>Contacto y Ubicación</button>
        <button onClick={() => setPestanaActiva('redes')} className={`tracking-widest uppercase text-xs pb-4 border-b-2 transition-colors whitespace-nowrap ${pestanaActiva === 'redes' ? 'border-dark text-dark font-medium' : 'border-transparent text-gray-400 hover:text-dark'}`}>Redes Sociales</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {pestanaActiva === 'textos' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Biografía (Sobre Mí)</label>
                <textarea rows="6" value={config.biografia} onChange={e => setConfig({...config, biografia: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark"></textarea>
              </div>
            </div>
          )}

          {pestanaActiva === 'contacto' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Dirección Física</label>
                <input type="text" value={config.direccion} onChange={e => setConfig({...config, direccion: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Link de Google Maps</label>
                <input type="text" value={config.maps_url} onChange={e => setConfig({...config, maps_url: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">WhatsApp (Número con código)</label>
                <input type="text" value={config.telefono} onChange={e => setConfig({...config, telefono: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" placeholder="Ej. +52 81 1420 9836" />
              </div>
            </div>
          )}

          {pestanaActiva === 'redes' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Link de Instagram</label>
                <input type="text" value={config.instagram_url} onChange={e => setConfig({...config, instagram_url: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Link de Facebook</label>
                <input type="text" value={config.facebook_url} onChange={e => setConfig({...config, facebook_url: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <button disabled={guardando} className="w-full bg-dark text-white py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 disabled:opacity-50 shadow-sm">
              {guardando ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}