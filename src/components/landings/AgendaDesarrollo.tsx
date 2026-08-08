import { Code2 } from "lucide-react";
import { ACCENTS } from "./accents";
import CalendarioInline from "./CalendarioInline";

// Cierre de las 3 landings de software (paginas-web, apps, ecommerce): a
// diferencia de las landings de marketing, acá solo hay un camino posible
// (Desarrollo Web y Apps), así que en vez de la tarjeta + link externo se
// muestra el calendario de Cal.com embebido directo en la página.
export default function AgendaDesarrollo() {
  const c = ACCENTS.cyan;

  return (
    <section
      id="agendar"
      className="relative bg-neutral-950 text-white py-24 md:py-32 px-6 overflow-hidden scroll-mt-24"
    >
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${c.glow} blur-[140px] rounded-full pointer-events-none`} />

      <div className="relative max-w-3xl mx-auto text-center mb-12">
        <span className={`inline-flex items-center gap-2 ${c.bg} ${c.text} border ${c.border} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6`}>
          <Code2 className="w-3.5 h-3.5" />
          Consultoría técnica gratuita de 15 minutos
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
          ¿Listo para llevar tu proyecto de Desarrollo Web y Apps al siguiente nivel?
        </h2>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto mt-5 leading-relaxed">
          Elegí el horario que más te acomode. Sin formularios ni esperas: agendás acá mismo y nos vemos por videollamada.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <CalendarioInline />
      </div>
    </section>
  );
}
