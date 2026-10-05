import { useState } from 'react';
import Hero from '../components/layout/Hero';
import ServicesMenu from '../components/services/ServicesMenu';
import ScrollReveal from '../components/ui/ScrollReveal';
import Booking from '../components/booking/Booking';

export default function Home() {
  const [seccionActiva, setSeccionActiva] = useState('servicios');

  const navItems = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'agendar', label: 'Agendar Cita' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'contacto', label: 'Contacto' }
  ];

  return (
    <>
      {/* Barra de Navegación */}
      <nav className="flex justify-center space-x-6 md:space-x-12 py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccionActiva(item.id)}
            className={`tracking-widest uppercase text-xs md:text-sm pb-1 border-b-2 transition-colors duration-300 ${
              seccionActiva === item.id 
                ? 'border-dark font-semibold text-dark' 
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Vistas Dinámicas */}
      {seccionActiva === 'servicios' && (
        <div className="animate-fade-in">
          <ScrollReveal>
            <Hero />
          </ScrollReveal>
          
          <ScrollReveal>
            <ServicesMenu />
          </ScrollReveal>
        </div>
      )}

      {seccionActiva === 'agendar' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 mb-24">
            <h2 className="text-2xl tracking-widest uppercase mb-10 text-center">Agendar Cita</h2>
            
            {/* Aquí inyectamos el componente Booking interactivo */}
            <Booking />
            
          </section>
        </ScrollReveal>
      )}

      {seccionActiva === 'cursos' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 text-center mb-24">
            <h2 className="text-2xl tracking-widest uppercase mb-10">Plataforma de Cursos</h2>
            <div className="bg-white border border-gray-200 p-20 rounded-sm">
              <p className="text-gray-500 tracking-widest uppercase text-sm">
                [ Aquí conectaremos tu arquitectura SaaS de e-learning ]
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {seccionActiva === 'contacto' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 text-center mb-24">
            <h2 className="text-2xl tracking-widest uppercase mb-10">Contacto</h2>
            <div className="bg-white border border-gray-200 p-20 rounded-sm">
              <p className="text-gray-500 tracking-widest uppercase text-sm">
                [ Información de contacto, mapa y redes sociales ]
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}
    </>
  );
}