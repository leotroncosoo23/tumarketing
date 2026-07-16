"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";

const contenedor: Variants = {
  oculto: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function CierreCTA() {
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
  const mensaje = encodeURIComponent(
    "¡Hola! Quiero agendar una consultoría gratuita de 15 minutos para mi proyecto de software 🚀"
  );
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensaje}` : "#contacto";

  return (
    <section
      id="cotizar"
      data-oculta-whatsapp-flotante
      className="relative bg-slate-950 text-white py-24 md:py-32 px-6 overflow-hidden scroll-mt-24"
    >
      <motion.div
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={contenedor}
        className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.08)] py-20 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-[1.15] max-w-2xl mx-auto">
          ¿Listo para llevar tu empresa al siguiente nivel tecnológico?
        </h2>

        <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Agendá una consultoría gratuita de 15 minutos. Contanos qué problema tiene tu negocio y te
          armamos la arquitectura exacta del sistema que necesitas para resolverlo.
        </p>

        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-black font-black text-lg px-10 py-5 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Chatear con el Líder Técnico
        </a>
      </motion.div>
    </section>
  );
}
