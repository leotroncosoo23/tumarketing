"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const fundadores = [
  {
    nombre: "Natasha",
    cargo: "Co-fundadora & Directora de Marketing Digital",
    bio: "Especialista en adquisición de tráfico, pauta digital y optimización de conversión. Su enfoque está en entender la psicología del consumidor para diseñar estrategias y campañas de alto impacto que multiplican las ventas.",
    skills: ["Meta Ads", "Google Ads", "Branding", "CRO", "Estrategia Comercial"],
    imagen: "/natasha-nosotros.png",
  },
  {
    nombre: "Leonardo",
    cargo: "Líder Técnico (Analista Programador Universitario - UNPSJB)",
    bio: "Enfocado en el desarrollo Full Stack y la escalabilidad. Se encarga de diseñar la arquitectura, estructurar bases de datos y escribir código limpio para que el motor de cada proyecto rinda al máximo sin limitaciones técnicas.",
    skills: ["React", "Next.js", "Node.js", "SQL", "Arquitectura de Software"],
    imagen: "/leo-nosotros.png",
  },
];

const desdeIzquierda: Variants = {
  oculto: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const desdeDerecha: Variants = {
  oculto: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Fundadores() {
  return (
    <section className="relative bg-zinc-950 text-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            Marketing y código, hechos para <span className="text-[#D4EE26]">escalar</span>.
          </h2>
          <p className="text-zinc-400 text-lg">
            La fusión perfecta entre visión comercial y arquitectura tecnológica robusta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {fundadores.map((fundador, i) => (
            <motion.div
              key={fundador.nombre}
              initial="oculto"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={i === 0 ? desdeIzquierda : desdeDerecha}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8"
            >
              <div className="relative aspect-square rounded-2xl mb-6 overflow-hidden bg-zinc-800">
                <Image
                  src={fundador.imagen}
                  alt={fundador.nombre}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover object-top"
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{fundador.nombre}</h3>
              <p className="text-[#D4EE26] font-medium mb-4">{fundador.cargo}</p>
              <p className="text-zinc-400 leading-relaxed mb-6">{fundador.bio}</p>

              <div className="flex flex-wrap gap-2">
                {fundador.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
