import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PagoExitosoPayPalContenido from "@/components/PagoExitosoPayPalContenido";

export default function PagoExitosoPayPalPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <Suspense fallback={null}>
        <PagoExitosoPayPalContenido />
      </Suspense>
    </main>
  );
}
