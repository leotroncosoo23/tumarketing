"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type PuntoDolor = {
  icon: LucideIcon;
  texto: string;
};

type LandingProblemaProps = {
  eyebrow: string;
  titulo: string;
  puntos: PuntoDolor[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingProblema({ eyebrow, titulo, puntos, acento }: LandingProblemaProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-28 overflow-hidden border-y border-neutral-900">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-neutral-500 font-bold tracking-widest uppercase mb-4 text-xs">
            <AlertCircle className="w-4 h-4" />
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">{titulo}</h2>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contenedor}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {puntos.map(({ icon: Icon, texto }) => (
            <motion.div
              key={texto}
              variants={item}
              className="flex items-start gap-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5"
            >
              <span className={`shrink-0 w-9 h-9 rounded-lg ${colores.bg} border ${colores.borderSoft} ${colores.text} flex items-center justify-center`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <p className="text-neutral-300 leading-relaxed pt-1">{texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
