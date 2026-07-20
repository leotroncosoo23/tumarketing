"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/CurrencyContext";
import type { Servicio } from "@/lib/servicios";

type ContratarServicioButtonProps = {
  servicio: Pick<Servicio, "id" | "titulo" | "precio_ars" | "precio_usd" | "miniatura_url">;
};

export default function ContratarServicioButton({ servicio }: ContratarServicioButtonProps) {
  const { moneda } = useCurrency();
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    supabase
      .from("configuracion")
      .select("whatsapp_numero")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setWhatsapp(data?.whatsapp_numero || ""));
  }, []);

  const precio = moneda === "ARS" ? servicio.precio_ars : servicio.precio_usd;
  const precioTexto = `${moneda === "ARS" ? "$" : "U$D "}${Number(precio || 0).toLocaleString(moneda === "ARS" ? "es-AR" : "en-US")} ${moneda}`;

  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensaje = encodeURIComponent(
    `¡Hola! Quiero contratar el servicio de "${servicio.titulo}" (${precioTexto}) 🚀`
  );
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensaje}` : "#contacto";

  return (
    <a
      href={linkWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
    >
      Contratar <span>→</span>
    </a>
  );
}
