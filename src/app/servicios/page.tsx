import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeInScroll from "@/components/FadeInScroll";
import ServiciosCards from "@/components/agencia/ServiciosCards";
import PasosFlow from "@/components/agencia/PasosFlow";
import Metricas from "@/components/agencia/Metricas";
import AgendarCTA from "@/components/agencia/AgendarCTA";

export const metadata: Metadata = {
  title: "Servicios | TuMarketing",
  description: "Community management, pauta en Meta & Google y desarrollo web & apps. Agendá una asesoría 1:1 de 15 minutos.",
};

// Ya no se venden packs con precio desde acá: los 3 servicios llevan a su
// landing y todo arranca con la asesoría 1:1 (calendario al final de la página).
export default function ServiciosPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black pt-28 font-sans text-white">
      <Navbar />

      <section className="bg-[radial-gradient(640px_420px_at_8%_0%,rgba(255,79,216,0.2),transparent_70%),radial-gradient(640px_420px_at_50%_10%,rgba(169,112,255,0.16),transparent_70%),radial-gradient(640px_420px_at_92%_100%,rgba(59,157,255,0.2),transparent_70%),linear-gradient(180deg,#050816,#0b1230)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c27aff]">
              <span className="h-2 w-2 rounded-full bg-[#c27aff] shadow-[0_0_12px_#c27aff]" /> Servicios
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Elegí cómo querés <span className="tm-grad-vb">hacer crecer tu marca.</span>
            </h1>
            <p className="mt-5 text-lg text-[#b9b6d3]">
              Tres caminos, un mismo objetivo: más clientes. Todo arranca con una llamada de 15 minutos, gratis.
            </p>
          </FadeInScroll>
          <ServiciosCards />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Metricas />
      </section>

      <section className="relative py-16 md:py-24">
        <div className="tm-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mb-14 text-center">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              De tu primera llamada a <span className="text-[#ccff00]">resultados reales.</span>
            </h2>
          </FadeInScroll>
          <PasosFlow />
        </div>
      </section>

      <AgendarCTA
        eyebrow="Tu próximo paso"
        titulo="¿No sabés qué servicio te conviene?"
        destacado="Lo vemos juntos en 15 minutos."
        descripcion="Analizamos tu marca en vivo y te enviamos una propuesta personalizada con el servicio que de verdad te sirve."
        namespace="servicios-15min"
      />

      <Footer />
    </main>
  );
}
