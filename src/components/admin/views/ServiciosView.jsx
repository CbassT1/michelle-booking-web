import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function ServiciosView() {
  const [listaServicios, setListaServicios] = useState([]);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formServicio, setFormServicio] = useState({
    id: null, nombre: '', descripcion: '', precio: '', anticipo: '', duracion_minutos: '', es_recomendado: false, en_promocion: false
  });

  const fetchServicios = async () => {
    setCargandoServicios(true);
    const { data } = await supabase.from('servicios').select('*').order('id');
    if (data) setListaServicios(data);
    setCargandoServicios(false);
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const abrirModalNuevo = () => {
    setFormServicio({ id: null, nombre: '', descripcion: '', precio: '', anticipo: '', duracion_minutos: '', es_recomendado: false, en_promocion: false });
    setModalAbierto(true);
  };

  const abrirModalEditar = (servicio) => {
    setFormServicio(servicio);
    setModalAbierto(true);
  };

  const guardarServicio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const datosGuardar = { ...formServicio };
    delete datosGuardar.id;

    if (formServicio.id) await supabase.from('servicios').update(datosGuardar).eq('id', formServicio.id);
    else await supabase.from('servicios').insert([datosGuardar]);
    
    await fetchServicios();
    setModalAbierto(false);
    setGuardando(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-serif">Gestión de Servicios</h1>
        <button onClick={abrirModalNuevo} className="bg-dark text-white px-6 py-2 text-xs tracking-widest uppercase rounded-sm hover:bg-gray-700 transition-colors">
          + Nuevo Servicio
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {cargandoServicios ? (
          <div className="p-12 text-center text-gray-400 tracking-widest uppercase text-xs animate-pulse">Sincronizando con base de datos...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs tracking-widest uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium">Anticipo</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listaServicios.map(servicio => (
                <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{servicio.nombre}</p>
                    <div className="flex space-x-2 mt-1">
                      {servicio.es_recomendado && <span className="text-[10px] tracking-widest uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">Recomendado</span>}
                      {servicio.en_promocion && <span className="text-[10px] tracking-widest uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-sm">Promo</span>}
                    </div>
                  </td>
                  <td className="p-4">${servicio.precio}</td>
                  <td className="p-4">${servicio.anticipo || 0}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => abrirModalEditar(servicio)} className="text-xs tracking-widest uppercase text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-sm shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-serif">{formServicio.id ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-dark text-xl">&times;</button>
            </div>
            <form onSubmit={guardarServicio} className="p-6 space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nombre del Servicio</label>
                <input required type="text" value={formServicio.nombre} onChange={e => setFormServicio({...formServicio, nombre: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Descripción</label>
                <textarea required rows="3" value={formServicio.descripcion} onChange={e => setFormServicio({...formServicio, descripcion: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Precio Total</label>
                  <input required type="number" value={formServicio.precio} onChange={e => setFormServicio({...formServicio, precio: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Anticipo</label>
                  <input required type="number" value={formServicio.anticipo} onChange={e => setFormServicio({...formServicio, anticipo: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Minutos</label>
                  <input required type="number" value={formServicio.duracion_minutos} onChange={e => setFormServicio({...formServicio, duracion_minutos: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
                </div>
              </div>
              <div className="flex space-x-6 pt-4 border-t border-gray-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formServicio.es_recomendado} onChange={e => setFormServicio({...formServicio, es_recomendado: e.target.checked})} className="accent-dark" />
                  <span className="text-sm">Destacar como Recomendado</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formServicio.en_promocion} onChange={e => setFormServicio({...formServicio, en_promocion: e.target.checked})} className="accent-dark" />
                  <span className="text-sm">Marcar en Promoción</span>
                </label>
              </div>
              <button disabled={guardando} className="w-full bg-dark text-white py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 mt-6 disabled:opacity-50">
                {guardando ? 'Guardando...' : 'Guardar Servicio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}