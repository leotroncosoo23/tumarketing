"use client";

import { motion, type Variants } from "framer-motion";
import { Search, Compass, Rocket, TrendingUp } from "lucide-react";

const pasos = [
  {
    numero: "01",
    icono: Search,
    titulo: "Diagnóstico",
    texto: "Analizamos tu marca, tu mercado y a tu competencia para saber exactamente dónde estás parado.",
  },
  {
    numero: "02",
    icono: Compass,
    titulo: "Estrategia",
    texto: "Armamos un plan a medida con objetivos claros y plazos reales, no promesas vacías.",
  },
  {
    numero: "03",
    icono: Rocket,
    titulo: "Ejecución",
    texto: "Nuestro equipo pone en marcha cada pieza: contenido, pauta, diseño y desarrollo, todo coordinado.",
  },
  {
    numero: "04",
    icono: TrendingUp,
    titulo: "Resultados",
    texto: "Medimos, ajustamos y te mostramos números concretos mes a mes. Vos ves el progreso en tiempo real.",
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
          <span className="inline-flex items-center gap-2 text-[#D4EE26] font-bold tracking-widest uppercase mb-4 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4EE26] animate-pulse" />
            Cómo trabajamos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">Tu proyecto, bajo control</h2>
          <p className="text-neutral-400 text-lg">
            Sin sorpresas, sin vueltas. Así es el camino desde que nos escribís hasta que ves los resultados.
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6"
        >
          {/* Línea conectora horizontal (desktop) */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#D4EE26]/40 via-[#D4EE26]/20 to-[#D4EE26]/40" />
          {/* Línea conectora vertical (mobile) */}
          <div className="md:hidden absolute top-16 bottom-16 left-16 w-px bg-gradient-to-b from-[#D4EE26]/40 via-[#D4EE26]/20 to-[#D4EE26]/40" />

          {pasos.map(({ numero, icono: Icono, titulo, texto }) => (
            <motion.div
              key={numero}
              variants={tarjeta}
              className="relative bg-zinc-900 border border-white/5 rounded-2xl p-8"
            >
              <span className="absolute top-6 right-6 text-4xl font-black text-white/5 select-none">{numero}</span>

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
