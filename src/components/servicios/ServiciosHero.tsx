"use client";

import { motion, type Variants } from "framer-motion";
import { Search } from "lucide-react";
import { CATEGORIAS_SERVICIOS } from "@/lib/servicios";

const CATEGORIAS = ["Todos", ...CATEGORIAS_SERVICIOS];

const fadeDesdeArriba: Variants = {
  oculto: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

type ServiciosHeroProps = {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoriaActiva: string;
  onCategoriaChange: (categoria: string) => void;
};

export default function ServiciosHero({
  busqueda,
  onBusquedaChange,
  categoriaActiva,
  onCategoriaChange,
}: ServiciosHeroProps) {
  return (
    <section className="relative text-white py-16 md:py-20 px-6 overflow-hidden">
      {/* Resplandor flúor detrás del título */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4EE26]/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div initial="oculto" animate="visible" variants={fadeDesdeArriba}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Catálogo de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4EE26] to-lime-500">
              Soluciones Digitales
            </span>
          </h1>
          <p className="text-neutral-400 text-lg mb-10">
            Encontrá el servicio exacto que tu marca necesita para escalar. Desde campañas de pauta hasta
            desarrollo a medida.
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          animate="visible"
          variants={fadeDesdeArriba}
          transition={{ delay: 0.15 }}
          className="relative max-w-xl mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar servicio (ej: Meta Ads, Landing Page...)"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-12 pr-5 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4EE26]/60 focus:border-[#D4EE26]/60 transition-all duration-300"
          />
        </motion.div>

        <motion.div
          initial="oculto"
          animate="visible"
          variants={fadeDesdeArriba}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {CATEGORIAS.map((categoria) => (
            <button
              key={categoria}
              onClick={() => onCategoriaChange(categoria)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${
                categoriaActiva === categoria
                  ? "bg-[#D4EE26] text-black"
                  : "bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              {categoria}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
