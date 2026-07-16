"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Cpu } from "lucide-react";

const skills = ["React", "Next.js", "Node.js", "SQL"];

const desdeIzquierda: Variants = {
  oculto: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const desdeDerecha: Variants = {
  oculto: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
};

export default function PerfilLider() {
  return (
    <section className="relative bg-slate-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Columna Izquierda: Foto */}
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={desdeIzquierda}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-6 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <Image
              src="/leotroncoso.jpg"
              alt="Leonardo Troncoso, Líder de Desarrollo"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Columna Derecha: Texto */}
        <motion.div
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={desdeDerecha}
          className="text-left"
        >
          <span className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <Cpu className="w-3.5 h-3.5" strokeWidth={2} />
            Liderazgo técnico
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-8 leading-[1.1]">
            Código limpio, arquitecturas que escalan.
          </h2>

          <p className="text-2xl font-bold text-white mb-1">Leonardo Troncoso</p>
          <p className="text-cyan-400 font-medium mb-6">
            Líder de Desarrollo / Analista Programador Universitario
          </p>

          <p className="text-neutral-400 leading-relaxed mb-8">
            Nuestra área tecnológica no improvisa. Combinamos sólida formación académica universitaria
            con el dominio de tecnologías Full Stack de vanguardia. Nos aseguramos de que la plataforma
            de tu empresa esté construida con bases de datos robustas y código eficiente, para que no
            solo rinda al máximo hoy, sino que soporte todo el crecimiento de tu negocio mañana.
          </p>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 bg-slate-900 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-neutral-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
