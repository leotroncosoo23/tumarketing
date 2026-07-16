"use client";

import { motion, type Variants } from "framer-motion";

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroManifiesto() {
  return (
    <section className="relative bg-zinc-950 text-white min-h-[70vh] flex flex-col justify-center py-32 px-6 overflow-hidden">
      {/* Patrón de grilla sutil, desvanecido hacia los bordes */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, black 30%, transparent 100%)",
        }}
      />

      {/* Resplandor radial flúor de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4EE26]/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial="oculto"
        animate="visible"
        variants={contenedor}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-8"
        >
          Estrategia digital y{" "}
          <span className="text-[#D4EE26]">software de alto rendimiento</span>, desde el sur para el
          mundo.
        </motion.h1>

        <motion.p
          variants={item}
          className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
        >
          No somos una agencia tradicional. Somos el departamento de crecimiento y tecnología que tu
          empresa necesita para escalar.
        </motion.p>
      </motion.div>
    </section>
  );
}
