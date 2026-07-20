"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";
import { METRICAS_GLOBALES, CASOS_EXITO, type CasoExitoId } from "@/lib/casos-exito";
import { ACCENTS, type Acento } from "./accents";

type LandingSocialProofCasosProps = {
  titulo: string;
  subtitulo: string;
  casos: CasoExitoId[];
  acento: Acento;
};

// Casos reales (misma fuente que la home y /nosotros): foto, métrica y
// descripción reales de clientes de la agencia — no testimonios inventados.
export default function LandingSocialProofCasos({ titulo, subtitulo, casos, acento }: LandingSocialProofCasosProps) {
  const colores = ACCENTS[acento];
  const resultados = CASOS_EXITO.filter((caso) => casos.includes(caso.id));

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInScroll className="text-center max-w-2xl mx-auto mb-14">
          <span className={`inline-flex items-center gap-2 ${colores.text} font-bold tracking-widest uppercase mb-4 text-sm`}>
            <span className={`w-2 h-2 rounded-full ${colores.badgeBg} animate-pulse`} />
            Resultados reales
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">{titulo}</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">{subtitulo}</p>
        </FadeInScroll>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {METRICAS_GLOBALES.map((metrica, i) => (
            <FadeInScroll key={metrica.etiqueta} delay={0.1 + i * 0.15}>
              <div className="text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl py-8 px-6">
                <p className={`text-4xl md:text-5xl font-black mb-2 tracking-tight ${colores.text}`}>{metrica.valor}</p>
                <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">{metrica.etiqueta}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>

        <div
          className={`grid grid-cols-1 gap-6 mx-auto ${
            resultados.length === 1
              ? "max-w-md"
              : resultados.length === 2
                ? "sm:grid-cols-2 max-w-3xl"
                : "md:grid-cols-3 max-w-none"
          }`}
        >
          {resultados.map((resultado, i) => (
            <FadeInScroll key={resultado.id} delay={0.1 + i * 0.15}>
              <div className={`h-full bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-md ${colores.cardBorderHover} transition-all duration-300 flex flex-col`}>
                <div className="relative h-48 overflow-hidden bg-neutral-800">
                  <Image
                    src={resultado.imagen}
                    alt={resultado.etiqueta}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className={`flex gap-0.5 mb-3 ${colores.text}`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-2xl font-black text-white mb-1 tracking-tight">{resultado.numero}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${colores.text}`}>{resultado.etiqueta}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed flex-grow">{resultado.descripcion}</p>
                </div>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
