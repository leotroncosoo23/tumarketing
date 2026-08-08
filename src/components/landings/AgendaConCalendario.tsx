import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";
import CalendarioInline from "./CalendarioInline";

// Base compartida por AgendaDesarrollo (software) y AgendaRedes (marketing):
// mismo layout de cierre (badge + título + calendario embebido), solo cambia
// el acento de color, el ícono, el copy y a qué calendario de Cal.com apunta.
type AgendaConCalendarioProps = {
  acento: Extract<Acento, "cyan" | "fuchsia">;
  icono: LucideIcon;
  badge: string;
  titulo: string;
  descripcion: string;
  calLink: string;
  namespace: string;
};

export default function AgendaConCalendario({
  acento,
  icono: Icono,
  badge,
  titulo,
  descripcion,
  calLink,
  namespace,
}: AgendaConCalendarioProps) {
  const c = ACCENTS[acento];

  return (
    <section
      id="agendar"
      className="relative bg-neutral-950 text-white py-24 md:py-32 px-6 overflow-hidden scroll-mt-24"
    >
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${c.glow} blur-[140px] rounded-full pointer-events-none`} />

      <div className="relative max-w-3xl mx-auto text-center mb-12">
        <span className={`inline-flex items-center gap-2 ${c.bg} ${c.text} border ${c.border} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6`}>
          <Icono className="w-3.5 h-3.5" />
          {badge}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">{titulo}</h2>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto mt-5 leading-relaxed">{descripcion}</p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <CalendarioInline calLink={calLink} namespace={namespace} />
      </div>
    </section>
  );
}
