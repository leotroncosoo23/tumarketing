import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import GraciasContenido from "./GraciasContenido";

export default function GraciasInfoproductoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <Suspense fallback={null}>
        <GraciasContenido />
      </Suspense>
    </main>
  );
}
