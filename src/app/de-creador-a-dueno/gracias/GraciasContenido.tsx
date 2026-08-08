"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { confirmarCompraInfoproducto } from "@/app/actions/infoproducto-checkout";
import { supabase } from "@/lib/supabase";

type Estado = "confirmando" | "listo" | "error";

// El material todavía no tiene entrega automática (no hay portal ni email con
// el link de descarga armado para este infoproducto puntual) — por eso, una
// vez confirmado el pago, se ofrece WhatsApp para recibirlo al toque. Es el
// mismo criterio honesto que ya usamos en /links para los lead magnets: nunca
// prometemos una entrega automática que todavía no existe.
export default function GraciasContenido() {
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("token");

  const [estado, setEstado] = useState<Estado>(ordenId ? "confirmando" : "error");
  const [error, setError] = useState<string | null>(
    ordenId ? null : "No pudimos confirmar el pago desde acá. Si ya pagaste, escribinos y lo revisamos a mano."
  );
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    supabase
      .from("configuracion")
      .select("whatsapp_numero")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setWhatsapp(data?.whatsapp_numero || ""));
  }, []);

  useEffect(() => {
    if (!ordenId) return;
    confirmarCompraInfoproducto(ordenId).then((resultado) => {
      if (!resultado.ok) {
        setEstado("error");
        setError(resultado.error);
        return;
      }
      setEstado("listo");
    });
  }, [ordenId]);

  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensajeWhatsapp = encodeURIComponent(
    "¡Hola! Acabo de comprar \"De Creador/a a Dueño/a\" 🎉 Quiero recibir el acceso al sistema."
  );
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensajeWhatsapp}` : "/servicios#contacto";

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">{estado === "error" ? "⚠️" : "🎉"}</div>
      <h1 className="text-3xl font-black mb-4">
        {estado === "confirmando" && "Confirmando tu pago..."}
        {estado === "listo" && "¡Pago confirmado!"}
        {estado === "error" && "No pudimos confirmar tu pago"}
      </h1>
      <p className="text-neutral-400 mb-10">
        {estado === "confirmando" && "Ya recibimos la aprobación de PayPal, estamos verificando el pago."}
        {estado === "listo" &&
          "¡Bienvenido/a a De Creador/a a Dueño/a! Tocá el botón de abajo para que te mandemos el acceso a tu sistema por WhatsApp al instante."}
        {estado === "error" && (error || "Algo no salió como esperábamos.")}
      </p>

      {estado === "listo" ? (
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-8 py-4 rounded-full font-black text-lg hover:bg-[#b8e600] transition-colors"
        >
          💬 Recibir mi acceso por WhatsApp
        </a>
      ) : (
        <Link
          href="/de-creador-a-dueno"
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-8 py-4 rounded-full font-black text-lg hover:bg-[#b8e600] transition-colors"
        >
          Volver a la landing
        </Link>
      )}
    </div>
  );
}
