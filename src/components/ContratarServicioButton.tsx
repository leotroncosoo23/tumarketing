"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import type { Servicio } from "@/lib/servicios";

type ContratarServicioButtonProps = {
  servicio: Pick<Servicio, "id" | "titulo" | "precio_ars" | "precio_usd" | "miniatura_url">;
};

export default function ContratarServicioButton({ servicio }: ContratarServicioButtonProps) {
  const { agregarItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  const handleClick = () => {
    agregarItem({
      id: servicio.id,
      titulo: servicio.titulo,
      tipo: "servicio",
      precio_ars: servicio.precio_ars,
      precio_usd: servicio.precio_usd,
      miniatura_url: servicio.miniatura_url,
    });
    // agregarItem ya abre el carrito solo; este flash es feedback extra en
    // el propio botón para que quede claro que el clic surtió efecto.
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
    >
      {agregado ? (
        <>
          Agregado al carrito
          <Check className="w-5 h-5" strokeWidth={2.5} />
        </>
      ) : (
        <>
          Contratar
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </>
      )}
    </button>
  );
}
