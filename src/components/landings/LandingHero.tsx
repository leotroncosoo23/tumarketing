"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import FadeInScroll from "@/components/FadeInScroll";
import ServiceMockup, { type MockupVariant } from "./ServiceMockup";
import { ACCENTS, type Acento } from "./accents";

type LandingHeroProps = {
  kicker: string;
  tituloPre: string;
  tituloDestacado: string;
  tituloPost?: string;
  subtitulo: string;
  ctaLabel: string;
  ctaHref: string;
  acento: Acento;
  /** Si se pasa, el hero se parte en dos columnas con esta ilustración a la derecha. */
  mockup?: MockupVariant;
  /** Reemplaza el mockup decorativo por contenido propio (ej. una imagen real). */
  visual?: ReactNode;
};

export default function LandingHero({
  kicker,
  tituloPre,
  tituloDestacado,
  tituloPost,
  subtitulo,
  ctaLabel,
  ctaHref,
  acento,
  mockup,
  visual: visualPersonalizado,
}: LandingHeroProps) {
  const colores = ACCENTS[acento];
  const tieneVisual = Boolean(mockup || visualPersonalizado);

  const encabezado = (
    <>
      <FadeInScroll y={16}>
        <span className={`inline-flex items-center gap-2 ${colores.bg} border ${colores.borderSoft} ${colores.text} text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6`}>
          {kicker}
        </span>
      </FadeInScroll>

      <FadeInScroll y={20} delay={0.05}>
        <h1 className={`font-black leading-[1.05] tracking-tight mb-6 ${tieneVisual ? "text-4xl md:text-5xl lg:text-6xl" : "text-4xl md:text-6xl lg:text-7xl"}`}>
          {tituloPre}{" "}
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colores.gradientFrom} to-white`}>
            {tituloDestacado}
          </span>
          {tituloPost ? ` ${tituloPost}` : ""}
        </h1>
      </FadeInScroll>

      <FadeInScroll y={20} delay={0.15}>
        <p className={`text-neutral-400 text-lg md:text-xl mb-10 leading-relaxed ${tieneVisual ? "" : "max-w-2xl mx-auto"}`}>
          {subtitulo}
        </p>
      </FadeInScroll>

      <FadeInScroll y={20} delay={0.3}>
        <Link
          href={ctaHref}
          className="inline-block bg-[#ccff00] text-black px-10 py-5 rounded-full font-black text-lg shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:shadow-[0_0_45px_rgba(204,255,0,0.55)] hover:scale-105 transition-all duration-300"
        >
          {ctaLabel}
        </Link>
      </FadeInScroll>
    </>
  );

  return (
    <section className="relative min-h-0 md:min-h-[85vh] flex items-center justify-center bg-neutral-950 text-white">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${colores.heroGlow} blur-[140px] rounded-full pointer-events-none`} />

      {tieneVisual ? (
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">{encabezado}</div>
          <FadeInScroll y={20} delay={0.2} className="hidden lg:block">
            {visualPersonalizado ?? (mockup && <ServiceMockup variant={mockup} acento={acento} />)}
          </FadeInScroll>
        </div>
      ) : (
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-10 md:py-32">{encabezado}</div>
      )}
    </section>
  );
}
