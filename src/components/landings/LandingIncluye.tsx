"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type Incluido = {
  icon: LucideIcon;
  titulo: string;
  descripcion?: string;
};

type LandingIncluyeProps = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  items: Incluido[];
  nota?: string;
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingIncluye({ eyebrow, titulo, subtitulo, items, nota, acento }: LandingIncluyeProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className={`inline-flex items-center gap-2 ${colores.bg} border ${colores.borderSoft} ${colores.text} text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6`}>
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="flex flex-wrap justify-center gap-4"
        >
          {items.map(({ icon: Icon, titulo: itemTitulo, descripcion }) => (
            <motion.div
              key={itemTitulo}
              variants={item}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4"
            >
              <span className={`shrink-0 w-9 h-9 rounded-lg ${colores.bg} border ${colores.borderSoft} ${colores.text} flex items-center justify-center`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-white font-semibold text-sm">{itemTitulo}</p>
                {descripcion && <p className="text-neutral-500 text-xs leading-snug mt-0.5">{descripcion}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {nota && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-neutral-500 text-sm mt-8 max-w-xl mx-auto leading-relaxed"
          >
            {nota}
          </motion.p>
        )}
      </div>
    </section>
  );
}
