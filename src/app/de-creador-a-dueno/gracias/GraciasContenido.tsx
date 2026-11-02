"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { confirmarCompraInfoproducto } from "@/app/actions/infoproducto-checkout";
import { supabase } from "@/lib/supabase";

type Estado = "confirmando" | "listo" | "error";

// El acceso (link a la carpeta de Drive) se manda por email al confirmar el pago
// (ver entrega-infoproducto.ts) y nunca se muestra en el cliente. WhatsApp queda
// como respaldo por si el email no llega.
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
    "¡Hola! Compré \"De Creador/a a Dueño/a\" 🎉 y no me llegó el email con el acceso."
  );
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensajeWhatsapp}` : "/#agendar";

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
          "¡Bienvenido/a a De Creador/a a Dueño/a! Te enviamos el acceso al sistema a tu email. Revisá también la carpeta de spam."}
        {estado === "error" && (error || "Algo no salió como esperábamos.")}
      </p>

      {estado === "listo" ? (
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-8 py-4 rounded-full font-black text-lg hover:bg-[#b8e600] transition-colors"
        >
          💬 ¿No te llegó? Escribinos por WhatsApp
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
