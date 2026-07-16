"use client";

import { motion, type Variants } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

const puntosPlantillas = [
  { label: "Velocidad", texto: "Lentas por exceso de código basura y plugins." },
  { label: "Seguridad", texto: "Vulnerables a hackeos masivos." },
  { label: "Mantenimiento", texto: "Se rompen frecuentemente con cada actualización." },
  { label: "SEO", texto: "Penalizadas por Google debido a la baja velocidad." },
];

const puntosMedida = [
  { label: "Velocidad", texto: "Carga instantánea (Máxima retención de usuarios)." },
  { label: "Seguridad", texto: "Arquitectura robusta y a prueba de balas." },
  { label: "Mantenimiento", texto: "Estable a largo plazo, sin sorpresas técnicas." },
  { label: "SEO", texto: "Optimización perfecta para los motores de búsqueda." },
];

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

export default function Diferencial() {
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            ¿Por qué invertir en código a medida?
          </h2>
          <p className="text-neutral-400 text-lg">
            La diferencia entre un gasto constante y una inversión rentable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Tarjeta 1: Plantillas Genéricas */}
          <motion.div
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={desdeIzquierda}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 opacity-90"
          >
            <h3 className="text-xl font-bold mb-1">Plantillas Genéricas</h3>
            <p className="text-sm text-neutral-500 mb-6">WordPress, Wix</p>

            <ul className="space-y-5">
              {puntosPlantillas.map(({ label, texto }) => (
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

          {/* Tarjeta 2: Código a Medida (destacada) */}
          <motion.div
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={desdeDerecha}
            className="relative bg-slate-800 border border-cyan-400/40 rounded-2xl p-8 lg:scale-105 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full">
              Recomendado
            </span>

            <h3 className="text-xl font-bold mb-1">Nuestro Código</h3>
            <p className="text-sm text-cyan-400/80 mb-6">React, Next.js, SQL</p>

            <ul className="space-y-5">
              {puntosMedida.map(({ label, texto }) => (
                <li key={label} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" strokeWidth={1.75} />
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
