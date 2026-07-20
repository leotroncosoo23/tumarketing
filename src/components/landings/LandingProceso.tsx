"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type Paso = {
  icon: LucideIcon;
  titulo: string;
  texto: string;
};

type LandingProcesoProps = {
  titulo: string;
  subtitulo: string;
  pasos: Paso[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingProceso({ titulo, subtitulo, pasos, acento }: LandingProcesoProps) {
  const colores = ACCENTS[acento];
  // La línea conectora solo tiene sentido (y su matemática de porcentajes solo
  // cierra) cuando los pasos entran en una única fila de 3 columnas exactas.
  const conLinea = pasos.length === 3;

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-32 overflow-hidden">
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
          className={`relative grid grid-cols-1 gap-y-12 gap-x-8 ${
            conLinea ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {/* Línea conectora: solo con exactamente 3 pasos, para que el 16.66%/83.33% coincida con el centro de la 1ª y 3ª columna. */}
          {conLinea && (
            <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-neutral-800" />
          )}

          {pasos.map(({ icon: Icon, titulo: pasoTitulo, texto }, i) => (
            <motion.div key={pasoTitulo} variants={item} className="relative flex flex-col items-center text-center">
              <span
                className={`relative z-10 shrink-0 w-14 h-14 rounded-2xl ${colores.bg} border ${colores.border} ${colores.text} flex items-center justify-center font-black text-lg mb-6`}
              >
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 font-bold">
                  {i + 1}
                </span>
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <h3 className="text-lg font-bold mb-1.5">{pasoTitulo}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-[18rem]">{texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
