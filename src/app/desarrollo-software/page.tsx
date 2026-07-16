import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/desarrollo-software/Hero";
import Servicios from "@/components/desarrollo-software/Servicios";
import Diferencial from "@/components/desarrollo-software/Diferencial";
import PerfilLider from "@/components/desarrollo-software/PerfilLider";
import CierreCTA from "@/components/desarrollo-software/CierreCTA";

export default function DesarrolloSoftwarePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <Hero />
      <Servicios />
      <Diferencial />
      <PerfilLider />
      <CierreCTA />

      <Footer />
    </main>
  );
}
