import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function ProtectedRoute({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      setCargando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-gray-400 tracking-widest">Verificando seguridad...</div>;
  
  if (!sesion) return <Navigate to="/admin" />;

  return children;
}