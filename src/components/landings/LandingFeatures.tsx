"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type Feature = {
  icon: LucideIcon;
  titulo: string;
  texto: string;
};

type LandingFeaturesProps = {
  titulo: string;
  subtitulo: string;
  items: Feature[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const tarjeta: Variants = {
  oculto: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingFeatures({ titulo, subtitulo, items, acento }: LandingFeaturesProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {items.map(({ icon: Icon, titulo: itemTitulo, texto }) => (
            <motion.div
              key={itemTitulo}
              variants={tarjeta}
              className={`group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${colores.cardBorderHover} ${colores.cardShadow}`}
            >
              <div className={`mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl ${colores.bg} border ${colores.borderSoft} ${colores.text} transition-colors duration-300 ${colores.bgHover}`}>
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold mb-3">{itemTitulo}</h3>
              <p className="text-neutral-400 leading-relaxed">{texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
