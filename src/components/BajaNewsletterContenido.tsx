"use client";

import { useState } from "react";
import Link from "next/link";
import { confirmarBajaNewsletter, reactivarSuscripcion } from "@/app/actions/newsletter-baja";

type Estado = "confirmar" | "procesando" | "hecho" | "reactivando" | "reactivado" | "error";

export default function BajaNewsletterContenido({ email, token }: { email: string; token: string }) {
  const [estado, setEstado] = useState<Estado>("confirmar");
  const [error, setError] = useState("");

  const handleConfirmar = async () => {
    setEstado("procesando");
    const resultado = await confirmarBajaNewsletter(email, token);
    if (!resultado.ok) {
      setError(resultado.error);
      setEstado("error");
      return;
    }
    setEstado("hecho");
  };

  const handleReactivar = async () => {
    setEstado("reactivando");
    const resultado = await reactivarSuscripcion(email, token);
    if (!resultado.ok) {
      setError(resultado.error);
      setEstado("error");
      return;
    }
    setEstado("reactivado");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      {estado === "confirmar" && (
        <>
          <h1 className="text-2xl font-black mb-3">¿Dar de baja tu suscripción?</h1>
          <p className="text-neutral-400 mb-8">
            Dejarías de recibir novedades de blog y servicios en{" "}
            <span className="text-white font-semibold">{email}</span>.
          </p>
          <button
            onClick={handleConfirmar}
            className="w-full bg-[#ccff00] text-black font-black py-3.5 rounded-xl hover:bg-[#b8e600] transition-colors mb-3"
          >
            Sí, darme de baja
          </button>
          <Link href="/" className="text-neutral-500 hover:text-white text-sm">
            No, seguir recibiendo novedades
          </Link>
        </>
      )}

      {estado === "procesando" && <p className="text-neutral-400">Procesando...</p>}

      {estado === "hecho" && (
        <>
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-2xl font-black mb-3">Listo, ya no vas a recibir más novedades</h1>
          <p className="text-neutral-400 mb-8">
            Tu email <span className="text-white font-semibold">{email}</span> fue dado de baja del newsletter.
          </p>
          <button
            onClick={handleReactivar}
            className="text-[#ccff00] hover:underline text-sm font-semibold"
          >
            Me arrepentí, quiero seguir recibiendo novedades
          </button>
        </>
      )}

      {estado === "reactivando" && <p className="text-neutral-400">Reactivando...</p>}

      {estado === "reactivado" && (
        <>
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-black mb-3">¡Listo, estás de vuelta!</h1>
          <p className="text-neutral-400">
            <span className="text-white font-semibold">{email}</span> vuelve a recibir nuestras novedades.
          </p>
        </>
      )}

      {estado === "error" && (
        <>
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black mb-3">No pudimos procesarlo</h1>
          <p className="text-neutral-400">{error}</p>
        </>
      )}
    </div>
  );
}
