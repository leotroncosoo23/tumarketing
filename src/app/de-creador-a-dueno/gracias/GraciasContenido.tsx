"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { confirmarCompraInfoproducto, confirmarPagoMercadoPagoInfoproducto } from "@/app/actions/infoproducto-checkout";
import { supabase } from "@/lib/supabase";

type Estado = "confirmando" | "listo" | "pendiente" | "error";

// El acceso (link a la carpeta de Drive) se manda por email al confirmar el pago
// (ver entrega-infoproducto.ts) y nunca se muestra en el cliente. WhatsApp queda
// como respaldo por si el email no llega.
export default function GraciasContenido() {
  const searchParams = useSearchParams();
  // PayPal vuelve con ?token=<orden> y Mercado Pago con ?payment_id=<pago>
  // ("null" si el comprador canceló antes de pagar).
  const ordenPayPal = searchParams.get("token");
  const pagoMercadoPago = searchParams.get("payment_id");
  const idMercadoPago = pagoMercadoPago && pagoMercadoPago !== "null" ? pagoMercadoPago : null;
  const hayPago = Boolean(ordenPayPal || idMercadoPago);

  const [estado, setEstado] = useState<Estado>(hayPago ? "confirmando" : "error");
  const [error, setError] = useState<string | null>(
    hayPago ? null : "No pudimos confirmar el pago desde acá. Si ya pagaste, escribinos y lo revisamos a mano."
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
    if (!ordenPayPal && !idMercadoPago) return;
    const confirmar = idMercadoPago
      ? confirmarPagoMercadoPagoInfoproducto(idMercadoPago)
      : confirmarCompraInfoproducto(ordenPayPal!);

    confirmar.then((resultado) => {
      if (resultado.ok) {
        setEstado("listo");
      } else if ("pendiente" in resultado && resultado.pendiente) {
        setEstado("pendiente");
      } else {
        setEstado("error");
        setError(resultado.error);
      }
    });
  }, [ordenPayPal, idMercadoPago]);

  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensajeWhatsapp = encodeURIComponent(
    "¡Hola! Compré \"De Creador/a a Dueño/a\" 🎉 y no me llegó el email con el acceso."
  );
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensajeWhatsapp}` : "/#agendar";

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">{estado === "error" ? "⚠️" : estado === "pendiente" ? "⏳" : "🎉"}</div>
      <h1 className="text-3xl font-black mb-4">
        {estado === "confirmando" && "Confirmando tu pago..."}
        {estado === "listo" && "¡Pago confirmado!"}
        {estado === "pendiente" && "Tu pago está pendiente"}
        {estado === "error" && "No pudimos confirmar tu pago"}
      </h1>
      <p className="text-neutral-400 mb-10">
        {estado === "confirmando" && "Estamos verificando tu pago, esperá un momento."}
        {estado === "listo" &&
          "¡Bienvenido/a a De Creador/a a Dueño/a! Te enviamos el acceso al sistema a tu email. Revisá también la carpeta de spam."}
        {estado === "pendiente" &&
          "Apenas se acredite te enviamos el acceso a tu email, no hace falta que hagas nada más. Si pagaste en efectivo, puede tardar unas horas."}
        {estado === "error" && (error || "Algo no salió como esperábamos.")}
      </p>

      {estado === "listo" || estado === "pendiente" ? (
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
