import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';

export default function ResumenView() {
  const [estadisticas, setEstadisticas] = useState({
    citasPendientes: 0,
    ingresosMes: 0,
    citasConcluidas: 0,
    totalCitasMes: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      const hoy = new Date();
      const mesActual = String(hoy.getMonth() + 1).padStart(2, '0');
      const anoActual = hoy.getFullYear();

      // Traer citas de este mes (que no estén canceladas)
      const { data } = await supabase
        .from('citas')
        .select('*, servicios(anticipo)')
        .gte('fecha', `${anoActual}-${mesActual}-01`)
        .lte('fecha', `${anoActual}-${mesActual}-31`)
        .neq('estado', 'cancelada');

      if (data) {
        let ingresos = 0;
        let concluidas = 0;
        let pendientes = 0;

        data.forEach(cita => {
          ingresos += Number(cita.servicios?.anticipo || 0);
          if (cita.estado === 'concluida') concluidas++;
          if (cita.estado === 'pendiente' || cita.estado === 'confirmada') pendientes++;
        });

        setEstadisticas({
          citasPendientes: pendientes,
          ingresosMes: ingresos,
          citasConcluidas: concluidas,
          totalCitasMes: data.length
        });
      }
      setCargando(false);
    };

    fetchEstadisticas();
  }, []);

  if (cargando) return <div className="animate-pulse tracking-widest text-gray-400 text-xs p-12">Calculando estadísticas...</div>;

  // Meta gráfica mensual (puedes cambiar este número)
  const metaCitas = 20;
  const porcentajeMeta = Math.min((estadisticas.totalCitasMes / metaCitas) * 100, 100);

  return (
    <div className="animate-fade-in-up max-w-5xl">
      <h1 className="text-3xl font-serif mb-8 border-b border-gray-200 pb-4">Resumen y Desempeño</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-2">Ingresos por Anticipos</h2>
          <p className="text-4xl font-serif text-dark">${estadisticas.ingresosMes.toFixed(2)}</p>
          <p className="text-[10px] tracking-widest text-green-500 uppercase mt-4">+ Este mes</p>
        </div>
        <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-2">Próximas Citas</h2>
          <p className="text-4xl font-serif text-dark">{estadisticas.citasPendientes}</p>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-4">En agenda</p>
        </div>
        <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
          <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-2">Trabajos Terminados</h2>
          <p className="text-4xl font-serif text-dark">{estadisticas.citasConcluidas}</p>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-4">Este mes</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8">
        <h3 className="text-sm font-medium mb-6">Actividad Mensual (Citas Agendadas)</h3>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{estadisticas.totalCitasMes} Citas</span>
          <span>Meta: {metaCitas} Citas</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-dark h-3 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${porcentajeMeta}%` }}
          ></div>
        </div>
        <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-4 text-center">
          {porcentajeMeta >= 100 ? '¡Meta Mensual Alcanzada!' : `Faltan ${metaCitas - estadisticas.totalCitasMes} citas para la meta mensual`}
        </p>
      </div>
    </div>
  );
}