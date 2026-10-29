import Link from "next/link";
import { Target, Layers, TrendingUp, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnuncioBanner from "@/components/AnuncioBanner";
import Footer from "@/components/Footer";
import FadeInScroll from "@/components/FadeInScroll";
import PanelResultados from "@/components/agencia/PanelResultados";
import Metricas from "@/components/agencia/Metricas";
import PortfolioGrid from "@/components/agencia/PortfolioGrid";
import ServiciosCards from "@/components/agencia/ServiciosCards";
import PasosFlow from "@/components/agencia/PasosFlow";
import AgendarCTA from "@/components/agencia/AgendarCTA";
import { PROYECTOS } from "@/lib/portfolio";

const PILARES = [
  { icon: Target, titulo: "Estrategia antes que estética", texto: "Cada pieza tiene un objetivo: alcance, confianza o venta." },
  { icon: Layers, titulo: "Marketing + tecnología", texto: "Redes, pauta y desarrollo trabajando en una sola estrategia." },
  { icon: TrendingUp, titulo: "Resultados medibles", texto: "Reportes claros: sabés qué funciona y qué viene." },
  { icon: HeartHandshake, titulo: "Trato cercano", texto: "Hablás directo con quienes trabajan tu marca." },
];

// Orden pedido: Inicio > Sobre nosotros > Portfolio > Servicios > Cómo trabajamos > Agendar.
export default function Home() {
  const plataformas = [...new Set(PROYECTOS.flatMap((p) => p.plataformas).concat(["Meta Ads", "Google Ads", "TikTok"]))];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pt-28 font-sans text-white">
      <Navbar />
      <AnuncioBanner />

      {/* --- INICIO --- */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -top-56 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[#ccff00]/15 blur-[110px]" />

        <div className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <FadeInScroll>
            <span className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ccff00]">
              <span className="h-2 w-2 rounded-full bg-[#ccff00] shadow-[0_0_12px_#ccff00]" />
              Agencia de marketing en la Patagonia
            </span>
            <h1 className="text-[2.6rem] font-black leading-[1.02] tracking-tighter sm:text-6xl lg:text-[4rem]">
              Hacemos que tu marca <span className="text-[#ccff00]">se vea, se escuche y venda.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
              Community management, pauta en Meta y Google y desarrollo web &amp; apps para marcas que quieren crecer en serio.
              Con números reales, no promesas.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#agendar"
                className="rounded-full bg-[#ccff00] px-8 py-4 text-center text-lg font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(204,255,0,0.7)]"
              >
                Agendá tu asesoría gratis →
              </a>
              <a
                href="#portfolio"
                className="rounded-full border border-neutral-700 px-8 py-4 text-center text-lg font-bold transition-colors hover:border-[#ccff00]"
              >
                Ver resultados
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-400">
              <li>✓ 15 min · 1:1 · gratis</li>
              <li>✓ Propuesta personalizada</li>
              <li>✓ Sin compromiso</li>
            </ul>
          </FadeInScroll>

          <FadeInScroll delay={0.15}>
            <PanelResultados />
          </FadeInScroll>
        </div>

        <div className="mt-20">
          <Metricas />
        </div>
      </section>

      {/* Plataformas en movimiento */}
      <div aria-hidden="true" className="overflow-hidden border-y border-neutral-900 bg-neutral-950 py-5">
        <div className="flex w-max gap-14 animate-[tm-marquee_32s_linear_infinite]">
          {[...plataformas, ...plataformas].map((t, i) => (
            <span key={i} className="whitespace-nowrap text-lg font-semibold text-neutral-500">
              <span className="mr-14 text-[#ccff00]">✦</span>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* --- SOBRE NOSOTROS --- */}
      <section id="nosotros" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <FadeInScroll>
            <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ccff00]">
              <span className="h-2 w-2 rounded-full bg-[#ccff00]" /> Sobre nosotros
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              No hacemos posts. <span className="text-[#ccff00]">Construimos marcas que crecen.</span>
            </h2>
            <p className="mt-5 text-lg text-neutral-400">
              Somos un equipo creativo y estratégico que combina redes que crecen, pauta que vende y tecnología que automatiza.
            </p>
            <p className="mt-4 text-neutral-400">
              Acompañamos a más de 15 marcas de distintos rubros y generamos más de 50 millones de views y más de 50 mil seguidores
              de forma orgánica. Cada estrategia es a medida: primero entendemos tu negocio, después creamos.
            </p>
            <Link href="/nosotros" className="mt-6 inline-block font-bold text-[#ccff00] hover:underline">
              Conocé al equipo →
            </Link>
          </FadeInScroll>
          <div className="grid gap-3.5">
            {PILARES.map(({ icon: Icon, titulo, texto }, i) => (
              <FadeInScroll key={titulo} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ccff00]/10 text-[#ccff00]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{titulo}</h3>
                    <p className="text-sm text-neutral-400">{texto}</p>
                  </div>
                </div>
              </FadeInScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="scroll-mt-24 bg-neutral-950 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mb-10 max-w-2xl">
            <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ccff00]">
              <span className="h-2 w-2 rounded-full bg-[#ccff00]" /> Portfolio
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Resultados reales, <span className="text-[#ccff00]">marcas reales.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Conocé cada proyecto: qué necesitaba el cliente, la estrategia que aplicamos, el trabajo realizado y en qué plataformas.
            </p>
          </FadeInScroll>
          <PortfolioGrid conFiltros />
        </div>
      </section>

      {/* --- SERVICIOS: la solución, en rosa / violeta / azul --- */}
      <section
        id="servicios"
        className="scroll-mt-24 border-y border-[#c27aff]/20 bg-[radial-gradient(640px_420px_at_8%_0%,rgba(255,79,216,0.2),transparent_70%),radial-gradient(640px_420px_at_50%_10%,rgba(169,112,255,0.16),transparent_70%),radial-gradient(640px_420px_at_92%_100%,rgba(59,157,255,0.2),transparent_70%),linear-gradient(180deg,#050816,#0b1230)] py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c27aff]">
              <span className="h-2 w-2 rounded-full bg-[#c27aff] shadow-[0_0_12px_#c27aff]" /> La solución · Servicios
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Elegí cómo querés <span className="tm-grad-vb">hacer crecer tu marca.</span>
            </h2>
            <p className="mt-4 text-lg text-[#b9b6d3]">
              Tres caminos, un mismo objetivo: más clientes. Todo arranca con una llamada de 15 minutos, gratis.
            </p>
          </FadeInScroll>
          <ServiciosCards />
        </div>
      </section>

      {/* --- CÓMO TRABAJAMOS --- */}
      <section id="proceso" className="relative py-20 md:py-28">
        <div className="tm-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ccff00]">
              <span className="h-2 w-2 rounded-full bg-[#ccff00]" /> Cómo trabajamos
            </span>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              De tu primera llamada a <span className="text-[#ccff00]">resultados reales.</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">Simple, claro y sin vueltas. Así arrancamos juntos.</p>
          </FadeInScroll>
          <PasosFlow />
          <div className="mt-12 text-center">
            <a
              href="#agendar"
              className="inline-block rounded-full bg-[#ccff00] px-8 py-4 text-lg font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(204,255,0,0.7)]"
            >
              Dar el primer paso →
            </a>
          </div>
        </div>
      </section>

      {/* --- AGENDAR (calendario integrado) --- */}
      <AgendarCTA
        eyebrow="Tu próximo paso"
        titulo="¿Tu marca podría estar vendiendo más?"
        destacado="Descubrilo en 15 minutos."
        descripcion="En una llamada 1:1 analizamos tu marca en vivo, te mostramos qué está frenando tu crecimiento y te enviamos una propuesta hecha para vos."
        namespace="home-15min"
      />

      <Footer />
    </main>
  );
}
