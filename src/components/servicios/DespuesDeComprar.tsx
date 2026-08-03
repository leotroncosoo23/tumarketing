import { LayoutDashboard, MessageSquare, Activity } from "lucide-react";

const pasos = [
  {
    icono: LayoutDashboard,
    titulo: "Acceso a tu Portal Privado",
    texto:
      "Al confirmar tu plan, se te habilita automáticamente el usuario en nuestra plataforma: tu centro de comando para gestionar tanto campañas de marketing como proyectos de desarrollo.",
  },
  {
    icono: MessageSquare,
    titulo: "Onboarding Inteligente",
    texto:
      "Cargá la información de tu negocio de forma segura y chateá con nosotros directo en la web o por WhatsApp para alinear la estrategia de marketing o los requerimientos técnicos de tu proyecto.",
  },
  {
    icono: Activity,
    titulo: "Seguimiento Transparente",
    texto:
      "Adiós a la incertidumbre. Monitoreá el rendimiento de tus campañas o el avance de tu desarrollo, revisá las fechas estimadas de entrega y evaluá el progreso en tiempo real.",
  },
];

// Responde "¿qué pasa después de pagar?" justo antes de la decisión de
// compra, para bajar la fricción/ansiedad del checkout. Mismo copy que ya
// usábamos en el catálogo general (ElProceso.tsx) antes de que esa sección
// pasara a hablar de la metodología de trabajo — acá encaja mejor.
export default function DespuesDeComprar() {
  return (
    <section className="border-t border-neutral-900 pt-14 mt-4">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 text-[#ccff00] font-bold tracking-widest uppercase mb-3 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
          Después de contratar
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">¿Qué pasa apenas confirmás el pago?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {pasos.map(({ icono: Icono, titulo, texto }, i) => (
          <div key={titulo} className="relative bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
            <span className="absolute top-5 right-5 text-3xl font-black text-white/5 select-none">
              0{i + 1}
            </span>
            <div className="relative z-10 w-11 h-11 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center mb-4">
              <Icono className="w-5 h-5 text-[#ccff00]" strokeWidth={1.75} />
            </div>
            <h3 className="font-bold mb-2">{titulo}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
