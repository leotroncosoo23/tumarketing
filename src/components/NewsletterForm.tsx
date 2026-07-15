"use client";

import { useState } from "react";
import { suscribirNewsletter } from "@/lib/newsletter-actions";

export default function NewsletterForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aceptaTerminos) return;

    setError("");
    setEnviando(true);

    const resultado = await suscribirNewsletter(nombre.trim(), email.trim());

    if (resultado?.error) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }

    setExito(true);
    setEnviando(false);
  };

  if (exito) {
    return (
      <div className="bg-[#ccff00]/10 border border-[#ccff00]/40 text-white rounded-2xl p-6 max-w-md">
        <p className="font-bold text-lg mb-1">¡Ya estás adentro! 🎉</p>
        <p className="text-neutral-300 text-sm">
          Revisá tu email en los próximos días: ahí te va a llegar la primera novedad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all placeholder-neutral-600"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all placeholder-neutral-600"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => setAceptaTerminos(e.target.checked)}
          className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
        />
        <span className="text-sm text-neutral-400 text-left">
          Acepto recibir novedades y los{" "}
          <a href="/politica-de-privacidad" target="_blank" className="text-[#ccff00] hover:underline">
            términos de privacidad
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={!aceptaTerminos || enviando}
        className="w-full sm:w-auto bg-[#ccff00] text-black px-8 py-4 rounded-xl font-black hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 whitespace-nowrap"
      >
        {enviando ? "Suscribiendo..." : "Suscribirme"}
      </button>
    </form>
  );
}
