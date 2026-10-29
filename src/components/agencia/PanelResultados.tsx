"use client";

import { useEffect, useRef, useState } from "react";
import ContadorAnimado from "./ContadorAnimado";

// Views por video de clientes reales. Las alturas usan una escala comprimida
// (no proporcional) para que los videos chicos se lean al lado de los 300K.
const BARRAS = [
  { valor: "300K", cliente: "Treve", alto: 100 },
  { valor: "22K", cliente: "Lavadero", alto: 63 },
  { valor: "19K", cliente: "Sol", alto: 60 },
  { valor: "11K", cliente: "Home Deko", alto: 54 },
  { valor: "6K", cliente: "Umami", alto: 45 },
];

// Panel "Resultados reales" del hero: curva de seguidores que se dibuja y
// barras que suben cuando el panel entra en pantalla.
export default function PanelResultados() {
  const ref = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActivo(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -top-5 left-0 sm:-left-6 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-950/90 px-3.5 py-2 text-sm shadow-2xl backdrop-blur animate-[tm-float_5s_ease-in-out_infinite]">
        🔥 <b className="text-[#ccff00]">+50M</b> views generadas
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 p-5 sm:p-6 shadow-[0_30px_80px_-30px_rgba(204,255,0,0.35)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ccff00]">
            <i className="h-2 w-2 rounded-full bg-[#ccff00] animate-[tm-ping_1.8s_infinite]" />
            Resultados reales
          </span>
          <span className="rounded-full border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400">
            Zapatería Alex · 6 meses
          </span>
        </div>

        <p className="text-sm text-neutral-400">Seguidores orgánicos</p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <ContadorAnimado valor="+10.000" className="text-4xl sm:text-5xl font-black tracking-tight" />
          <span className="rounded-full bg-[#ccff00] px-2.5 py-1 text-xs font-bold text-black">↗ de 500 a +10K</span>
        </div>

        {/* Curva ilustrativa: solo el inicio (500) y el final (+10K) son datos reales */}
        <svg viewBox="0 0 320 120" preserveAspectRatio="none" aria-hidden="true" className="mt-3 h-28 w-full overflow-visible">
          <defs>
            <linearGradient id="tm-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ccff00" stopOpacity=".35" />
              <stop offset="1" stopColor="#ccff00" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 60, 90].map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#1f1f1f" />
          ))}
          <path
            d="M0,108 C60,105 110,97 150,84 S240,42 320,10 L320,120 L0,120 Z"
            fill="url(#tm-area)"
            className={`transition-opacity duration-1000 delay-700 ${activo ? "opacity-100" : "opacity-0"}`}
          />
          <path
            d="M0,108 C60,105 110,97 150,84 S240,42 320,10"
            fill="none"
            stroke="#ccff00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset={activo ? 0 : 420}
            style={{ transition: "stroke-dashoffset 2s cubic-bezier(.4,.1,.2,1)", filter: "drop-shadow(0 0 6px rgba(204,255,0,.7))" }}
          />
          <circle
            cx="316"
            cy="11"
            r="5"
            fill="#ccff00"
            className={`transition-opacity duration-300 delay-[1900ms] ${activo ? "opacity-100" : "opacity-0"}`}
          />
        </svg>
        <div className="mt-1 flex justify-between text-[11px] text-neutral-600">
          <span>500</span>
          <span>Mes 6 · +10K</span>
        </div>

        <p className="mb-2 mt-5 text-xs font-semibold tracking-wide text-neutral-400">Views por video · clientes reales</p>
        <div className="flex h-36 items-end gap-2.5">
          {BARRAS.map((b, i) => (
            <div key={b.cliente} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
              <b
                className={`text-sm font-black transition-opacity duration-500 ${activo ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: `${i * 100 + 900}ms` }}
              >
                {b.valor}
              </b>
              <i
                className="w-full rounded-t-lg rounded-b bg-gradient-to-b from-[#ccff00] to-[#ccff00]/10 shadow-[0_0_18px_-4px_rgba(204,255,0,0.6)]"
                style={{
                  height: activo ? `${b.alto * 0.68}%` : "0%",
                  transition: `height 1.1s cubic-bezier(.2,.8,.2,1) ${i * 100}ms`,
                }}
              />
              <span className="max-w-full truncate text-[11px] text-neutral-500">{b.cliente}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-9 right-0 sm:-right-4 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-950/90 px-3.5 py-2 text-sm shadow-2xl backdrop-blur animate-[tm-float_5s_ease-in-out_infinite] [animation-delay:-2.5s]">
        <b className="text-[#ccff00]">+488%</b> alcance · Camping
      </div>
    </div>
  );
}
