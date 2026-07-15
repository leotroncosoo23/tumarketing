"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/CartContext";

const CONTENIDO_POR_ESTADO = {
  approved: {
    titulo: "¡Pago aprobado!",
    mensaje: "Ya recibimos tu pago. En breve vas a tener acceso desde tu plataforma.",
    icono: "✅",
  },
  pending: {
    titulo: "Pago pendiente",
    mensaje: "Tu pago está siendo procesado. Te avisamos apenas se confirme.",
    icono: "⏳",
  },
  rejected: {
    titulo: "No pudimos procesar el pago",
    mensaje: "El pago fue rechazado. Podés volver a intentarlo desde tu carrito.",
    icono: "❌",
  },
} as const;

export default function EstadoPagoContenido() {
  const searchParams = useSearchParams();
  const { vaciarCarrito } = useCart();

  const status = searchParams.get("status") ?? searchParams.get("collection_status");
  const contenido = CONTENIDO_POR_ESTADO[status as keyof typeof CONTENIDO_POR_ESTADO] ?? {
    titulo: "Estado del pago",
    mensaje: "No pudimos determinar el estado de tu pago. Si tenés dudas, contactanos.",
    icono: "ℹ️",
  };

  // El pago se confirma de verdad vía webhook en el servidor; acá solo
  // limpiamos el carrito para que la UI no siga mostrando algo ya comprado.
  useEffect(() => {
    if (status === "approved") vaciarCarrito();
  }, [status, vaciarCarrito]);

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">{contenido.icono}</div>
      <h1 className="text-3xl font-black mb-4">{contenido.titulo}</h1>
      <p className="text-neutral-400 mb-10">{contenido.mensaje}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
