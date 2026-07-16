"use client";

import { motion } from "framer-motion";
import { useNewsletterForm } from "@/lib/useNewsletterForm";
import FadeInScroll from "@/components/FadeInScroll";

export default function NewsletterSection() {
  const {
    nombre, setNombre,
    email, setEmail,
    aceptaTerminos, setAceptaTerminos,
    enviando, error, exito,
    handleSubmit,
  } = useNewsletterForm();

  return (
    <section id="contacto" className="max-w-7xl mx-auto px-6 py-24">
      <FadeInScroll y={30}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 md:p-14 relative overflow-hidden">
          {/* Brillo de fondo */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* COLUMNA IZQUIERDA: Texto y formulario */}
          <div className="relative z-10">
            <span className="inline-block bg-[#ccff00] text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Newsletter Oficial
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
              Recibí novedades de Marketing Digital <span className="text-[#ccff00]">[GRATIS]</span>
            </h2>

            <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
              Unite a miles de personas que reciben todos los meses las{" "}
              <span className="text-white font-bold">últimas tendencias, ideas de negocio y nuevas herramientas</span>{" "}
              y mucha info útil para tu emprendimiento.
            </p>

            {exito ? (
              <div className="bg-[#ccff00]/10 border border-[#ccff00]/40 text-white rounded-2xl p-6">
                <p className="font-bold text-lg mb-1">¡Ya estás adentro! 🎉</p>
                <p className="text-neutral-300 text-sm">
                  Revisá tu email en los próximos días: ahí te va a llegar la primera novedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-5">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                    className="flex-1 bg-white/5 border border-neutral-800 rounded-xl px-5 py-4 text-white outline-none focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00] transition-all placeholder-neutral-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                    className="flex-1 bg-white/5 border border-neutral-800 rounded-xl px-5 py-4 text-white outline-none focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00] transition-all placeholder-neutral-500"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
                  />
                  <span className="text-sm text-neutral-400">
                    Acepto recibir noticias y los{" "}
                    <a href="/politica-de-privacidad" target="_blank" className="text-[#ccff00] hover:underline">
                      términos de privacidad
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!aceptaTerminos || enviando}
                  className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {enviando ? "Suscribiendo..." : "Suscribirme"}
                </button>
              </form>
            )}
          </div>

          {/* COLUMNA DERECHA: Imagen dentro de un círculo, con flotación infinita */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              className="relative w-full max-w-sm aspect-square rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center overflow-hidden"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/newsletter-mockup.svg"
                alt="Novedades de Marketing Digital por email"
                className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </FadeInScroll>
    </section>
  );
}
