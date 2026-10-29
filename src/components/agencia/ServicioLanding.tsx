import Link from "next/link";
import { Check, X, TrendingUp, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeInScroll from "@/components/FadeInScroll";
import Metricas from "./Metricas";
import PortfolioGrid from "./PortfolioGrid";
import PasosFlow from "./PasosFlow";
import AgendarCTA from "./AgendarCTA";
import { SERVICIOS_LANDING, servicioPorSlug, type ServicioSlug } from "@/lib/servicios-landing";
import { PROYECTOS } from "@/lib/portfolio";

type ServicioLandingProps = { slug: ServicioSlug };

function Eyebrow({ children, centrado = false }: { children: React.ReactNode; centrado?: boolean }) {
  return (
    <span className={`mb-4 ${centrado ? "inline-flex" : "flex"} items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--acc)]`}>
      <span className="h-2 w-2 rounded-full bg-[var(--acc)] shadow-[0_0_12px_var(--acc)]" />
      {children}
    </span>
  );
}

// Landing de venta de un servicio. Toda la página toma el color del servicio
// (--acc): CM rosa, Pauta violeta, Web & Apps azul.
export default function ServicioLanding({ slug }: ServicioLandingProps) {
  const s = servicioPorSlug(slug);
  const Icon = s.icon;
  const tieneCasos = PROYECTOS.some((p) => p.servicios.includes(slug));
  const otros = SERVICIOS_LANDING.filter((x) => x.slug !== slug);

  return (
    <main style={{ "--acc": s.acento } as React.CSSProperties} className="min-h-screen overflow-x-hidden bg-black pt-28 font-sans text-white">
      <Navbar />

      {/* --- HERO: la promesa --- */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -right-40 -top-64 h-[560px] w-[560px] rounded-full bg-[var(--acc)] opacity-25 blur-[110px]" />
        <FadeInScroll className="relative">
          <Link href="/servicios" className="mb-7 block w-fit text-sm text-neutral-400 hover:text-white">
            ← Todos los servicios
          </Link>
          <div className="mb-5 flex items-center gap-3.5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--acc)_45%,transparent)] bg-[color-mix(in_srgb,var(--acc)_15%,transparent)] text-[var(--acc)] shadow-[0_0_34px_-8px_var(--acc)]">
              <Icon className="h-7 w-7" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--acc)]">
              {s.categoria} · {s.nombre}
            </span>
          </div>
          <h1 className="max-w-4xl text-[2.6rem] font-black leading-[1.03] tracking-tighter sm:text-6xl lg:text-7xl">{s.titular}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">{s.bajada}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#agendar"
              className="rounded-full bg-[var(--acc)] px-8 py-4 text-center text-lg font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_var(--acc)]"
            >
              Quiero mi asesoría gratis →
            </a>
            <a href="#incluye" className="rounded-full border border-neutral-700 px-8 py-4 text-center text-lg font-bold hover:border-[var(--acc)]">
              Ver qué incluye
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-400">
            <li>✓ 15 min · 1:1 · gratis</li>
            <li>✓ Propuesta personalizada</li>
            <li>✓ Sin compromiso</li>
          </ul>
          {s.prueba && (
            <div className="mt-6 flex w-fit flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--acc)_50%,transparent)] px-3.5 py-2.5 text-[var(--acc)]">
              <TrendingUp className="h-4 w-4" />
              <b className="text-lg font-black">{s.prueba.numero}</b>
              <span className="text-sm text-neutral-400">{s.prueba.etiqueta}</span>
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-2">
            {s.plataformas.map((t) => (
              <span key={t} className="rounded-full border border-neutral-800 bg-white/5 px-3 py-1 text-xs text-neutral-400">
                {t}
              </span>
            ))}
          </div>
        </FadeInScroll>
      </section>

      {/* --- EL PROBLEMA --- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
        <FadeInScroll className="mb-10">
          <Eyebrow>¿Te pasa esto?</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Si te identificás con alguno, <span className="text-[var(--acc)]">esto es para vos.</span>
          </h2>
        </FadeInScroll>
        <div className="grid gap-4 md:grid-cols-3">
          {s.dolores.map((d, i) => (
            <FadeInScroll key={d} delay={i * 0.08}>
              <div className="flex h-full gap-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                <X className="h-5 w-5 shrink-0 text-[#ff5a7a]" strokeWidth={3} />
                <p className="text-neutral-400">{d}</p>
              </div>
            </FadeInScroll>
          ))}
        </div>
      </section>

      {/* --- LA SOLUCIÓN / QUÉ INCLUYE --- */}
      <section
        id="incluye"
        className="scroll-mt-24 border-y border-[color-mix(in_srgb,var(--acc)_20%,transparent)] bg-[radial-gradient(640px_420px_at_8%_0%,color-mix(in_srgb,var(--acc)_22%,transparent),transparent_70%),radial-gradient(640px_420px_at_92%_100%,rgba(59,157,255,0.14),transparent_70%),linear-gradient(180deg,#050816,#0b1230)] py-20 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <FadeInScroll>
            <Eyebrow>La solución</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Qué <span className="tm-grad-vb">incluye</span>
            </h2>
            <p className="mt-4 text-lg text-[#b9b6d3]">Todo lo que necesitás, armado a medida de tu marca y tus objetivos.</p>
            <ul className="mt-7 grid gap-2.5">
              {s.resultados.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <ArrowUpRight className="h-5 w-5 text-[var(--acc)]" />
                  {r}
                </li>
              ))}
            </ul>
            <a
              href="#agendar"
              className="mt-8 inline-block rounded-full bg-[var(--acc)] px-7 py-3.5 font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_var(--acc)]"
            >
              Agendar llamada →
            </a>
          </FadeInScroll>
          <ul className="grid gap-3">
            {s.incluye.map((x, i) => (
              <FadeInScroll key={x} delay={i * 0.06}>
                <li className="flex items-center gap-3.5 rounded-2xl border border-[color-mix(in_srgb,var(--acc)_30%,transparent)] bg-[#0c0e22]/80 px-5 py-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--acc)] text-black">
                    <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </span>
                  {x}
                </li>
              </FadeInScroll>
            ))}
          </ul>
        </div>
      </section>

      {/* --- PRUEBA SOCIAL --- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <FadeInScroll className="mb-10">
          <Eyebrow>Resultados reales</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Números que <span className="text-[var(--acc)]">hablan por nosotros.</span>
          </h2>
        </FadeInScroll>
        <Metricas acento={s.acento} />
      </section>

      {tieneCasos && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
          <FadeInScroll className="mb-10">
            <Eyebrow>Casos con este servicio</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Así lo aplicamos <span className="text-[var(--acc)]">con otras marcas.</span>
            </h2>
          </FadeInScroll>
          <PortfolioGrid servicio={slug} acento={s.acento} />
        </section>
      )}

      {/* --- CÓMO EMPEZAMOS --- */}
      <section className="relative py-20 md:py-28">
        <div className="tm-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInScroll className="mb-14 text-center">
            <Eyebrow centrado>Cómo empezamos</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Simple, claro y <span className="text-[var(--acc)]">a tu medida.</span>
            </h2>
          </FadeInScroll>
          <PasosFlow />
        </div>
      </section>

      {/* --- PREGUNTAS FRECUENTES --- */}
      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
        <FadeInScroll className="mb-6">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Lo que <span className="text-[var(--acc)]">nos suelen preguntar</span>
          </h2>
        </FadeInScroll>
        {s.faq.map((f) => (
          <details key={f.pregunta} className="group border-b border-neutral-800 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {f.pregunta}
              <span className="text-2xl leading-none text-[var(--acc)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-neutral-400">{f.respuesta}</p>
          </details>
        ))}
      </section>

      {/* --- AGENDAR (calendario integrado) --- */}
      <AgendarCTA
        eyebrow="Último paso"
        titulo="Hablemos 15 minutos y"
        destacado="armamos tu plan."
        descripcion="En 15 minutos analizamos tu caso en vivo. Si vemos que podemos ayudarte, te enviamos una propuesta hecha para vos."
        namespace={`${slug}-15min`}
        acento={s.acento}
      />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="mb-3.5 text-neutral-400">También te puede interesar:</p>
        <div className="flex flex-wrap gap-2.5">
          {otros.map((o) => {
            const OIcon = o.icon;
            return (
              <Link
                key={o.slug}
                href={o.href}
                style={{ "--oc": o.acento } as React.CSSProperties}
                className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--oc)_50%,transparent)] px-4 py-2 text-sm transition-all hover:border-[var(--oc)] hover:shadow-[0_0_20px_-8px_var(--oc)]"
              >
                <OIcon className="h-4 w-4 text-[var(--oc)]" />
                {o.nombre}
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
