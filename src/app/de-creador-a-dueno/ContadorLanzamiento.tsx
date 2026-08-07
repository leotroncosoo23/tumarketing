"use client";

import { useEffect, useState } from "react";

// Fecha límite de la oferta de lanzamiento: es una constante a propósito, no
// "ahora + 7 días" calculado en cada visita — así todos los visitantes ven la
// MISMA cuenta regresiva real, en vez de una urgencia falsa que se resetea
// sola para cada uno. Actualizala manualmente cuando relancen la oferta.
const FECHA_LIMITE = new Date("2026-08-20T23:59:59-03:00");

function calcularRestante() {
  const diff = Math.max(0, FECHA_LIMITE.getTime() - Date.now());
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);
  return { dias, horas, minutos, segundos };
}

function Unidad({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="tm-display flex h-[64px] w-[64px] items-center justify-center rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--black-3)] text-[var(--fs-heading-l)] font-bold text-[var(--accent)] sm:h-[80px] sm:w-[80px] sm:text-[2.2rem]">
        {String(valor).padStart(2, "0")}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[var(--ls-eyebrow)] text-[var(--text-tertiary)]">
        {etiqueta}
      </span>
    </div>
  );
}

export default function ContadorLanzamiento() {
  const [restante, setRestante] = useState<ReturnType<typeof calcularRestante> | null>(null);

  useEffect(() => {
    setRestante(calcularRestante());
    const intervalo = setInterval(() => setRestante(calcularRestante()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Antes de montar en el cliente no mostramos nada (evita un parpadeo de
  // "00:00:00" en el HTML del servidor que después salta al valor real).
  if (!restante) return null;

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      <Unidad valor={restante.dias} etiqueta="Días" />
      <Unidad valor={restante.horas} etiqueta="Horas" />
      <Unidad valor={restante.minutos} etiqueta="Minutos" />
      <Unidad valor={restante.segundos} etiqueta="Segundos" />
    </div>
  );
}
