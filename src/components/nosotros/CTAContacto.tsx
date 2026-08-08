"use client";

import { useState } from "react";
import { motion, useMotionValue, useMotionTemplate, type Variants } from "framer-motion";

// Calendario real de asesoría de crecimiento (Cal.com). Antes este botón
// abría WhatsApp; ahora agenda directo, sin ida y vuelta de mensajes.
const LINK_CALENDARIO = "https://cal.com/natasha-hqosbf/15min";

const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function CTAContacto() {
  const [posBoton, setPosBoton] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(212,238,38,0.15), transparent 80%)`;

  const manejarMovimientoTarjeta = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const manejarMovimientoBoton = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosBoton({ x: x * 0.35, y: y * 0.35 });
  };

  const resetearBoton = () => setPosBoton({ x: 0, y: 0 });

  return (
    <section
      data-oculta-whatsapp-flotante
      className="relative bg-zinc-950 text-white py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Patrón de grilla geométrico, muy sutil */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <motion.div
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={contenedor}
        onMouseMove={manejarMovimientoTarjeta}
        className="group relative max-w-4xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl px-6 py-16 md:py-24 text-center overflow-hidden"
      >
        {/* Glows difuminados en las esquinas */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D4EE26]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D4EE26]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Borde dinámico que sigue al mouse (spotlight) */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{ background: spotlight }}
        />

        <div className="relative z-10">
          <motion.h2 variants={item} className="text-5xl md:text-7xl tracking-tighter mb-6 leading-[1.05]">
            {/* Cada línea lleva su propio gradiente: si el filter (drop-shadow) de la línea 2
                quedara en un hijo de un único bg-clip-text compartido, Chromium aísla ese hijo
                en una capa de pintado propia y el clipping del texto del padre se rompe (queda
                invisible). Con el gradiente aplicado en el mismo elemento que el filter, no hay
                conflicto. */}
            <span className="block font-light bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Es hora.
            </span>
            <span className="block font-black bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-[#D4EE26] drop-shadow-[0_0_15px_rgba(212,238,38,0.3)]">
               escalemos tu negocio
            </span>
          </motion.h2>

          <motion.p variants={item} className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12">
            Tu departamento externo de crecimiento y tecnología está a un clic de distancia.
          </motion.p>

          <motion.div variants={item}>
            <motion.a
              href={LINK_CALENDARIO}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={manejarMovimientoBoton}
              onMouseLeave={resetearBoton}
              animate={{ x: posBoton.x, y: posBoton.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
              className="group/boton relative inline-flex items-center gap-3 bg-[#D4EE26] text-black font-extrabold text-lg px-10 py-5 rounded-full"
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-[#D4EE26] blur-2xl opacity-0 group-hover/boton:opacity-70 scale-125 transition-opacity duration-500" />
              Agendá tu asesoría de crecimiento
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
