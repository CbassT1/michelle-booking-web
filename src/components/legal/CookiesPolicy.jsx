import ScrollReveal from '../ui/ScrollReveal';

export default function CookiesPolicy() {
  return (
    <ScrollReveal>
      <section className="max-w-3xl mx-auto mt-20 px-4 mb-32">
        <h1 className="text-3xl font-serif mb-2 text-center">Aviso de Cookies</h1>
        <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-12">
          Última actualización: Octubre 2026
        </p>
        
        <div className="text-gray-600 space-y-8 text-sm leading-relaxed font-light">
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">1. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">2. Cookies que utilizamos</h2>
            <p>
              Este sitio web utiliza cookies técnicas (necesarias para el funcionamiento de la plataforma de reservas y mantenimiento de la sesión) y cookies de análisis (para medir el tráfico y comportamiento de los usuarios, ayudándonos a mejorar la experiencia).
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">3. Gestión de cookies</h2>
            <p>
              Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador. Tenga en cuenta que si desactiva las cookies, es posible que el sistema de reservas no funcione correctamente.
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}