import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ServiciosView from '../../components/admin/views/ServiciosView';
import ConfiguracionView from '../../components/admin/views/ConfiguracionView';
import CursosView from '../../components/admin/views/CursosView';
import AgendaView from '../../components/admin/views/AgendaView';
import ResumenView from '../../components/admin/views/ResumenView';

export default function Dashboard() {
  const [vistaActiva, setVistaActiva] = useState('resumen');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-dark relative">
      <AdminSidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        {vistaActiva === 'resumen' && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-serif mb-8 border-b border-gray-200 pb-4">Panel de Control</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
                <h2 className="text-lg font-medium mb-2">Citas Pendientes</h2>
                <p className="text-4xl font-serif">0</p>
                <p className="text-xs tracking-widest text-gray-400 uppercase mt-4">Para esta semana</p>
              </div>
              <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
                <h2 className="text-lg font-medium mb-2">Ingresos del Mes</h2>
                <p className="text-4xl font-serif">$0.00</p>
                <p className="text-xs tracking-widest text-gray-400 uppercase mt-4">Anticipos cobrados</p>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'agenda' && <AgendaView />}

        {vistaActiva === 'servicios' && <ServiciosView />}

        {vistaActiva === 'cursos' && <CursosView />}

        {vistaActiva === 'agendar-manual' && (
          <div className="animate-fade-in-up max-w-2xl">
            <h1 className="text-3xl font-serif mb-8 border-b border-gray-200 pb-4">Crear Cita Manual</h1>
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">
                Módulo en construcción.
              </p>
            </div>
          </div>
        )}

        {vistaActiva === 'configuracion' && <ConfiguracionView />}
        

      </main>
    </div>
  );
}