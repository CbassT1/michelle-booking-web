import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Hero from '../components/layout/Hero';
import ServicesMenu from '../components/services/ServicesMenu';
import ScrollReveal from '../components/ui/ScrollReveal';
import Booking from '../components/booking/Booking';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('servicios');
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracion').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (location.hash === '#agendar') setSeccionActiva('agendar');
    else if (location.hash === '#cursos') setSeccionActiva('cursos');
    else if (location.hash === '#contacto') setSeccionActiva('contacto');
    else setSeccionActiva('servicios');
  }, [location.hash]);

  const navItems = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'agendar', label: 'Agendar Cita' },
    { id: 'cursos', label: 'Cursos' },
    { id: 'contacto', label: 'Contacto' }
  ];

  const cambiarPestana = (id) => {
    setSeccionActiva(id);
    navigate(id === 'servicios' ? '/' : `/#${id}`);
  };

  return (
    <>
      <nav className="flex justify-center space-x-6 md:space-x-12 py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => cambiarPestana(item.id)}
            className={`tracking-widest uppercase text-xs md:text-sm pb-1 border-b-2 transition-colors duration-300 ${
              seccionActiva === item.id ? 'border-dark font-semibold text-dark' : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {seccionActiva === 'servicios' && (
        <div className="animate-fade-in">
          <ScrollReveal><Hero /></ScrollReveal>
          <ScrollReveal><ServicesMenu /></ScrollReveal>
        </div>
      )}

      {seccionActiva === 'agendar' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 mb-24">
            <h2 className="text-2xl tracking-widest uppercase mb-10 text-center">Agendar Cita</h2>
            <Booking />
          </section>
        </ScrollReveal>
      )}

      {seccionActiva === 'cursos' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 text-center mb-24">
            <h2 className="text-2xl tracking-widest uppercase mb-10">Nuestros Cursos</h2>
            <div className="bg-white border border-gray-200 p-20 rounded-sm">
              <h3 className="text-xl font-serif mb-4">Capacitación Profesional</h3>
              <p className="text-gray-500 tracking-widest uppercase text-sm">
                {config ? config.texto_cursos : 'Cargando información...'}
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {seccionActiva === 'contacto' && (
        <ScrollReveal>
          <section className="max-w-5xl mx-auto mt-20 px-4 mb-32">
            <h2 className="text-2xl tracking-widest uppercase mb-10 text-center">Michelle Krtsch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-8 md:p-12">
              <div className="bg-[#f0efed] min-h-[400px] h-full flex items-center justify-center rounded-sm">
                <span className="text-gray-400 text-xs tracking-widest uppercase">[ Foto de Michelle ]</span>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-serif mb-4">Sobre Mí</h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                  {config ? config.biografia : 'Cargando biografía...'}
                </p>

                <div className="mb-8">
                  <h4 className="text-xs font-medium text-dark tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">Conecta Conmigo</h4>
                  <div className="flex space-x-6">
                    {config?.instagram_url && (
                      <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dark transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                      </a>
                    )}
                    {config?.facebook_url && (
                      <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dark transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                      </a>
                    )}
                    {config?.telefono && (
                      <a href={`https://wa.me/${config.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dark transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-dark tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">Ubicación</h4>
                  <p className="text-gray-500 text-sm mb-4">
                    {config ? config.direccion : 'Cargando...'}<br/>
                    {config?.maps_url && (
                      <a href={config.maps_url} target="_blank" rel="noopener noreferrer" className="text-dark border-b border-dark hover:text-gray-500 hover:border-gray-500 transition-colors inline-block mt-2">
                        Abrir en aplicación de Google Maps
                      </a>
                    )}
                  </p>
                  
                  <div className="w-full h-64 bg-gray-100 rounded-sm overflow-hidden shadow-sm mt-4">
                    <iframe 
                      src="https://maps.google.com/maps?q=Av%20Valle%20Alto%208051,%20Lomas%20de%20Valle%20Alto,%2064989%20Monterrey,%20N.L.&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </>
  );
}