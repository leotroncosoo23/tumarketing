"use client";

import { motion, type Variants } from "framer-motion";
import { Eye, TrendingUp, Target } from "lucide-react";

const valores = [
  {
    icono: Eye,
    titulo: "Transparencia Radical",
    texto:
      "Sin secretos. Desde el Panel de Cliente, auditás en tiempo real el rendimiento de tus campañas publicitarias y el progreso exacto del desarrollo de software.",
  },
  {
    icono: TrendingUp,
    titulo: "Crecimiento Sostenible",
    texto:
      "Diseñamos identidades de marca que perduran y escribimos arquitecturas de código limpio, eliminando la deuda técnica y garantizando la relevancia de tu negocio a largo plazo.",
  },
  {
    icono: Target,
    titulo: "Foco Obsesivo en Resultados",
    texto:
      "Medimos el éxito en conversión. Cada anuncio y cada línea de código tiene un solo objetivo: generar clientes potenciales y maximizar el retorno de tu inversión (ROI).",
  },
];

const encabezado: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const tarjeta: Variants = {
  oculto: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

export default function Filosofia() {
  return (
    <section className="relative bg-zinc-950 text-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={encabezado}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            Nuestra <span className="text-[#D4EE26]">filosofía de trabajo</span>.
          </h2>
          <p className="text-zinc-400 text-lg">
            Los principios innegociables que fusionan marketing y desarrollo de software, en partes
            iguales, para escalar tu negocio.
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {valores.map(({ icono: Icono, titulo, texto }) => (
            <motion.div
              key={titulo}
              variants={tarjeta}
              className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4EE26]/30"
            >
              <div className="relative w-14 h-14 rounded-2xl bg-[#D4EE26]/10 flex items-center justify-center mb-6">
                <div className="absolute -inset-2 rounded-full bg-[#D4EE26]/0 group-hover:bg-[#D4EE26]/20 blur-xl transition-all duration-500 pointer-events-none" />
                <Icono className="relative w-7 h-7 text-[#D4EE26]" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{titulo}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">{texto}</p>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 rounded-full">
                  Marketing
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D4EE26]/10 border border-[#D4EE26]/20 text-[#D4EE26] px-3 py-1 rounded-full">
                  Software
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
