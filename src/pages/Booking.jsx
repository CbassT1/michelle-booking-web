import { useState } from 'react';

export default function Booking() {
  const [paso, setPaso] = useState(1);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const horarios = ['10:00 AM', '11:30 AM', '01:00 PM', '04:00 PM', '05:30 PM'];

  // Lógica dinámica del calendario
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  // Calcular días del mes y espacios vacíos para alinear con los días de la semana
  const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();
  const primerDiaSemana = new Date(añoActual, mesActual, 1).getDay();

  // Crear arreglo del calendario: [null, null, null, null, 1, 2, 3...]
  const diasCalendario = Array.from({ length: primerDiaSemana }, () => null).concat(
    Array.from({ length: diasEnMes }, (_, i) => i + 1)
  );

  // Formatear el mes en texto
  const nombreMes = hoy.toLocaleDateString('es-MX', { 
    month: 'long', year: 'numeric', timeZone: 'America/Monterrey' 
  });

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      
      <div className="flex border-b border-gray-100 bg-gray-50 text-xs tracking-widest uppercase">
        <div className={`flex-1 text-center py-4 transition-colors ${paso >= 1 ? 'text-dark font-medium border-b-2 border-dark' : 'text-gray-400'}`}>1. Servicio</div>
        <div className={`flex-1 text-center py-4 transition-colors ${paso >= 2 ? 'text-dark font-medium border-b-2 border-dark' : 'text-gray-400'}`}>2. Fecha y Hora</div>
        <div className={`flex-1 text-center py-4 transition-colors ${paso >= 3 ? 'text-dark font-medium border-b-2 border-dark' : 'text-gray-400'}`}>3. Datos</div>
      </div>

      <div className="p-8 md:p-12 min-h-[450px] flex flex-col justify-center">
        
        {paso === 1 && (
          <div className="animate-fade-in-up text-center">
            <h3 className="text-xl font-serif mb-6">Selecciona el servicio a agendar</h3>
            <p className="text-gray-500 text-sm mb-10">Elige el tratamiento para ver la disponibilidad en la agenda.</p>
            <button 
              onClick={() => setPaso(2)}
              className="border border-gray-300 hover:border-dark px-6 py-5 rounded-sm w-full md:w-2/3 mx-auto flex justify-between items-center transition-colors hover-glow bg-white"
            >
              <span className="font-medium text-lg">Laminado de Cejas</span>
              <span className="text-gray-400 text-sm tracking-widest">60 MIN</span>
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-serif mb-6 text-center md:text-left border-b border-gray-100 pb-3">1. Elige un día</h3>
              
              <div className="border border-gray-200 p-6 rounded-sm bg-white">
                <div className="flex justify-between items-center mb-6">
                  <button className="text-gray-300 cursor-not-allowed">←</button>
                  <span className="font-medium tracking-widest uppercase text-sm">{nombreMes}</span>
                  <button className="text-gray-400 hover:text-dark transition-colors">→</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs tracking-widest text-gray-400 mb-4">
                  <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span>
                </div>
                
                {/* Cuadrícula dinámica del calendario mapeando correctamente los null */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {diasCalendario.map((dia, index) => {
                    // Si el día es null, renderizamos un espacio vacío
                    if (!dia) return <span key={`vacio-${index}`} className="py-2"></span>;

                    const esPasado = dia < diaActual;
                    const estaSeleccionado = fechaSeleccionada === dia;
                    
                    return (
                      <button 
                        key={dia}
                        disabled={esPasado}
                        onClick={() => setFechaSeleccionada(dia)}
                        className={`py-2 rounded-full transition-all ${
                          esPasado 
                            ? 'text-gray-300 opacity-50 cursor-not-allowed bg-gray-50 line-through' 
                            : estaSeleccionado 
                              ? 'bg-dark text-white font-medium shadow-md' 
                              : 'hover:bg-gray-100 text-gray-700 cursor-pointer'
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
              <h3 className="text-lg font-serif mb-6 text-center md:text-left border-b border-gray-100 pb-3">2. Elige una hora</h3>
              {fechaSeleccionada ? (
                <div className="space-y-3 animate-fade-in-up">
                  {horarios.map(hora => (
                    <button
                      key={hora}
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`w-full py-4 border rounded-sm transition-all tracking-widest text-sm ${
                        horaSeleccionada === hora 
                          ? 'border-dark bg-dark text-white shadow-md' 
                          : 'border-gray-200 hover:border-dark text-gray-600 bg-white'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-sm">
                  <p className="text-gray-400 text-sm tracking-widest uppercase text-center px-6">
                    Selecciona un día para ver los horarios
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="animate-fade-in-up max-w-md mx-auto w-full">
            <h3 className="text-xl font-serif mb-8 text-center border-b border-gray-100 pb-4">Tus Datos</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nombre completo</label>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark transition-colors bg-white" placeholder="Ej. Ana Pérez" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Teléfono (WhatsApp)</label>
                <input type="tel" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark transition-colors bg-white" placeholder="10 dígitos" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Correo electrónico</label>
                <input type="email" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-dark transition-colors bg-white" placeholder="correo@ejemplo.com" />
              </div>
              <button className="w-full bg-dark text-white py-5 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 mt-4 shadow-sm hover:shadow-md">
                Proceder al Pago
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 flex justify-between border-t border-gray-200">
        {paso > 1 ? (
          <button onClick={() => setPaso(paso - 1)} className="text-xs tracking-widest uppercase text-gray-500 hover:text-dark transition-colors">← Regresar</button>
        ) : <div></div>}
        
        {paso < 3 && (
          <button 
            onClick={() => setPaso(paso + 1)} 
            disabled={(paso === 2 && (!fechaSeleccionada || !horaSeleccionada))}
            className={`text-xs tracking-widest uppercase px-8 py-3 rounded-sm transition-all ${
              (paso === 2 && (!fechaSeleccionada || !horaSeleccionada)) 
                ? 'text-gray-400 border border-gray-200 cursor-not-allowed' 
                : 'bg-dark text-white hover:bg-gray-700 shadow-sm hover:shadow-md'
            }`}
          >
            Continuar →
          </button>
        )}
      </div>
    </div>
  );
}