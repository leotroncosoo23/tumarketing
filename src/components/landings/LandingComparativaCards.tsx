"use client";

import { motion, type Variants } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

export type EstadoComparativa = "si" | "parcial" | "no";

type TarjetaComparativa = {
  nombre: string;
  subtitulo: string;
  destacada?: boolean;
  items: { label: string; estado: EstadoComparativa }[];
};

type LandingComparativaCardsProps = {
  titulo: string;
  subtitulo: string;
  tarjetas: TarjetaComparativa[];
  acento: Acento;
};

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Estado({ valor }: { valor: EstadoComparativa }) {
  if (valor === "si") return <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.5} />;
  if (valor === "parcial") return <Minus className="w-4 h-4 text-neutral-500 shrink-0" strokeWidth={2.5} />;
  return <X className="w-4 h-4 text-red-400/70 shrink-0" strokeWidth={2.5} />;
}

export default function LandingComparativaCards({ titulo, subtitulo, tarjetas, acento }: LandingComparativaCardsProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={contenedor}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {tarjetas.map((tarjeta) => (
            <motion.div
              key={tarjeta.nombre}
              variants={item}
              className={`relative rounded-3xl p-7 border shadow-2xl ${
                tarjeta.destacada ? `bg-neutral-900 ${colores.border} md:scale-105` : "bg-neutral-900/40 border-neutral-800 shadow-none"
              }`}
            >
              {tarjeta.destacada && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${colores.badgeBg} text-black text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full`}>
                  Recomendado
                </span>
              )}

              <h3 className="text-lg font-bold mb-1">{tarjeta.nombre}</h3>
              <p className="text-neutral-500 text-sm mb-6">{tarjeta.subtitulo}</p>

              <ul className="space-y-3.5">
                {tarjeta.items.map(({ label, estado }) => (
                  <li key={label} className="flex items-start gap-2.5 text-sm">
                    <Estado valor={estado} />
                    <span className={estado === "no" ? "text-neutral-500" : "text-neutral-300"}>{label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
