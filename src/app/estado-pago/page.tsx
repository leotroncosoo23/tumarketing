import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import EstadoPagoContenido from "@/components/EstadoPagoContenido";

export default function EstadoPagoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <Suspense fallback={null}>
        <EstadoPagoContenido />
      </Suspense>
    </main>
  );
}
