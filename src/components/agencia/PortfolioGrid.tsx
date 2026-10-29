"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, X, ArrowRight, ExternalLink } from "lucide-react";
import { PROYECTOS, type Proyecto } from "@/lib/portfolio";
import { SERVICIOS_LANDING, type ServicioSlug } from "@/lib/servicios-landing";
import FadeInScroll from "@/components/FadeInScroll";

type PortfolioGridProps = {
  /** Si se pasa, muestra solo los casos de ese servicio (landings). */
  servicio?: ServicioSlug;
  /** Muestra los filtros por servicio (home). */
  conFiltros?: boolean;
  /** Ancla del calendario en la página actual. */
  anclaAgenda?: string;
  /** Color de acento (landings); por defecto el lima de marca. */
  acento?: string;
};

// Grilla del portfolio + ficha de cada caso en un modal (Cliente, Necesidad,
// Estrategia, Trabajo realizado, Plataformas, Resultados), con el video del caso.
export default function PortfolioGrid({ servicio, conFiltros = false, anclaAgenda = "#agendar", acento = "#ccff00" }: PortfolioGridProps) {
  const [filtro, setFiltro] = useState<ServicioSlug | null>(null);
  const [abierto, setAbierto] = useState<Proyecto | null>(null);

  const base = servicio ? PROYECTOS.filter((p) => p.servicios.includes(servicio)) : PROYECTOS;
  const lista = filtro ? base.filter((p) => p.servicios.includes(filtro)) : base;
  const serviciosConCasos = SERVICIOS_LANDING.filter((s) => PROYECTOS.some((p) => p.servicios.includes(s.slug)));

  return (
    <div style={{ "--acc": acento } as React.CSSProperties}>
      {conFiltros && serviciosConCasos.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {[{ slug: null, nombre: "Todos" }, ...serviciosConCasos].map((s) => (
            <button
              key={s.slug ?? "todos"}
              onClick={() => setFiltro(s.slug as ServicioSlug | null)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filtro === s.slug
                  ? "border-[#ccff00] bg-[#ccff00] font-semibold text-black"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p, i) => (
          <FadeInScroll key={p.cliente} delay={(i % 3) * 0.08} className="h-full">
            <button
              onClick={() => setAbierto(p)}
              aria-label={`Ver caso ${p.cliente}`}
              className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--acc)] hover:shadow-[0_20px_50px_-24px_var(--acc)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.poster || p.imagen}
                  alt={p.cliente}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.video ? "" : "object-[center_15%]"}`}
                />
                {p.video && (
                  <span className="absolute left-1/2 top-1/2 grid h-15 w-15 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ccff00] p-4 text-black shadow-[0_0_0_8px_rgba(204,255,0,0.18)] transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--acc)]">{p.rubro}</span>
                <h3 className="text-lg font-bold">{p.cliente}</h3>
                <p className="text-sm text-neutral-400">{p.necesidad}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.plataformas.map((t) => (
                    <span key={t} className="rounded-full border border-neutral-800 bg-white/5 px-2.5 py-1 text-xs text-neutral-400">
                      {t}
                    </span>
                  ))}
                </div>
                {p.resultados && p.resultados.length > 0 && (
                  <div className="mt-auto flex gap-5 pt-2">
                    {p.resultados.slice(0, 2).map((r) => (
                      <div key={r.etiqueta}>
                        <b className="block text-xl font-black text-[var(--acc)]">{r.numero}</b>
                        <span className="text-xs text-neutral-500">{r.etiqueta}</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="mt-1 text-sm font-semibold text-[var(--acc)]">Ver caso completo →</span>
              </div>
            </button>
          </FadeInScroll>
        ))}
      </div>

      {abierto && <FichaCaso proyecto={abierto} anclaAgenda={anclaAgenda} onCerrar={() => setAbierto(null)} />}
    </div>
  );
}

type FichaCasoProps = { proyecto: Proyecto; anclaAgenda: string; onCerrar: () => void };

function FichaCaso({ proyecto: p, anclaAgenda, onCerrar }: FichaCasoProps) {
  const [fuente, setFuente] = useState(p.video);
  const videoRef = useRef<HTMLVideoElement>(null);
  const servicios = SERVICIOS_LANDING.filter((s) => p.servicios.includes(s.slug));
  const tieneMedia = Boolean(p.video || p.imagen);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [fuente]);

  return (
    <div role="dialog" aria-modal="true" aria-label={p.cliente} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCerrar} />
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-10 ${
          tieneMedia ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-neutral-800 bg-neutral-900 hover:border-[var(--acc)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={tieneMedia ? "grid gap-8 md:grid-cols-[minmax(240px,340px)_1fr] md:items-start" : ""}>
          {tieneMedia && (
            <div className="mx-auto w-full max-w-xs md:sticky md:top-0 md:max-w-none">
              {p.video && p.comparar && (
                <div className="mb-3 flex gap-1.5">
                  {[
                    { src: p.video, etiqueta: p.etiquetaVideo || "Contenido" },
                    { src: p.comparar.src, etiqueta: p.comparar.etiqueta },
                  ].map((t) => (
                    <button
                      key={t.src}
                      onClick={() => setFuente(t.src)}
                      className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                        fuente === t.src ? "border-[var(--acc)] bg-[var(--acc)] text-black" : "border-neutral-800 text-neutral-400"
                      }`}
                    >
                      {t.etiqueta}
                    </button>
                  ))}
                </div>
              )}
              <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black">
                {p.video ? (
                  <video
                    ref={videoRef}
                    key={fuente}
                    src={fuente}
                    poster={fuente === p.video ? p.poster : undefined}
                    controls
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    className="block aspect-[9/16] w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagen} alt={p.cliente} className="block aspect-[9/16] w-full object-cover" />
                )}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--acc)]">{p.rubro}</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{p.cliente}</h2>

            <div className="my-7 grid gap-5">
              <Bloque titulo="Cliente">
                {p.cliente} · {p.rubro}
              </Bloque>
              <Bloque titulo="Necesidad">{p.necesidad}</Bloque>
              <Bloque titulo="Estrategia">{p.estrategia}</Bloque>
              <Bloque titulo="Trabajo realizado">
                <Lista items={p.trabajo} />
              </Bloque>
              <Bloque titulo="Plataformas">
                <div className="flex flex-wrap gap-1.5">
                  {p.plataformas.map((t) => (
                    <span key={t} className="rounded-full border border-neutral-800 bg-white/5 px-2.5 py-1 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </Bloque>
              {p.resultados && p.resultados.length > 0 && (
                <Bloque titulo="Resultados">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {p.resultados.map((r) => (
                      <div key={r.etiqueta} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                        <b className="block text-2xl font-black text-[var(--acc)]">{r.numero}</b>
                        <span className="text-sm text-neutral-400">{r.etiqueta}</span>
                      </div>
                    ))}
                  </div>
                </Bloque>
              )}
              {p.logros && p.logros.length > 0 && (
                <Bloque titulo="Lo que logramos">
                  <Lista items={p.logros} />
                </Bloque>
              )}
              {servicios.length > 0 && (
                <Bloque titulo="Servicios aplicados">
                  <div className="flex flex-wrap gap-2">
                    {servicios.map((s) => (
                      <Link
                        key={s.slug}
                        href={s.href}
                        style={{ "--sc": s.acento } as React.CSSProperties}
                        className="rounded-full border border-[color-mix(in_srgb,var(--sc)_50%,transparent)] px-3 py-1.5 text-sm hover:border-[var(--sc)]"
                      >
                        {s.nombre} →
                      </Link>
                    ))}
                  </div>
                </Bloque>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={anclaAgenda}
                onClick={onCerrar}
                className="inline-flex items-center gap-2 rounded-full bg-[#ccff00] px-6 py-3.5 font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(204,255,0,0.7)]"
              >
                Quiero resultados así <ArrowRight className="h-4 w-4" />
              </a>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3.5 font-bold hover:border-white"
                >
                  Ver sitio <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--acc)]">{titulo}</h4>
      <div className="text-neutral-400">{children}</div>
    </div>
  );
}

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-1">
      {items.map((x) => (
        <li key={x} className="flex gap-2">
          <span className="text-[var(--acc)]">→</span>
          {x}
        </li>
      ))}
    </ul>
  );
}
