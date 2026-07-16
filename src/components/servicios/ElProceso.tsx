"use client";

import { motion, type Variants } from "framer-motion";
import { LayoutDashboard, MessageSquare, Activity } from "lucide-react";

const pasos = [
  {
    numero: "01",
    icono: LayoutDashboard,
    titulo: "Acceso a tu Portal Privado",
    texto: "Al confirmar tu plan, se te habilita automáticamente un usuario en nuestra plataforma: tu centro de comando para gestionar tanto campañas de marketing como proyectos de desarrollo.",
  },
  {
    numero: "02",
    icono: MessageSquare,
    titulo: "Onboarding Inteligente",
    texto: "Cargá la información de tu negocio de forma segura y chateá con nosotros directo en la web o por WhatsApp para alinear la estrategia de marketing o los requerimientos técnicos de tu proyecto.",
  },
  {
    numero: "03",
    icono: Activity,
    titulo: "Seguimiento Transparente",
    texto: "Adiós a la incertidumbre. Monitoreá el rendimiento de tus campañas o el avance de tu desarrollo, revisá las fechas estimadas de entrega y evaluá el progreso en tiempo real.",
  },
];

const encabezado: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const tarjeta: Variants = {
  oculto: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ElProceso() {
  return (
    <section className="relative text-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={encabezado}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Tu proyecto bajo control, siempre.
          </h2>
          <p className="text-neutral-400 text-lg">
            Un proceso transparente y sin fricciones a través de nuestro Panel de Cliente exclusivo.
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
        >
          {/* Línea conectora horizontal (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-[#D4EE26]/40 via-[#D4EE26]/20 to-[#D4EE26]/40" />
          {/* Línea conectora vertical (mobile) */}
          <div className="md:hidden absolute top-16 bottom-16 left-16 w-px bg-gradient-to-b from-[#D4EE26]/40 via-[#D4EE26]/20 to-[#D4EE26]/40" />

          {pasos.map(({ numero, icono: Icono, titulo, texto }) => (
            <motion.div
              key={numero}
              variants={tarjeta}
              className="relative bg-zinc-900 border border-white/5 rounded-2xl p-8"
            >
              <span className="absolute top-6 right-6 text-4xl font-black text-white/5 select-none">
                {numero}
              </span>

              <div className="relative z-10 w-16 h-16 rounded-full bg-[#D4EE26]/10 border border-[#D4EE26]/30 flex items-center justify-center mb-6">
                <Icono className="w-7 h-7 text-[#D4EE26]" strokeWidth={1.75} />
              </div>

              <h3 className="text-xl font-bold mb-3">{titulo}</h3>
              <p className="text-neutral-400 leading-relaxed">{texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
