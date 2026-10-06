import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar({ vistaActiva, setVistaActiva }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const botones = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'agendar-manual', label: '+ Nueva Cita' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'configuracion', label: 'Configuración' }
  ];

  return (
    <aside className="w-full md:w-64 bg-dark text-white flex flex-col z-10 min-h-screen">
      <div className="p-8 border-b border-gray-800">
        <h2 className="text-xl tracking-[0.2em] font-bold">ADMIN</h2>
        <p className="text-xs text-gray-400 mt-2">Michelle Krtsch</p>
      </div>
      <nav className="flex-grow flex flex-col p-4 space-y-2">
        {botones.map(btn => (
          <button 
            key={btn.id}
            onClick={() => setVistaActiva(btn.id)} 
            className={`text-left px-4 py-3 text-sm tracking-widest uppercase transition-colors rounded-sm ${vistaActiva === btn.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            {btn.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}