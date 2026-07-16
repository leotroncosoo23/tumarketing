import { Flame, Clock, ThumbsUp } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";

type Dolor = {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
};

const DOLORES: Dolor[] = [
  {
    icono: <ThumbsUp className="w-6 h-6" />,
    titulo: "Likes que no pagan las cuentas",
    descripcion: "Tenés miles de seguidores e interacciones, pero al cerrar el mes las ventas no reflejan ese esfuerzo.",
  },
  {
    icono: <Flame className="w-6 h-6" />,
    titulo: "Presupuesto quemado en anuncios",
    descripcion: "Invertís en publicidad todos los meses, pero no sabés bien qué campaña te está trayendo clientes reales.",
  },
  {
    icono: <Clock className="w-6 h-6" />,
    titulo: "Apagando incendios todo el día",
    descripcion: "Entre responder mensajes y resolver el día a día, nunca te queda tiempo para pensar una estrategia real.",
  },
];

export default function ElProblema() {
  return (
    <section className="bg-neutral-900/30 border-y border-neutral-900 py-24 relative overflow-hidden">
      {/* Resplandor sutil de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <FadeInScroll className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
            ¿Por qué tu negocio no está{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              escalando
            </span>
            ?
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Si te identificás con alguna de estas situaciones, no estás solo — y tiene solución.
          </p>
        </FadeInScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOLORES.map((dolor, i) => (
            <FadeInScroll key={dolor.titulo} delay={0.1 + i * 0.2}>
              <div className="h-full bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-neutral-700 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-5">
                  {dolor.icono}
                </div>
                <h3 className="text-white font-bold text-lg mb-2 leading-snug">{dolor.titulo}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{dolor.descripcion}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
