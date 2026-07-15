"use client";

import { useCart } from "@/lib/CartContext";
import type { Servicio } from "@/lib/servicios";

type ContratarServicioButtonProps = {
  servicio: Pick<Servicio, "id" | "titulo" | "precio_ars" | "precio_usd" | "miniatura_url">;
};

export default function ContratarServicioButton({ servicio }: ContratarServicioButtonProps) {
  const { agregarItem, abrirCarrito } = useCart();

  const handleContratar = () => {
    agregarItem({
      id: servicio.id,
      titulo: servicio.titulo,
      tipo: "servicio",
      precio_ars: servicio.precio_ars,
      precio_usd: servicio.precio_usd,
      miniatura_url: servicio.miniatura_url,
    });
    abrirCarrito();
  };

  return (
    <button
      onClick={handleContratar}
      className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
    >
      Contratar <span>→</span>
    </button>
  );
}
