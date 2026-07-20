"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type Tecnologia = {
  icon: LucideIcon;
  nombre: string;
};

type LandingTecnologiasProps = {
  titulo: string;
  subtitulo: string;
  tecnologias: Tecnologia[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingTecnologias({ titulo, subtitulo, tecnologias, acento }: LandingTecnologiasProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-neutral-950 text-white py-16 md:py-20 border-b border-neutral-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{titulo}</h2>
          <p className="text-neutral-500 text-sm">{subtitulo}</p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={contenedor}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {tecnologias.map(({ icon: Icon, nombre }) => (
            <motion.span
              key={nombre}
              variants={item}
              className={`inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-200 hover:border-neutral-700 transition-colors`}
            >
              <Icon className={`w-4 h-4 ${colores.text}`} strokeWidth={1.75} />
              {nombre}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
