"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Badge } from "@/components/dashboard/ui";
import { getEventosCalendario, type EventoCalendario } from "@/lib/dashboard-queries";

const TIPOS = ["todos", "Reunión", "Entrega", "Post", "Reel"] as const;

export default function CalendarioSection() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<(typeof TIPOS)[number]>("todos");

  useEffect(() => {
    getEventosCalendario(supabase)
      .then(setEventos)
      .finally(() => setCargando(false));
  }, []);

  const filtrados = eventos.filter((e) => filtro === "todos" || e.tipo === filtro);

  if (cargando) return <p className="py-10 text-center text-[var(--text-tertiary)]">Cargando...</p>;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold ${
              filtro === t ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
            }`}
          >
            {t === "todos" ? "Todos" : t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.map((ev) => {
          const fecha = new Date(ev.fechaPublicacion);
          return (
            <Card key={ev.id} className="flex items-center gap-5" padded={false}>
              <div className="w-[70px] shrink-0 py-4 pl-5 text-center">
                <p className="tm-display text-lg font-bold text-[var(--accent)]">{fecha.getDate()}</p>
                <p className="text-[11px] uppercase text-[var(--text-tertiary)]">
                  {fecha.toLocaleDateString("es-AR", { month: "short" })}
                </p>
              </div>
              <div className="h-8 w-px shrink-0 bg-[var(--border-subtle)]" />
              <div className="min-w-0 flex-1 py-4">
                <p className="truncate font-semibold text-[var(--text-primary)]">{ev.titulo}</p>
                <p className="truncate text-xs text-[var(--text-tertiary)]">{ev.clienteNombre}</p>
              </div>
              <div className="pr-5">
                <Badge>{ev.tipo}</Badge>
              </div>
            </Card>
          );
        })}
        {filtrados.length === 0 && (
          <p className="py-10 text-center text-[var(--text-tertiary)]">No hay eventos con este filtro.</p>
        )}
      </div>
    </div>
  );
}
