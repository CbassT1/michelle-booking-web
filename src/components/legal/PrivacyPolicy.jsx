import ScrollReveal from '../ui/ScrollReveal';

export default function PrivacyPolicy() {
  return (
    <ScrollReveal>
      <section className="max-w-3xl mx-auto mt-20 px-4 mb-32">
        <h1 className="text-3xl font-serif mb-2 text-center">Política de Privacidad</h1>
        <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-12">
          Última actualización: Octubre 2026
        </p>
        
        <div className="text-gray-600 space-y-8 text-sm leading-relaxed font-light">
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">1. Información que recopilamos</h2>
            <p>
              Para gestionar tus citas de manera eficiente, recopilamos tu nombre completo, correo electrónico y número de teléfono. Estos datos son estrictamente necesarios para el uso de la plataforma.
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">2. Uso de la información</h2>
            <p>
              Tus datos son utilizados exclusivamente para la confirmación de reservaciones, envío de recordatorios a través del sistema automatizado y gestión del anticipo mediante pasarelas de pago seguras.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-dark mb-3">3. Protección de datos</h2>
            <p>
              Toda la información se almacena en servidores seguros con políticas de Row Level Security (RLS) habilitadas, garantizando que terceros no autorizados puedan acceder a tu información personal.
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}