"use client";

import Link from "next/link";
import { Check, TrendingUp, ArrowRight } from "lucide-react";
import { SERVICIOS_LANDING } from "@/lib/servicios-landing";
import FadeInScroll from "@/components/FadeInScroll";

type ServiciosCardsProps = {
  /** Ancla del calendario en la página actual (el botón "Quiero esto" baja ahí). */
  anclaAgenda?: string;
};

// Tarjetas de los 3 servicios: cada una vende sola (para quién es, qué incluye,
// prueba real y CTA). Cada tarjeta lleva el color de su servicio en --acc y una
// luz que sigue al mouse (--mx / --my).
export default function ServiciosCards({ anclaAgenda = "#agendar" }: ServiciosCardsProps) {
  const seguirMouse = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICIOS_LANDING.map((s, i) => {
        const Icon = s.icon;
        return (
          <FadeInScroll key={s.slug} delay={i * 0.12} className="h-full">
            <article
              onPointerMove={seguirMouse}
              style={{ "--acc": s.acento } as React.CSSProperties}
              className={[
                "group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--acc)_35%,transparent)] bg-[#0c0e22]/80 px-7 pb-7 pt-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--acc)] hover:shadow-[0_24px_60px_-28px_var(--acc)]",
                // Luz que sigue al mouse
                "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(380px_circle_at_var(--mx,20%)_var(--my,0%),color-mix(in_srgb,var(--acc)_28%,transparent),transparent_60%)] before:opacity-60 before:transition-opacity hover:before:opacity-100",
                // Brillo que recorre el borde superior
                "after:absolute after:inset-x-0 after:top-0 after:h-[3px] after:bg-[linear-gradient(90deg,transparent,var(--acc),transparent)] after:bg-[length:200%_100%] after:animate-[tm-shimmer_3.2s_linear_infinite]",
              ].join(" ")}
            >
              <div className="relative flex items-center justify-between gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--acc)_40%,transparent)] bg-[color-mix(in_srgb,var(--acc)_16%,transparent)] text-[var(--acc)] shadow-[0_0_30px_-8px_var(--acc)]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-[color-mix(in_srgb,var(--acc)_14%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--acc)]">
                  {s.categoria}
                </span>
              </div>

              <h3 className="relative text-2xl font-black tracking-tight">{s.nombre}</h3>
              <p className="relative text-[15px] leading-relaxed text-[#b9b6d3]">{s.corto}</p>

              <div className="relative rounded-r-xl rounded-l border-l-[3px] border-[var(--acc)] bg-[color-mix(in_srgb,var(--acc)_10%,transparent)] px-3 py-2.5 text-sm text-[#dcd9f0]">
                <b className="mb-0.5 block text-[11px] uppercase tracking-widest text-[var(--acc)]">Ideal si</b>
                {s.ideal}
              </div>

              <ul className="relative grid gap-2 text-sm text-[#dcd9f0]">
                {s.incluye.slice(0, 3).map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--acc)]" />
                    {x}
                  </li>
                ))}
              </ul>

              {s.prueba && (
                <div className="relative flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--acc)_50%,transparent)] px-3 py-2.5 text-[var(--acc)]">
                  <TrendingUp className="h-4 w-4" />
                  <b className="text-lg font-black">{s.prueba.numero}</b>
                  <span className="text-xs text-neutral-400">{s.prueba.etiqueta}</span>
                </div>
              )}

              <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <a
                  href={anclaAgenda}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--acc)] px-5 py-3 font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_34px_-8px_var(--acc)]"
                >
                  Quiero esto <ArrowRight className="h-4 w-4" />
                </a>
                <Link href={s.href} className="inline-flex items-center gap-1.5 font-bold text-[var(--acc)] hover:gap-2.5 transition-all">
                  Ver todo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </FadeInScroll>
        );
      })}

      <FadeInScroll className="md:col-span-2 lg:col-span-3">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#ccff00] to-[#d4ee26] px-8 py-7 text-black sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-black">¿No sabés por dónde empezar?</h3>
            <p className="mt-1 text-black/75">En 15 minutos vemos tu caso y te decimos qué servicio te conviene. Gratis.</p>
          </div>
          <a href={anclaAgenda} className="shrink-0 rounded-full bg-black px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5">
            Agendar mi llamada →
          </a>
        </div>
      </FadeInScroll>
    </div>
  );
}
