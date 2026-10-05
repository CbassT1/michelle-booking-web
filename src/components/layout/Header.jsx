import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="py-8 text-center border-b border-gray-200">
      <Link to="/" className="inline-block group">
        <h1 className="text-4xl tracking-[0.2em] font-bold group-hover:text-gray-600 transition-colors">
          MICHELLE KRTSCH
        </h1>
      </Link>
      <p className="text-sm tracking-widest text-gray-500 uppercase mt-2">Menú de Servicios</p>
    </header>
  );
}