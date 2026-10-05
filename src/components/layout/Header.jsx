import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const location = useLocation();
  const mostrarBoton = location.pathname !== '/';

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        if (currentScrollY > 50) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        }
      } 
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lastScrollY]);

  return (
    <header 
      onMouseEnter={() => {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => {
        if (window.scrollY > 50) {
          timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
        }
      }}
      className={`py-8 border-b border-gray-200 flex flex-col items-center bg-light fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out shadow-sm ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Link to="/" className="inline-block group z-10">
        <h1 className="text-3xl md:text-4xl tracking-[0.2em] font-bold group-hover:text-gray-600 transition-colors">
          MICHELLE KRTSCH
        </h1>
      </Link>
      <p className="text-xs md:text-sm tracking-widest text-gray-500 uppercase mt-2">Menú de Servicios</p>

      {mostrarBoton && (
        <Link 
          to="/#agendar" 
          className="absolute top-6 md:top-8 right-4 md:right-8 bg-dark text-white px-4 md:px-6 py-2 md:py-3 tracking-widest uppercase text-[10px] md:text-xs hover:bg-gray-700 transition duration-300 shadow-sm"
        >
          Agendar Cita
        </Link>
      )}
    </header>
  );
}