"use client";

import type { LucideIcon } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";
import { METRICAS_GLOBALES } from "@/lib/casos-exito";
import { ACCENTS, type Acento } from "./accents";

type Credencial = {
  icon: LucideIcon;
  titulo: string;
  texto: string;
};

type LandingSocialProofTecnicoProps = {
  titulo: string;
  subtitulo: string;
  credenciales: Credencial[];
  acento: Acento;
};

// A diferencia de las landings de Redes Sociales (que muestran casos con foto
// y métrica de un cliente puntual), acá no hay casos de software documentados
// todavía: en vez de inventar números de proyectos, mostramos las métricas
// globales reales de la agencia + credenciales técnicas verificables.
export default function LandingSocialProofTecnico({
  titulo,
  subtitulo,
  credenciales,
  acento,
}: LandingSocialProofTecnicoProps) {
  const colores = ACCENTS[acento];

  return (
    <section className="relative bg-neutral-950 text-white py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInScroll className="text-center max-w-2xl mx-auto mb-14">
          <span className={`inline-flex items-center gap-2 ${colores.text} font-bold tracking-widest uppercase mb-4 text-sm`}>
            <span className={`w-2 h-2 rounded-full ${colores.badgeBg} animate-pulse`} />
            Por qué confiar en nosotros
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {credenciales.map(({ icon: Icon, titulo: credTitulo, texto }, i) => (
            <FadeInScroll key={credTitulo} delay={0.1 + i * 0.15}>
              <div className="h-full bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
                <span className={`inline-flex w-11 h-11 rounded-xl ${colores.bg} border ${colores.borderSoft} ${colores.text} items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <p className="text-white font-bold mb-2">{credTitulo}</p>
                <p className="text-neutral-400 text-sm leading-relaxed">{texto}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
