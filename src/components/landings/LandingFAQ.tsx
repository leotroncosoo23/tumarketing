"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ACCENTS, type Acento } from "./accents";

type Faq = { pregunta: string; respuesta: string };

type LandingFAQProps = {
  titulo: string;
  subtitulo: string;
  items: Faq[];
  acento: Acento;
};

export default function LandingFAQ({ titulo, subtitulo, items, acento }: LandingFAQProps) {
  const [abiertoIndex, setAbiertoIndex] = useState<number | null>(0);
  const colores = ACCENTS[acento];

  const toggle = (i: number) => {
    setAbiertoIndex((actual) => (actual === i ? null : i));
  };

  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">{titulo}</h2>
          <p className="text-neutral-400 text-lg">{subtitulo}</p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((faq, i) => {
            const abierto = abiertoIndex === i;

            return (
              <div
                key={faq.pregunta}
                className={`bg-neutral-900/40 border rounded-2xl transition-colors duration-300 ${
                  abierto ? `bg-neutral-900/80 ${colores.border}` : "border-neutral-800"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={abierto}
                  className="w-full flex justify-between items-center gap-4 font-bold cursor-pointer p-6 text-lg text-white text-left"
                >
                  {faq.pregunta}
                  <span
                    className={`transition-transform duration-300 shrink-0 ${colores.text} ${abierto ? "rotate-180" : ""}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: abierto ? "auto" : 0, opacity: abierto ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-1">
                    {faq.respuesta}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
