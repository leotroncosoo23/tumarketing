"use client";

import { useRef, useEffect } from "react";

type Variant = "chart" | "social" | "browser" | "ai" | "shop" | "network" | "tag" | "inbox" | "code";

type Servicio = {
  titulo: string;
  descripcion: string;
  accent: string;
  variant: Variant;
  icono: React.ReactNode;
  stat?: string;
  statLabel?: string;
  badge?: string;
};

const SERVICIOS: Servicio[] = [
  {
    titulo: "Google & Meta Ads",
    descripcion: "Campañas de búsqueda, display y performance que llevan tu inversión directo a resultados.",
    accent: "#ccff00",
    variant: "chart",
    stat: "+184%",
    statLabel: "ROI campaña",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
    ),
  },
  {
    titulo: "Redes Sociales",
    descripcion: "Gestionamos tu presencia en Instagram, TikTok y LinkedIn con contenido que conecta.",
    accent: "#ff5fa2",
    variant: "social",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
    ),
  },
  {
    titulo: "Diseño Web & SEO",
    descripcion: "Sitios rápidos y optimizados que venden 24/7 y escalan tu posicionamiento orgánico.",
    accent: "#38bdf8",
    variant: "browser",
    stat: "98",
    statLabel: "SEO Score",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    ),
  },
  {
    titulo: "IA & Optimización GEO",
    descripcion: "Optimizamos tu marca para ChatGPT, Gemini, Perplexity y las búsquedas del futuro.",
    accent: "#a78bfa",
    variant: "ai",
    badge: "NUEVO",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    ),
  },
  {
    titulo: "E-commerce & Tiendas",
    descripcion: "Creamos y escalamos tu tienda virtual optimizando cada etapa del embudo de ventas.",
    accent: "#fb923c",
    variant: "shop",
    stat: "+32",
    statLabel: "ventas hoy",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    ),
  },
  {
    titulo: "Growth Marketing",
    descripcion: "Adquisición de usuarios, análisis de datos y experimentación continua para crecer rápido.",
    accent: "#34d399",
    variant: "chart",
    stat: "x2.4",
    statLabel: "usuarios activos",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
    ),
  },
  {
    titulo: "Compra Programática",
    descripcion: "Campañas en miles de sitios y apps en tiempo real, con audiencias hiper-segmentadas.",
    accent: "#22d3ee",
    variant: "network",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
    ),
  },
  {
    titulo: "Mercado Libre Ads",
    descripcion: "Destacá tus productos en el marketplace líder y multiplicá tu retorno de inversión.",
    accent: "#fbbf24",
    variant: "tag",
    badge: "-30%",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
    ),
  },
  {
    titulo: "Email Marketing & CRM",
    descripcion: "Secuencias automatizadas y estrategias de retención que recuperan carritos abandonados.",
    accent: "#f472b6",
    variant: "inbox",
    stat: "42%",
    statLabel: "open rate",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    ),
  },
  {
    titulo: "Desarrollo Fullstack",
    descripcion: "Construimos plataformas y sistemas a medida, integrando tu backend, frontend y automatizaciones a la perfección.",
    accent: "#60a5fa",
    variant: "code",
    stat: "<200ms",
    statLabel: "tiempo de respuesta",
    icono: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.25 6.75L22.5 12l-5.25 5.25M6.75 6.75L1.5 12l5.25 5.25M14.25 4.5l-4.5 15"></path></svg>
    ),
  },
];

function StatChip({ accent, stat, statLabel }: { accent: string; stat: string; statLabel?: string }) {
  return (
    <div
      className="absolute top-3 right-3 bg-neutral-950/90 border rounded-xl px-3 py-1.5 backdrop-blur-sm"
      style={{ borderColor: `${accent}40` }}
    >
      <p className="font-black text-sm leading-none" style={{ color: accent }}>{stat}</p>
      {statLabel && <p className="text-neutral-500 text-[10px] mt-0.5 leading-none">{statLabel}</p>}
    </div>
  );
}

function Preview({ servicio }: { servicio: Servicio }) {
  const { accent, variant, icono, stat, statLabel, badge } = servicio;

  return (
    <div className="relative h-40 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/60 mb-5">
      {/* Textura de puntos */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />
      {/* Resplandor de fondo */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: accent }}
      />

      {variant === "chart" && (
        <>
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-2 px-5 pb-5 h-full">
            {[40, 65, 45, 85, 60, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md"
                style={{ height: `${h}%`, backgroundColor: accent, opacity: 0.25 + i * 0.12 }}
              />
            ))}
          </div>
          {stat && <StatChip accent={accent} stat={stat} statLabel={statLabel} />}
        </>
      )}

      {variant === "social" && (
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}25`, color: accent }}>
              {icono}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-24 bg-neutral-800 rounded-full" />
              <div className="h-2 w-16 bg-neutral-800/60 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold" style={{ color: accent }}>
            <span>♥ 9.2K</span>
            <span className="text-neutral-500">💬 312</span>
          </div>
        </div>
      )}

      {variant === "browser" && (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-800/60">
            <span className="w-2 h-2 rounded-full bg-neutral-700" />
            <span className="w-2 h-2 rounded-full bg-neutral-700" />
            <span className="w-2 h-2 rounded-full bg-neutral-700" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ border: `3px solid ${accent}30` }}>
              <div className="absolute inset-0 rounded-full" style={{ border: `3px solid ${accent}`, clipPath: "inset(0 0 15% 0)" }} />
              <span className="font-black text-lg" style={{ color: accent }}>{stat}</span>
            </div>
          </div>
        </div>
      )}

      {variant === "ai" && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="bg-neutral-900 border rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] shadow-lg" style={{ borderColor: `${accent}40` }}>
            <p className="text-white text-xs font-semibold flex items-center gap-1.5">
              <span style={{ color: accent }}>✦</span> ¿Cómo puedo ayudarte hoy?
            </p>
            <span className="flex gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent, animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent, animationDelay: "0.3s" }} />
            </span>
          </div>
        </div>
      )}

      {variant === "shop" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accent}20`, color: accent }}
              >
                {i === 1 ? icono : <span className="w-4 h-4 rounded bg-current opacity-40" />}
              </div>
            ))}
          </div>
          {stat && <StatChip accent={accent} stat={stat} statLabel={statLabel} />}
        </>
      )}

      {variant === "network" && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
          {[[30, 30], [100, 20], [160, 40], [50, 75], [130, 80]].map(([x1, y1], i) =>
            [[30, 30], [100, 20], [160, 40], [50, 75], [130, 80]].slice(i + 1).map(([x2, y2], j) => (
              <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
            ))
          )}
          {[[30, 30], [100, 20], [160, 40], [50, 75], [130, 80]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 1 ? 6 : 4} fill={accent} opacity={i === 1 ? 1 : 0.7} />
          ))}
        </svg>
      )}

      {variant === "tag" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accent}20`, color: accent }}>
              {icono}
            </div>
          </div>
          {badge && (
            <div
              className="absolute top-3 right-3 text-black font-black text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: accent }}
            >
              {badge}
            </div>
          )}
        </>
      )}

      {variant === "inbox" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accent}20`, color: accent }}>
              {icono}
            </div>
          </div>
          {stat && <StatChip accent={accent} stat={stat} statLabel={statLabel} />}
        </>
      )}

      {variant === "code" && (
        <>
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-800/60">
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
            </div>
            <div className="flex-1 px-4 py-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full" style={{ backgroundColor: accent }} />
                <span className="h-2 w-16 rounded-full bg-neutral-700" />
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span className="h-2 w-10 rounded-full bg-neutral-700/70" />
                <span className="h-2 w-8 rounded-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-5 rounded-full" style={{ backgroundColor: accent }} />
                <span className="h-2 w-12 rounded-full bg-neutral-700" />
                <span className="w-1 h-3 animate-pulse" style={{ backgroundColor: accent }} />
              </div>
            </div>
          </div>
          {stat && <StatChip accent={accent} stat={stat} statLabel={statLabel} />}
        </>
      )}
    </div>
  );
}

// Triplicamos la lista: el usuario siempre navega dentro de la copia del medio,
// y cuando se acerca a un extremo lo reubicamos sin animación en la copia equivalente de al lado.
// Como las 3 copias son idénticas, el "salto" es invisible y el scroll se siente infinito.
const COPIAS = [SERVICIOS, SERVICIOS, SERVICIOS];

export default function ServiciosCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);

  const medirYCentrar = () => {
    const el = scrollRef.current;
    if (!el) return;
    loopWidthRef.current = el.scrollWidth / 3;
    el.scrollLeft = loopWidthRef.current;
  };

  useEffect(() => {
    medirYCentrar();
    window.addEventListener("resize", medirYCentrar);
    return () => window.removeEventListener("resize", medirYCentrar);
  }, []);

  const manejarScroll = () => {
    const el = scrollRef.current;
    const w = loopWidthRef.current;
    if (!el || !w) return;

    if (el.scrollLeft < w * 0.5) {
      el.scrollLeft += w;
    } else if (el.scrollLeft > w * 1.5) {
      el.scrollLeft -= w;
    }
  };

  const desplazar = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * scrollRef.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Degradés laterales para difuminar la entrada/salida de tarjetas */}
      <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        onScroll={manejarScroll}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory px-1 pb-2"
      >
        {COPIAS.map((copia, copiaIdx) =>
          copia.map((servicio, i) => (
          <div
            key={`${copiaIdx}-${servicio.titulo}-${i}`}
            className="snap-start shrink-0 w-[260px] sm:w-[300px] bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${servicio.accent}18`, color: servicio.accent }}
                >
                  {servicio.icono}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{servicio.titulo}</h3>
              </div>
              {servicio.badge && servicio.variant === "ai" && (
                <span
                  className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1"
                  style={{ color: servicio.accent, borderColor: `${servicio.accent}50` }}
                >
                  ✦ {servicio.badge}
                </span>
              )}
            </div>

            <Preview servicio={servicio} />

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 min-h-[60px]">
              {servicio.descripcion}
            </p>

            <button
              className="w-full flex justify-center items-center gap-2 border border-neutral-700 text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-black hover:border-white transition-all"
            >
              Ver más <span>→</span>
            </button>
          </div>
          ))
        )}
      </div>

      {/* Flechas de navegación (siempre activas: el carrusel es infinito en ambos sentidos) */}
      <button
        onClick={() => desplazar(1)}
        aria-label="Ver más servicios"
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 w-11 h-11 rounded-full bg-neutral-900 border border-neutral-700 items-center justify-center text-white hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all z-20 shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
      <button
        onClick={() => desplazar(-1)}
        aria-label="Ver servicios anteriores"
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 w-11 h-11 rounded-full bg-neutral-900 border border-neutral-700 items-center justify-center text-white hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all z-20 shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
