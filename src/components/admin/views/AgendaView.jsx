import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function AgendaView() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchCitas = async () => {
    setCargando(true);
    // Extraemos la cita y también el nombre y duración del servicio relacionado
    const { data } = await supabase
      .from('citas')
      .select(`
        *,
        servicios ( nombre, duracion_minutos, anticipo )
      `)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
      
    if (data) setCitas(data);
    setCargando(false);
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const cancelarCita = async (id) => {
    if(window.confirm('¿Estás segura de que deseas cancelar esta cita? Esta acción liberará el horario en el calendario público.')) {
      await supabase.from('citas').update({ estado: 'cancelada' }).eq('id', id);
      fetchCitas();
    }
  };

  if (cargando) return <div className="animate-pulse tracking-widest text-gray-400 text-xs p-12 text-center">Cargando agenda...</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-serif">Agenda y Calendario</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {citas.filter(c => c.estado !== 'cancelada').length === 0 ? (
          <div className="p-12 text-center text-gray-400 tracking-widest uppercase text-xs">
            No hay citas programadas actualmente.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] tracking-widest uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Fecha y Hora</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {citas.filter(c => c.estado !== 'cancelada').map(cita => (
                <tr key={cita.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-dark">{cita.fecha}</p>
                    <p className="text-xs text-gray-500">{cita.hora}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{cita.nombre_cliente}</p>
                    <a href={`https://wa.me/${cita.telefono_cliente.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-[10px] tracking-widest uppercase text-green-600 hover:text-green-800">
                      WhatsApp
                    </a>
                  </td>
                  <td className="p-4">
                    <p>{cita.servicios?.nombre}</p>
                    <p className="text-xs text-gray-500">{cita.servicios?.duracion_minutos} min</p>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] tracking-widest uppercase bg-yellow-100 text-yellow-700 px-2 py-1 rounded-sm">
                      {cita.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => cancelarCita(cita.id)} className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}