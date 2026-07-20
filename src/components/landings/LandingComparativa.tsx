"use client";

import { motion, type Variants } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type Punto = { label: string; texto: string };

type LandingComparativaProps = {
  titulo: string;
  subtitulo: string;
  malaEtiqueta: string;
  malaSubEtiqueta: string;
  malaPuntos: Punto[];
  buenaEtiqueta: string;
  buenaSubEtiqueta: string;
  buenaPuntos: Punto[];
  acento: Acento;
};

const fadeUp: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const desdeIzquierda: Variants = {
  oculto: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const desdeDerecha: Variants = {
  oculto: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingComparativa({
  titulo,
  subtitulo,
  malaEtiqueta,
  malaSubEtiqueta,
  malaPuntos,
  buenaEtiqueta,
  buenaSubEtiqueta,
  buenaPuntos,
  acento,
}: LandingComparativaProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={desdeIzquierda}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 opacity-90"
          >
            <h3 className="text-xl font-bold mb-1">{malaEtiqueta}</h3>
            <p className="text-sm text-neutral-500 mb-6">{malaSubEtiqueta}</p>

            <ul className="space-y-5">
              {malaPuntos.map(({ label, texto }) => (
                <li key={label} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400/70 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-neutral-200">{label}</p>
                    <p className="text-sm text-neutral-500 leading-relaxed">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={desdeDerecha}
            className={`relative bg-slate-800 border ${colores.border} rounded-2xl p-8 lg:scale-105 ${colores.ctaShadow}`}
          >
            <span className={`absolute -top-4 left-1/2 -translate-x-1/2 ${colores.badgeBg} text-black text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full`}>
              Recomendado
            </span>

            <h3 className="text-xl font-bold mb-1">{buenaEtiqueta}</h3>
            <p className={`text-sm ${colores.textSoft} mb-6`}>{buenaSubEtiqueta}</p>

            <ul className="space-y-5">
              {buenaPuntos.map(({ label, texto }) => (
                <li key={label} className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 ${colores.text} shrink-0 mt-0.5`} strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-white">{label}</p>
                    <p className="text-sm text-neutral-400 leading-relaxed">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
