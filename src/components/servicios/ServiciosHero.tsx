"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { METRICAS_GLOBALES } from "@/lib/casos-exito";

const fadeDesdeArriba: Variants = {
  oculto: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ESTADISTICAS = [
  { valor: "+150", etiqueta: "Marcas confían en nosotros" },
  { valor: "+4M", etiqueta: "Views generadas" },
  { valor: "+247%", etiqueta: "Crecimiento mensual" },
] as const;

export default function ServiciosHero() {
  // Mismo patrón que ContratarServicioButton/CTAContacto: el número real de
  // WhatsApp vive en "configuracion" (lo carga el equipo desde el panel), acá
  // solo lo leemos para armar el link de contacto directo.
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    supabase
      .from("configuracion")
      .select("whatsapp_numero")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setWhatsapp(data?.whatsapp_numero || ""));
  }, []);

  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensaje = encodeURIComponent("¡Hola! Quiero potenciar mi negocio con Tu Marketing 🚀");
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensaje}` : "#packs";

  return (
    <section className="relative text-white pt-16 pb-20 md:pt-20 md:pb-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4EE26]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div initial="oculto" animate="visible" variants={fadeDesdeArriba}>
          <span className="inline-flex items-center gap-2 bg-[#D4EE26]/10 border border-[#D4EE26]/30 text-[#D4EE26] font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full mb-6">
            Agencia en la Patagonia
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Tu negocio no necesita más seguidores.
            <br />
            Necesita{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4EE26] to-lime-500">
              más clientes.
            </span>
          </h1>

          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Combinamos branding, redes, publicidad y desarrollo web en una sola estrategia. Sin fórmulas genéricas:
            cada acción está pensada para convertir visitas en ventas reales.
          </p>
        </motion.div>

        <motion.div
          initial="oculto"
          animate="visible"
          variants={fadeDesdeArriba}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#D4EE26] text-black font-black text-base px-8 py-4 rounded-full hover:bg-lime-400 transition-transform hover:-translate-y-0.5 shadow-[0_0_30px_rgba(212,238,38,0.25)]"
          >
            Quiero crecer ahora
          </a>
          <a
            href="#packs"
            className="w-full sm:w-auto text-white font-bold text-base px-8 py-4 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
          >
            Ver nuestros packs ↓
          </a>
        </motion.div>

        <motion.p
          initial="oculto"
          animate="visible"
          variants={fadeDesdeArriba}
          transition={{ delay: 0.25 }}
          className="text-neutral-500 text-sm"
        >
          {METRICAS_GLOBALES.map((m) => `${m.valor} ${m.etiqueta}`).join("  ·  ")}
        </motion.p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-3 gap-6">
        {ESTADISTICAS.map((stat, i) => (
          <motion.div
            key={stat.etiqueta}
            initial="oculto"
            animate="visible"
            variants={fadeDesdeArriba}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-center"
          >
            <p className="text-3xl md:text-5xl font-black text-[#D4EE26] tracking-tight mb-1">{stat.valor}</p>
            <p className="text-neutral-500 text-[11px] md:text-sm font-bold uppercase tracking-wide">{stat.etiqueta}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
