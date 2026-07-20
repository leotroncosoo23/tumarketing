"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type PasoCompra = {
  icon: LucideIcon;
  titulo: string;
  texto: string;
};

type LandingFlujoCompraProps = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  pasos: PasoCompra[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  oculto: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Timeline horizontal: representa el recorrido del COMPRADOR en la tienda
// (no confundir con LandingProceso, que es cómo trabajamos nosotros con el cliente).
export default function LandingFlujoCompra({ eyebrow, titulo, subtitulo, pasos, acento }: LandingFlujoCompraProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-28 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
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
          className="relative"
        >
          {/* Línea de tiempo conectora */}
          <div
            className="hidden md:block absolute top-8 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"
            style={{ left: `${100 / pasos.length / 2}%`, right: `${100 / pasos.length / 2}%` }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
            {pasos.map(({ icon: Icon, titulo: pasoTitulo, texto }, i) => (
              <motion.div key={pasoTitulo} variants={item} className="relative flex flex-col items-center text-center">
                <span
                  className={`relative z-10 w-16 h-16 rounded-full ${colores.bg} border-2 ${colores.border} ${colores.text} flex items-center justify-center mb-5 bg-slate-950`}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                  <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-neutral-700 flex items-center justify-center text-[11px] text-neutral-400 font-bold">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-bold mb-1.5">{pasoTitulo}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-[16rem]">{texto}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
