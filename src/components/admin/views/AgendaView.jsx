import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function AgendaView() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados del calendario
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  // Modal de Reagendar
  const [modalReagendar, setModalReagendar] = useState(false);
  const [citaActiva, setCitaActiva] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');

  const fetchCitas = async () => {
    setCargando(true);
    const y = mesActual.getFullYear();
    const m = String(mesActual.getMonth() + 1).padStart(2, '0');
    
    // Traemos las citas del mes visible en el calendario
    const { data } = await supabase
      .from('citas')
      .select('*, servicios(nombre, duracion_minutos)')
      .gte('fecha', `${y}-${m}-01`)
      .lte('fecha', `${y}-${m}-31`)
      .order('hora', { ascending: true });
      
    if (data) setCitas(data);
    setCargando(false);
  };

  useEffect(() => {
    fetchCitas();
  }, [mesActual]);

  const actualizarEstado = async (id, nuevoEstado) => {
    if(window.confirm(`¿Seguro que deseas marcar esta cita como ${nuevoEstado}?`)) {
      await supabase.from('citas').update({ estado: nuevoEstado }).eq('id', id);
      fetchCitas();
    }
  };

  const reagendarCita = async (e) => {
    e.preventDefault();
    await supabase.from('citas').update({ fecha: nuevaFecha, hora: nuevaHora }).eq('id', citaActiva.id);
    setModalReagendar(false);
    setFechaSeleccionada(nuevaFecha); // Saltar al nuevo día
    fetchCitas();
  };

  const abrirReagendar = (cita) => {
    setCitaActiva(cita);
    setNuevaFecha(cita.fecha);
    setNuevaHora(cita.hora);
    setModalReagendar(true);
  };

  // Lógica del calendario visual
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const primerDiaSemana = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();
  const diasArray = Array.from({ length: primerDiaSemana }, () => null).concat(Array.from({ length: diasEnMes }, (_, i) => i + 1));

  const citasDelDia = citas.filter(c => c.fecha === fechaSeleccionada && c.estado !== 'cancelada');

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-serif mb-8 border-b border-gray-200 pb-4">Agenda Interactiva</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Izquierdo: Calendario */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))} className="text-gray-400 hover:text-dark px-2">←</button>
            <span className="font-medium tracking-widest uppercase text-xs">{mesActual.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))} className="text-gray-400 hover:text-dark px-2">→</button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest text-gray-400 mb-2">
            <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {diasArray.map((dia, index) => {
              if (!dia) return <span key={`vacio-${index}`} className="py-2"></span>;
              
              const fechaBucle = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
              const esSeleccionado = fechaSeleccionada === fechaBucle;
              
              // Buscar si hay citas este día para ponerle un puntito
              const citasEsteDia = citas.filter(c => c.fecha === fechaBucle && c.estado !== 'cancelada').length;

              return (
                <button 
                  key={dia}
                  onClick={() => setFechaSeleccionada(fechaBucle)}
                  className={`py-2 rounded-full transition-all text-xs relative ${
                    esSeleccionado ? 'bg-dark text-white font-medium shadow-md' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {dia}
                  {citasEsteDia > 0 && (
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${esSeleccionado ? 'bg-white' : 'bg-green-500'}`}></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lado Derecho: Lista de Citas del Día */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 min-h-[400px]">
            <h3 className="text-sm tracking-widest uppercase text-gray-500 mb-6 border-b border-gray-100 pb-2">
              Citas para el: <span className="text-dark font-medium">{fechaSeleccionada}</span>
            </h3>

            {cargando ? (
              <p className="text-xs tracking-widest text-gray-400 animate-pulse">Cargando...</p>
            ) : citasDelDia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p className="text-xs tracking-widest uppercase">Día Libre</p>
                <p className="text-sm mt-2">No tienes citas agendadas para este día.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {citasDelDia.map(cita => (
                  <div key={cita.id} className={`p-4 border rounded-sm flex flex-col md:flex-row justify-between md:items-center ${cita.estado === 'concluida' ? 'bg-gray-50 border-gray-100 opacity-70' : 'border-gray-200 bg-white shadow-sm'}`}>
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-medium text-lg">{cita.hora}</span>
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm ${
                          cita.estado === 'concluida' ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>
                      <p className="font-serif text-lg">{cita.nombre_cliente}</p>
                      <p className="text-sm text-gray-500">{cita.servicios?.nombre} ({cita.servicios?.duracion_minutos} min)</p>
                      <a href={`https://wa.me/${cita.telefono_cliente.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-[10px] tracking-widest uppercase text-green-600 hover:text-green-800 mt-2 inline-block">
                        Contactar por WhatsApp
                      </a>
                    </div>

                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 text-right">
                      {cita.estado !== 'concluida' && (
                        <button onClick={() => actualizarEstado(cita.id, 'concluida')} className="text-[10px] tracking-widest uppercase bg-dark text-white px-3 py-1 rounded-sm hover:bg-gray-800">
                          Terminada
                        </button>
                      )}
                      <button onClick={() => abrirReagendar(cita)} className="text-[10px] tracking-widest uppercase border border-gray-200 px-3 py-1 rounded-sm hover:border-dark text-gray-600">
                        Reagendar
                      </button>
                      <button onClick={() => actualizarEstado(cita.id, 'cancelada')} className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Reagendar */}
      {modalReagendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-sm shadow-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-serif mb-4">Reagendar Cita</h2>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-6">{citaActiva.nombre_cliente}</p>
            
            <form onSubmit={reagendarCita} className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nueva Fecha</label>
                <input required type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nueva Hora</label>
                <select required value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark text-sm">
                  <option value="">Seleccionar hora...</option>
                  {['10:00 AM', '11:30 AM', '01:00 PM', '04:00 PM', '05:30 PM'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4 mt-6">
                <button type="button" onClick={() => setModalReagendar(false)} className="w-1/2 border border-gray-300 py-3 text-xs tracking-widest uppercase hover:bg-gray-50 text-gray-600">Cancelar</button>
                <button type="submit" className="w-1/2 bg-dark text-white py-3 text-xs tracking-widest uppercase hover:bg-gray-800">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}