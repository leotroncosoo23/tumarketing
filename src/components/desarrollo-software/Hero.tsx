"use client";

import Link from "next/link";
import FadeInScroll from "@/components/FadeInScroll";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {/* Patrón de grilla sutil, desvanecido hacia los bordes */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Resplandor radial central */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ccff00]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
        <FadeInScroll y={20}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Desarrollo de Software y Aplicaciones Web{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              a Medida
            </span>
            .
          </h1>
        </FadeInScroll>

        <FadeInScroll y={20} delay={0.15}>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            No usamos plantillas lentas. Programamos plataformas de alto rendimiento para automatizar tu negocio y
            escalar tus ventas sin límites técnicos.
          </p>
        </FadeInScroll>

        <FadeInScroll y={20} delay={0.3}>
          <Link
            href="#cotizar"
            className="inline-block bg-[#ccff00] text-black px-10 py-5 rounded-full font-black text-lg shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:shadow-[0_0_45px_rgba(204,255,0,0.55)] hover:scale-105 transition-all duration-300"
          >
            Cotizar mi proyecto
          </Link>
        </FadeInScroll>
      </div>
    </section>
  );
}
