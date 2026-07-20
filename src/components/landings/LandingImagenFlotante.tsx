"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Acento } from "./accents";

type BadgeFlotante = {
  icon: LucideIcon;
  texto: string;
  posicion: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

type LandingImagenFlotanteProps = {
  src: string;
  alt: string;
  badges?: BadgeFlotante[];
  /** Clase de aspect ratio de Tailwind, ej. "aspect-[3/2]". Por defecto usa el ancho/alto natural. */
  aspect?: string;
  acento: Acento;
};

const posicionClases: Record<BadgeFlotante["posicion"], string> = {
  "top-left": "-top-5 -left-5",
  "top-right": "-top-5 -right-5",
  "bottom-left": "-bottom-5 -left-4",
  "bottom-right": "-bottom-5 -right-4",
};

// Mismo "cartel flotante" que usan las ilustraciones decorativas de
// ServiceMockup (glow + badges + animación), pero mostrando una imagen real
// en vez de un mockup abstracto.
export default function LandingImagenFlotante({ src, alt, badges = [], aspect = "aspect-[3/2]", acento }: LandingImagenFlotanteProps) {
  const colores = ACCENTS[acento];

  return (
    <div className="relative w-full">
      <div className={`absolute top-10 -right-10 w-64 h-64 ${colores.glow} blur-[80px] rounded-full z-0`} />
      <div className={`absolute -bottom-10 left-10 w-48 h-48 ${colores.glow} blur-[60px] rounded-full z-0`} />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative z-10"
      >
        {badges.map(({ icon: Icon, texto, posicion }) => (
          <div
            key={texto}
            className={`absolute z-20 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 ${posicionClases[posicion]}`}
          >
            <Icon className={`w-4 h-4 ${colores.text}`} />
            <span className="text-white text-xs font-bold">{texto}</span>
          </div>
        ))}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl">
          <div className={`relative w-full ${aspect} rounded-2xl overflow-hidden`}>
            <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
