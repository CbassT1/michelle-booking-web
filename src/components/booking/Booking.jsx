import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function Booking() {
  const location = useLocation();
  const [paso, setPaso] = useState(1);
  
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cliente, setCliente] = useState({ nombre: '', telefono: '' });
  const [procesando, setProcesando] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  const [mesActual, setMesActual] = useState(new Date());
  const horariosBase = ['10:00 AM', '11:30 AM', '01:00 PM', '04:00 PM', '05:30 PM'];

  useEffect(() => {
    const fetchServicios = async () => {
      const { data } = await supabase.from('servicios').select('*').order('id');
      if (data) {
        const serviciosLimpios = data.map(s => ({
          ...s,
          nombre: s.nombre.replace(/\s*\(.*?\)\s*/g, '').trim()
        }));
        setServicios(serviciosLimpios);

        if (location.state?.servicioIdPredeterminado) {
          setServicioId(location.state.servicioIdPredeterminado);
          setPaso(2);
          window.history.replaceState({}, document.title); 
        }
      }
      setCargando(false);
    };
    fetchServicios();
  }, [location.state]);

  useEffect(() => {
    const fetchHorasOcupadas = async () => {
      if (!fecha) return;
      const { data } = await supabase.from('citas').select('hora').eq('fecha', fecha).neq('estado', 'cancelada');
      if (data) setHorasOcupadas(data.map(cita => cita.hora));
    };
    fetchHorasOcupadas();
    setHora(''); 
  }, [fecha]);

  const validarDisponibilidadHora = (horaString) => {
    if (!fecha) return false;
    if (horasOcupadas.includes(horaString)) return false;

    const ahora = new Date();
    const [year, month, day] = fecha.split('-');
    const [time, period] = horaString.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const fechaCita = new Date(year, parseInt(month) - 1, day, hours, parseInt(minutes));
    const margen3Horas = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);

    return fechaCita > margen3Horas;
  };

  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const primerDiaSemana = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1).getDay();
  const diasArray = Array.from({ length: primerDiaSemana }, () => null).concat(Array.from({ length: diasEnMes }, (_, i) => i + 1));

  const cambiarMes = (incremento) => {
    const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + incremento, 1);
    const hoy = new Date();
    if (nuevoMes.getFullYear() < hoy.getFullYear() || (nuevoMes.getFullYear() === hoy.getFullYear() && nuevoMes.getMonth() < hoy.getMonth())) return;
    setMesActual(nuevoMes);
  };

  const seleccionarDia = (dia) => {
    const y = mesActual.getFullYear();
    const m = String(mesActual.getMonth() + 1).padStart(2, '0');
    const d = String(dia).padStart(2, '0');
    setFecha(`${y}-${m}-${d}`);
  };

  const servicioSeleccionado = servicios.find(s => String(s.id) === String(servicioId));

  const confirmarReserva = async (e) => {
    e.preventDefault();
    setProcesando(true);
    const nuevaCita = {
      servicio_id: servicioId,
      nombre_cliente: cliente.nombre,
      telefono_cliente: cliente.telefono,
      fecha: fecha,
      hora: hora,
      estado: 'pendiente'
    };
    const { error } = await supabase.from('citas').insert([nuevaCita]);
    if (!error) setReservaExitosa(true);
    else alert("Hubo un error al reservar. Intenta de nuevo.");
    setProcesando(false);
  };

  const categorias = [
    { titulo: 'Extensiones de Pestañas', keywords: ['set', 'híbridas', 'retiro'], items: [] },
    { titulo: 'Micropigmentación', keywords: ['blush', 'brows', 'strokes', 'neutralización', 'liner', 'punteado', 'remoción', 'química'], items: [] },
    { titulo: 'Cejas y Pestañas Naturales', keywords: ['lifting', 'laminado', 'diseño', 'depilación'], items: [] },
    { titulo: 'Otros Servicios', keywords: [], items: [] }
  ];

  servicios.forEach(s => {
    const nombre = s.nombre.toLowerCase();
    let asignado = false;
    for (let i = 0; i < 3; i++) {
      if (categorias[i].keywords.some(kw => nombre.includes(kw))) {
        categorias[i].items.push(s);
        asignado = true;
        break;
      }
    }
    if (!asignado) categorias[3].items.push(s);
  });
  
  const categoriasActivas = categorias.filter(c => c.items.length > 0);

  if (cargando) return <div className="text-center text-gray-400 tracking-widest text-xs animate-pulse py-20">Cargando sistema de reservas...</div>;

  if (reservaExitosa) {
    return (
      <div className="bg-white border border-gray-200 p-12 text-center rounded-sm shadow-sm animate-fade-in-up">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
        <h3 className="text-2xl font-serif mb-4">¡Lugar Apartado Temporalmente!</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Hemos reservado tu espacio para el <strong>{fecha}</strong> a las <strong>{hora}</strong>.
        </p>
        <button onClick={() => window.location.reload()} className="text-xs tracking-widest uppercase border-b border-dark pb-1 hover:text-gray-500 transition-colors">
          Hacer otra prueba
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      <div className="bg-[#faf9f8] w-full md:w-1/3 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
        <h3 className="tracking-widest uppercase text-xs text-gray-400 mb-8">Resumen de Cita</h3>
        {servicioSeleccionado ? (
          <div className="animate-fade-in">
            <p className="font-serif text-xl mb-2">{servicioSeleccionado.nombre}</p>
            <p className="text-gray-500 text-sm mb-6">{servicioSeleccionado.duracion_minutos} minutos</p>
            
            {fecha && hora && (
              <div className="mb-6 bg-white border border-gray-200 p-4 rounded-sm">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-1">Día y Hora</p>
                <p className="font-medium text-sm">{fecha} <span className="text-gray-400 mx-2">|</span> {hora}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Costo total</span>
                <span className="font-medium">${servicioSeleccionado.precio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Anticipo requerido</span>
                <span className="font-medium">${servicioSeleccionado.anticipo || 0}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">Selecciona un servicio para ver los detalles.</p>
        )}
      </div>

      <div className="w-full md:w-2/3 p-8 md:p-10 flex flex-col">
        
        <div className="flex items-center space-x-2 md:space-x-4 mb-10 text-[10px] md:text-xs tracking-widest uppercase">
          <span className={paso >= 1 ? 'text-dark font-medium' : 'text-gray-300'}>1. Servicio</span>
          <span className="text-gray-300">/</span>
          <span className={paso >= 2 ? 'text-dark font-medium' : 'text-gray-300'}>2. Fecha y Hora</span>
          <span className="text-gray-300">/</span>
          <span className={paso >= 3 ? 'text-dark font-medium' : 'text-gray-300'}>3. Tus Datos</span>
        </div>

        <div className="flex-grow">
          {paso === 1 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h4 className="font-serif text-xl mb-2">¿Qué servicio deseas agendar?</h4>
                <p className="text-gray-500 text-xs tracking-widest uppercase">Selecciona una opción</p>
              </div>
              
              {categoriasActivas.map((categoria, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <h5 className="text-[10px] tracking-widest uppercase text-gray-400 mb-4 border-b border-gray-100 pb-2">
                    {categoria.titulo}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categoria.items.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setServicioId(s.id); setPaso(2); }}
                        className={`text-left p-4 border rounded-sm transition-all hover:border-dark flex justify-between items-center ${servicioId === s.id ? 'border-dark bg-gray-50 shadow-sm' : 'border-gray-200'}`}
                      >
                        <span className="font-medium text-sm">{s.nombre}</span>
                        <span className="text-[10px] text-gray-500 tracking-widest uppercase">${s.precio}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {paso === 2 && (
            <div className="animate-fade-in flex flex-col h-full">
              <h4 className="font-serif text-xl mb-6">Selecciona el día y la hora</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                
                <div>
                <div className="border border-gray-200 p-4 rounded-sm">
                    <div className="flex justify-between items-center mb-4">
                    <button onClick={() => cambiarMes(-1)} className="text-gray-400 hover:text-dark px-2">←</button>
                    <span className="font-medium tracking-widest uppercase text-[10px]">{mesActual.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => cambiarMes(1)} className="text-gray-400 hover:text-dark px-2">→</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest text-gray-400 mb-2">
                    <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {diasArray.map((dia, index) => {
                        if (!dia) return <span key={`vacio-${index}`} className="py-2"></span>;
                        
                        const fechaEvaluada = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
                        const hoy = new Date();
                        hoy.setHours(0,0,0,0);

                        const esPasado = fechaEvaluada < hoy;
                        const diaSemana = fechaEvaluada.getDay();
                        const esDescanso = diaSemana === 0 || diaSemana === 1;
                        const deshabilitado = esPasado || esDescanso;
                        
                        const fechaFormateada = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                        const esSeleccionado = fecha === fechaFormateada;

                        return (
                        <button 
                            key={dia}
                            disabled={deshabilitado}
                            onClick={() => seleccionarDia(dia)}
                            title={esDescanso ? "Día de descanso" : ""}
                            className={`py-2 rounded-full transition-all text-xs ${
                            esDescanso ? 'text-red-300 opacity-50 cursor-not-allowed line-through bg-red-50'
                            : esPasado ? 'text-gray-300 opacity-30 cursor-not-allowed line-through' 
                            : esSeleccionado ? 'bg-dark text-white font-medium shadow-md' 
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            {dia}
                        </button>
                        )
                    })}
                    </div>
                </div>
                </div>               
                
                <div>
                  {!fecha ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-sm p-4">
                      <p className="text-xs text-gray-400 tracking-widest uppercase text-center">Elige un día en el calendario</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {horariosBase.map((h) => {
                        const estaDisponible = validarDisponibilidadHora(h);
                        return (
                          <button
                            key={h}
                            disabled={!estaDisponible}
                            onClick={() => setHora(h)}
                            className={`py-3 px-4 text-xs tracking-widest uppercase border rounded-sm transition-all text-center ${
                              !estaDisponible ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' 
                              : hora === h ? 'bg-dark text-white border-dark shadow-md' 
                              : 'border-gray-200 hover:border-dark text-gray-600 bg-white'
                            }`}
                          >
                            {h} {!estaDisponible && <span className="lowercase text-[9px] ml-2">(Ocupado)</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button onClick={() => setPaso(1)} className="text-xs tracking-widest uppercase text-gray-500 hover:text-dark">← Volver</button>
                <button disabled={!fecha || !hora} onClick={() => setPaso(3)} className="bg-dark text-white px-8 py-3 text-xs tracking-widest uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <form onSubmit={confirmarReserva} className="animate-fade-in flex flex-col h-full">
              <h4 className="font-serif text-xl mb-6">Tus datos de contacto</h4>
              <div className="space-y-6 flex-grow">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nombre Completo</label>
                  <input type="text" required value={cliente.nombre} onChange={(e) => setCliente({...cliente, nombre: e.target.value})} className="w-full border border-gray-300 p-4 rounded-sm focus:outline-none focus:border-dark" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Teléfono / WhatsApp</label>
                  <input type="tel" required value={cliente.telefono} onChange={(e) => setCliente({...cliente, telefono: e.target.value})} className="w-full border border-gray-300 p-4 rounded-sm focus:outline-none focus:border-dark" />
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setPaso(2)} className="text-xs tracking-widest uppercase text-gray-500 hover:text-dark">← Volver</button>
                <button type="submit" disabled={procesando} className="bg-dark text-white px-8 py-3 text-xs tracking-widest uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors shadow-sm">
                  {procesando ? 'Procesando...' : 'Confirmar Datos'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}