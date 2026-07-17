"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { confirmarPagoYOtorgarAcceso } from "@/app/actions/confirmar-pago";

type Estado = "confirmando" | "listo" | "error";

export default function PagoExitosoContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vaciarCarrito } = useCart();

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const parametrosInvalidos = status !== "approved" || !paymentId;

  // searchParams ya está disponible durante el render (a diferencia de
  // localStorage/window), así que el estado inicial se puede derivar acá
  // directamente en vez de pasar por un efecto.
  const [estado, setEstado] = useState<Estado>(parametrosInvalidos ? "error" : "confirmando");
  const [error, setError] = useState<string | null>(
    parametrosInvalidos ? "No pudimos confirmar el pago desde acá. Si ya pagaste, escribinos y lo revisamos a mano." : null
  );

  // Si llegamos acá es porque Mercado Pago redirigió tras el pago: vaciamos
  // el carrito ya mismo, sin esperar la confirmación del servidor.
  useEffect(() => {
    vaciarCarrito();
  }, [vaciarCarrito]);

  useEffect(() => {
    if (parametrosInvalidos || !paymentId) return;

    confirmarPagoYOtorgarAcceso(paymentId).then((resultado) => {
      if (!resultado.ok) {
        setEstado("error");
        setError(resultado.error);
        return;
      }
      setEstado("listo");
      router.push("/alumnos");
    });
  }, [paymentId, parametrosInvalidos, router]);

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">{estado === "error" ? "⚠️" : "✅"}</div>
      <h1 className="text-3xl font-black mb-4">
        {estado === "error" ? "No pudimos confirmar tu pago" : "¡Pago procesado con éxito!"}
      </h1>
      <p className="text-neutral-400 mb-10">
        {estado === "confirmando" && "Ya recibimos tu pago, estamos activando tu servicio..."}
        {estado === "listo" && "Ya tenés acceso. Te llevamos a tu plataforma..."}
        {estado === "error" && (error || "Algo no salió como esperábamos.")}
      </p>
      <Link
        href="/alumnos"
        className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-8 py-4 rounded-full font-black text-lg hover:bg-[#b8e600] transition-colors"
      >
        Ir a mis servicios
      </Link>
    </div>
  );
}
