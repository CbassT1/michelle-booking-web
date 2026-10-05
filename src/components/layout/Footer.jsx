import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 text-center mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <p className="tracking-[0.2em] mb-3 text-lg">MICHELLE KRTSCH</p>
        <p className="text-sm text-gray-400 font-light mb-10">Monterrey, Nuevo León | Cita previa</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-xs text-gray-500 tracking-widest uppercase border-t border-gray-800 pt-8">
          <Link to="/aviso-legal" className="hover:text-white transition-colors duration-300">Aviso Legal</Link>
          <Link to="/privacidad" className="hover:text-white transition-colors duration-300">Política de Privacidad</Link>
          <Link to="/cookies" className="hover:text-white transition-colors duration-300">Aviso de Cookies</Link>
        </div>
      </div>
    </footer>
  );
}