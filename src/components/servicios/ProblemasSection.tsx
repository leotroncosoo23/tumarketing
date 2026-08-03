"use client";

import { Heart, Flame, Siren } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";

const PROBLEMAS = [
  {
    icono: Heart,
    titulo: "Likes que no pagan las cuentas",
    texto: "Tenés miles de seguidores e interacciones, pero al cerrar el mes las ventas no reflejan ese esfuerzo.",
  },
  {
    icono: Flame,
    titulo: "Presupuesto quemado en anuncios",
    texto: "Invertís en publicidad todos los meses, pero no sabés bien qué campaña te está trayendo clientes reales.",
  },
  {
    icono: Siren,
    titulo: "Apagando incendios todo el día",
    texto: "Entre responder mensajes y resolver el día a día, nunca te queda tiempo para pensar una estrategia real.",
  },
];

export default function ProblemasSection() {
  return (
    <section className="relative text-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInScroll className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            ¿Tu negocio no está creciendo? No es suerte, es estrategia.
          </h2>
          <p className="text-neutral-400 text-lg">
            Si te identificás con alguna de estas situaciones, no estás solo — y tiene solución.
          </p>
        </FadeInScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEMAS.map(({ icono: Icono, titulo, texto }, i) => (
            <FadeInScroll key={titulo} delay={i * 0.1}>
              <div className="h-full bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-[#D4EE26]/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#D4EE26]/10 border border-[#D4EE26]/30 flex items-center justify-center mb-5">
                  <Icono className="w-5 h-5 text-[#D4EE26]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold mb-2">{titulo}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{texto}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
