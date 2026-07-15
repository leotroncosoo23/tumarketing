import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PagoExitosoContenido from "@/components/PagoExitosoContenido";

export default function PagoExitosoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <Suspense fallback={null}>
        <PagoExitosoContenido />
      </Suspense>
    </main>
  );
}
