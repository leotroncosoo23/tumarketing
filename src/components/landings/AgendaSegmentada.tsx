import { Code2, Megaphone, ArrowRight } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

// Reemplaza al viejo cierre único ("¿Listo para tener una página que
// venda?") en las 6 landings de servicio. Estrategia de fricción cero: en
// vez de un solo botón genérico, el visitante elige primero qué necesita —
// así la consultoría que agenda ya viene calificada.
//
// El acento sigue el mismo criterio que ya usaba LandingCTA en cada landing:
// "cyan" (azul) en las 3 de software (paginas-web, apps, ecommerce) y
// "fuchsia" (violeta) en las 3 de marketing (publicidad, creacion-edicion,
// community-manager) — mismo color de sección que el resto de esa página.
type AgendaSegmentadaProps = {
  acento: Extract<Acento, "cyan" | "fuchsia">;
};

const BOTON_SOLIDO: Record<"cyan" | "fuchsia", string> = {
  cyan: "bg-cyan-400 hover:bg-cyan-300",
  fuchsia: "bg-fuchsia-400 hover:bg-fuchsia-300",
};

// Único link real que tenemos hasta ahora (evento de Cal.com para consultas
// de desarrollo/web). El de marketing todavía no existe: apunta a un ancla
// de la propia página como placeholder hasta que exista ese evento.
const LINK_SESION_TECNICA = "https://cal.com/leotroncosoo-kiwwvu/discovery-call-desarrollo-y-web";
const LINK_SESION_ESTRATEGICA = "#agendar";

export default function AgendaSegmentada({ acento }: AgendaSegmentadaProps) {
  const c = ACCENTS[acento];
  const boton = BOTON_SOLIDO[acento];

  return (
    <section
      id="agendar"
      className="relative bg-neutral-950 text-white py-24 md:py-32 px-6 overflow-hidden scroll-mt-24"
    >
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${c.glow} blur-[140px] rounded-full pointer-events-none`} />

      <div className="relative max-w-4xl mx-auto text-center mb-14">
        <span className={`inline-block ${c.bg} ${c.text} border ${c.border} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6`}>
          Consultoría gratuita de 15 minutos
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
          ¿Qué área de tu negocio necesitás escalar hoy?
        </h2>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto mt-5 leading-relaxed">
          Elegí tu foco y te armamos la propuesta exacta para tu negocio, sin vueltas.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`group flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl p-8 transition-all duration-300 ${c.cardBorderHover} ${c.cardShadow}`}>
          <span className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-6`}>
            <Code2 className={`w-6 h-6 ${c.text}`} />
          </span>
          <h3 className="text-2xl font-black mb-3">Desarrollo Web y Apps</h3>
          <p className="text-neutral-400 leading-relaxed mb-8 flex-1">
            Páginas, tiendas online o aplicaciones a medida. Contanos tu proyecto y te armamos la propuesta técnica
            exacta que necesitás.
          </p>
          <a
            href={LINK_SESION_TECNICA}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 ${boton} text-black font-black text-base px-6 py-4 rounded-full hover:scale-[1.02] transition-all`}
          >
            Agendar sesión técnica
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className={`group flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl p-8 transition-all duration-300 ${c.cardBorderHover} ${c.cardShadow}`}>
          <span className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-6`}>
            <Megaphone className={`w-6 h-6 ${c.text}`} />
          </span>
          <h3 className="text-2xl font-black mb-3">Marketing y Redes</h3>
          <p className="text-neutral-400 leading-relaxed mb-8 flex-1">
            Contenido, pauta y estrategia para vender más desde tus redes. Contanos tu objetivo y te armamos un plan a
            medida.
          </p>
          <a
            href={LINK_SESION_ESTRATEGICA}
            className={`inline-flex items-center justify-center gap-2 ${boton} text-black font-black text-base px-6 py-4 rounded-full hover:scale-[1.02] transition-all`}
          >
            Agendar sesión estratégica
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
