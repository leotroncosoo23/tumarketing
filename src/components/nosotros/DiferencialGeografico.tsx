"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Compass, MapPin } from "lucide-react";

const desdeIzquierda: Variants = {
  oculto: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const desdeDerecha: Variants = {
  oculto: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function DiferencialGeografico() {
  return (
    <section className="relative bg-zinc-900 text-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  {/* Columna Texto */}
  <motion.div
    initial="oculto"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={desdeIzquierda}
    className="text-left"
  >
    <span className="inline-flex items-center gap-2 bg-[#D4EE26]/10 border border-[#D4EE26]/30 text-[#D4EE26] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
      <Compass className="w-3.5 h-3.5" strokeWidth={2} />
      Agencia en la Patagonia
    </span>

    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-[1.1]">
      Calidad de vida. Calidad de código.
    </h2>

    <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
      Ubicados en Trevelin, Chubut, operamos lejos del ruido y la saturación de las grandes
      metrópolis. Esta tranquilidad patagónica nos da el enfoque absoluto y la claridad mental
      necesarios para construir arquitecturas de software complejas y diseñar campañas de alcance
      global. Talento boutique, resultados masivos.
    </p>
  </motion.div>

  {/* Columna Visual: radar satelital premium, con zoom sobre la Patagonia */}
  <motion.div
    initial="oculto"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={desdeDerecha}
    className="relative w-full aspect-square md:w-[500px] md:h-[500px] flex items-center justify-center mx-auto"
  >
    {/* Resplandor ambiental */}
    <div className="absolute inset-0 bg-[#D4EE26]/5 blur-[100px] pointer-events-none" />

    {/* Pantalla circular del radar: acá sí recortamos en círculo */}
    <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
      
      {/* CONTENEDOR CÁMARA (UNIFICADO): 
        Este div agrupa al mapa y al pin. Al aplicar los movimientos y escalas aquí,
        ambos elementos se transforman de manera idéntica eliminando el desfase responsive.
      */}
      <div className="absolute inset-0 scale-[1.5] md:scale-[1.8] translate-x-[15%] md:translate-x-[25%] -translate-y-[10%] md:-translate-y-[12%]">
        
        {/* Mapa de Argentina de fondo */}
        <Image
          src="/mapa-argentina.svg"
          alt="Mapa de Argentina, zona de la Patagonia"
          fill
          className="object-cover grayscale brightness-0 invert opacity-[0.15]"
        />

        {/* Pin de ubicación premium sobre Trevelin, Chubut.
          Al estar dentro del contenedor unificado, podés definir su ubicación exacta 
          con porcentajes fijos que representan su posición REAL sobre la imagen.
        */}
        <div className="absolute top-[55.5%] left-[34%] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute -inset-2.5 rounded-full border-2 border-[#D4EE26] opacity-60 animate-ping [animation-duration:3s]" />
          <MapPin className="relative w-6 h-6 text-[#D4EE26] drop-shadow-[0_0_8px_rgba(212,238,38,0.8)]" strokeWidth={2} />
        </div>

      </div>

      {/* Mira: líneas punteadas cruzando el centro (quedan fuera de la cámara para que no se deformen) */}
      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/10 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-white/10 pointer-events-none" />

      {/* Anillos concéntricos finos y punteados */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/10 pointer-events-none" />
      <div className="absolute inset-[15%] rounded-full border border-dashed border-white/10 pointer-events-none" />
      <div className="absolute inset-[30%] rounded-full border border-dashed border-white/10 pointer-events-none" />
    </div>

    {/* Coordenadas de Trevelin, Chubut: fuera del recorte circular, como el bisel del instrumento */}
    <span className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500 tracking-wider select-none">
      LAT: 43.0964° S
    </span>
    <span className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-500 tracking-wider select-none">
      LON: 71.4681° W
    </span>
  </motion.div>
</div>
    </section>
  );
}
