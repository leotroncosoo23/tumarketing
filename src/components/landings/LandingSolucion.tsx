"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import ServiceMockup, { type MockupVariant } from "./ServiceMockup";
import { ACCENTS, type Acento } from "./accents";

type LandingSolucionProps = {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  items: string[];
  /** Ilustración decorativa a mostrar. Ignorado si se pasa `visual`. */
  mockup?: MockupVariant;
  /** Reemplaza el mockup decorativo por contenido propio (ej. un embed real). */
  visual?: ReactNode;
  acento: Acento;
  invertido?: boolean;
};

const desdeIzquierda: Variants = {
  oculto: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const desdeDerecha: Variants = {
  oculto: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingSolucion({
  eyebrow,
  titulo,
  descripcion,
  items,
  mockup,
  visual: visualPersonalizado,
  acento,
  invertido = false,
}: LandingSolucionProps) {
  const colores = ACCENTS[acento];

  const texto = (
    <motion.div
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={invertido ? desdeDerecha : desdeIzquierda}
    >
      <span className={`inline-flex items-center gap-2 ${colores.bg} border ${colores.borderSoft} ${colores.text} text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6`}>
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-5 leading-[1.1]">{titulo}</h2>
      <p className="text-neutral-400 text-lg leading-relaxed mb-8">{descripcion}</p>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${colores.text}`} strokeWidth={2} />
            <span className="text-neutral-200 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  const visual = (
    <motion.div
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={invertido ? desdeIzquierda : desdeDerecha}
    >
      {visualPersonalizado ?? (mockup && <ServiceMockup variant={mockup} acento={acento} />)}
    </motion.div>
  );

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
        {invertido ? (
          <>
            <div className="order-2 lg:order-1">{visual}</div>
            <div className="order-1 lg:order-2">{texto}</div>
          </>
        ) : (
          <>
            {texto}
            {visual}
          </>
        )}
      </div>
    </section>
  );
}
