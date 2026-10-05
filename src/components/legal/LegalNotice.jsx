import ScrollReveal from '../ui/ScrollReveal';

export default function LegalNotice() {
  return (
    <ScrollReveal>
      <section className="max-w-3xl mx-auto mt-20 px-4 mb-32">
        <h1 className="text-3xl font-serif mb-2 text-center">Aviso Legal</h1>
        <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-12">
          Última actualización: Octubre 2026
        </p>
        
        <div className="text-gray-600 space-y-8 text-sm leading-relaxed font-light">
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">1. Datos Identificativos</h2>
            <p>
              En cumplimiento con el deber de información, se indica que este sitio web es operado por Michelle Krtsch, con domicilio en Monterrey, Nuevo León, México.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">2. Condiciones de Uso</h2>
            <p>
              El acceso y uso de este sitio web atribuye la condición de usuario, aceptando desde dicho acceso las condiciones de uso aquí reflejadas. El usuario se compromete a hacer un uso adecuado del contenido y los servicios ofrecidos.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-dark mb-3">3. Propiedad Intelectual e Industrial</h2>
            <p>
              Todos los derechos de propiedad intelectual del contenido de esta página web, su diseño gráfico y sus códigos fuente, son titularidad exclusiva de Michelle Krtsch, correspondiéndole el ejercicio exclusivo de los derechos de explotación de los mismos.
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}