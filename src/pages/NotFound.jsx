import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function NotFound() {
  return (
    <ScrollReveal>
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-6xl font-serif mb-4">404</h1>
        <h2 className="text-xl tracking-widest uppercase mb-8 text-gray-500">Página no encontrada</h2>
        <p className="text-gray-400 mb-10 max-w-md">
          Lo sentimos, la página que estás buscando no existe, ha sido movida o está temporalmente inactiva.
        </p>
        <Link 
          to="/" 
          className="bg-dark text-white px-10 py-4 tracking-widest uppercase text-sm hover:bg-gray-700 transition duration-300"
        >
          Volver al Inicio
        </Link>
      </section>
    </ScrollReveal>
  );
}