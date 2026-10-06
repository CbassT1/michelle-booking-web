import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas');
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 -mt-32">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm rounded-sm">
        <h2 className="text-2xl font-serif text-center mb-8">Acceso Administrativo</h2>
        
        {error && <div className="bg-red-50 text-red-500 text-xs p-3 mb-6 text-center tracking-widest">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-dark transition-colors bg-white" 
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:border-dark transition-colors bg-white" 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-dark text-white py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}