"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const FAQS = [
  {
    pregunta: "¿Cómo es el proceso una vez que contrato un servicio?",
    respuesta:
      "Al confirmar tu pago, el sistema te creará automáticamente un usuario en nuestro Panel de Cliente exclusivo. Desde ahí vas a poder cargar toda la información de tu negocio de forma segura, completar el onboarding con nuestro equipo y monitorear en tiempo real el rendimiento de tu campaña o el progreso exacto de tu desarrollo. Todo centralizado y transparente.",
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta:
      "Trabajamos con las pasarelas más seguras del mercado. Para clientes dentro de Argentina, operamos con MercadoPago, permitiendo pagos con saldo, débito o tarjetas de crédito (aprovechando las cuotas disponibles). Para clientes internacionales, los pagos se procesan de forma 100% segura a través de PayPal.",
  },
  {
    pregunta: "¿Por qué puedo ver los precios en pesos y en dólares?",
    respuesta:
      "Porque brindamos soluciones tecnológicas y de marketing tanto a empresas locales como al exterior. Usando el selector de moneda de nuestra web, no solo cambian los precios, sino que el sistema ajusta automáticamente la pasarela de pago (MercadoPago o PayPal) para que abones en tu moneda local sin sorpresas ni comisiones ocultas.",
  },
  {
    pregunta: "¿Puedo pedir ajustes después de la entrega?",
    respuesta:
      "Absolutamente. Nuestro objetivo es que el sistema o la campaña supere tus expectativas. Dependiendo del servicio contratado, establecemos instancias de revisión detalladas durante el desarrollo y garantizamos ajustes finales dentro del alcance definido en la etapa de onboarding.",
  },
  {
    pregunta: "¿Trabajan con clientes de otros países?",
    respuesta:
      "¡Por supuesto! Aunque nuestras raíces y nuestro equipo base están en la Patagonia, trabajamos con marcas de toda Latinoamérica y del exterior. Ya sea gestionando tus campañas de pauta o construyendo tu plataforma a medida, nuestro Panel de Cliente y sistema de comunicación asincrónica nos permiten trabajar en diferentes zonas horarias sin fricciones.",
  },
];

export default function FAQAcordeon() {
  const [abiertoIndex, setAbiertoIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setAbiertoIndex((actual) => (actual === i ? null : i));
  };

  return (
    <div className="flex flex-col gap-4">
      {FAQS.map((faq, i) => {
        const abierto = abiertoIndex === i;

        return (
          <div
            key={i}
            className={`bg-neutral-900/40 border rounded-2xl transition-colors duration-300 ${
              abierto ? "bg-neutral-900/80 border-[#D4EE26]/50" : "border-neutral-800"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={abierto}
              className="w-full flex justify-between items-center gap-4 font-bold cursor-pointer p-6 text-lg text-white text-left"
            >
              {faq.pregunta}
              <span
                className={`transition-transform duration-300 text-[#D4EE26] shrink-0 ${
                  abierto ? "rotate-180" : ""
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: abierto ? "auto" : 0, opacity: abierto ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-1">
                {faq.respuesta}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
