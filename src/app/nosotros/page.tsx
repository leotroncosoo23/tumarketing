import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroManifiesto from "@/components/nosotros/HeroManifiesto";
import DiferencialGeografico from "@/components/nosotros/DiferencialGeografico";
import Fundadores from "@/components/nosotros/Fundadores";
import Filosofia from "@/components/nosotros/Filosofia";
import CTAContacto from "@/components/nosotros/CTAContacto";

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <HeroManifiesto />
      <DiferencialGeografico />
      <Fundadores />
      <Filosofia />
      <CTAContacto />

      <Footer />
    </main>
  );
}
