"use client";

import { motion, type Variants } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

export type EstadoComparativa = "si" | "parcial" | "no";

type FilaComparativa = {
  label: string;
  nosotros: EstadoComparativa;
  freelancer: EstadoComparativa;
  vosMismo: EstadoComparativa;
};

type LandingComparativaTablaProps = {
  titulo: string;
  subtitulo: string;
  columnaNosotros: string;
  filas: FilaComparativa[];
  acento: Acento;
};

const fadeUp: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Estado({ valor }: { valor: EstadoComparativa }) {
  if (valor === "si") return <Check className="w-5 h-5 text-emerald-400 mx-auto" strokeWidth={2.5} />;
  if (valor === "parcial") return <Minus className="w-5 h-5 text-neutral-500 mx-auto" strokeWidth={2.5} />;
  return <X className="w-5 h-5 text-red-400/70 mx-auto" strokeWidth={2.5} />;
}

export default function LandingComparativaTabla({
  titulo,
  subtitulo,
  columnaNosotros,
  filas,
  acento,
}: LandingComparativaTablaProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </motion.div>

        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-neutral-500 pb-4 pl-2">Incluye</th>
                <th className={`text-center text-sm font-black pb-4 px-3 ${colores.text}`}>{columnaNosotros}</th>
                <th className="text-center text-sm font-bold text-neutral-400 pb-4 px-3">Freelancer</th>
                <th className="text-center text-sm font-bold text-neutral-400 pb-4 px-3">Hacerlo vos mismo</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={fila.label} className={i % 2 === 0 ? "bg-neutral-900/30" : ""}>
                  <td className="text-sm text-neutral-300 py-4 pl-2 rounded-l-xl">{fila.label}</td>
                  <td className={`text-center py-4 px-3 ${colores.bg}`}>
                    <Estado valor={fila.nosotros} />
                  </td>
                  <td className="text-center py-4 px-3">
                    <Estado valor={fila.freelancer} />
                  </td>
                  <td className="text-center py-4 px-3 rounded-r-xl">
                    <Estado valor={fila.vosMismo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-neutral-600 text-xs mt-6">
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Incluido
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-neutral-500" />
            Depende del profesional
          </span>
          <span className="inline-flex items-center gap-1.5">
            <X className="w-3.5 h-3.5 text-red-400/70" />
            No incluido
          </span>
        </div>
      </div>
    </section>
  );
}
