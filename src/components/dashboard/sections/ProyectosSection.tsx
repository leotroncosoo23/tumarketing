"use client";

import { useMemo, useState } from "react";
import { Card, Badge } from "@/components/dashboard/ui";
import { ESTADOS_SERVICIO_CONTRATADO } from "@/lib/estado-servicio";
import type { ProyectoResumen } from "@/lib/dashboard-queries";

const FILTROS = ["todos", ...ESTADOS_SERVICIO_CONTRATADO] as const;

export default function ProyectosSection({ initial }: { initial: ProyectoResumen[] }) {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("todos");

  const filtrados = useMemo(
    () => initial.filter((p) => filtro === "todos" || p.estado === filtro),
    [initial, filtro]
  );

  return (
    <div>
      <div className="mb-5">
        <h1 className="tm-display text-2xl font-bold text-[var(--text-primary)]">Proyectos</h1>
        <p className="text-[var(--text-secondary)]">Seguimiento de los servicios en curso.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold transition-colors ${
              filtro === f ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
            }`}
          >
            {f === "todos" ? "Todos" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtrados.map((p) => (
          <Card key={p.id}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-[var(--text-primary)]">{p.clienteNombre}</p>
                <p className="text-sm text-[var(--text-tertiary)]">{p.servicioTitulo}</p>
              </div>
              <Badge tone={p.suspendido ? "red" : undefined}>{p.suspendido ? "Suspendido" : p.estado}</Badge>
            </div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[var(--black-4)]">
              <div className="h-full bg-[var(--accent)]" style={{ width: `${p.progreso}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>{p.progreso}% completado</span>
              <span>{p.otorgadoEn ? new Date(p.otorgadoEn).toLocaleDateString("es-AR") : "—"}</span>
            </div>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <p className="col-span-2 py-10 text-center text-[var(--text-tertiary)]">No hay proyectos con este filtro.</p>
        )}
      </div>
    </div>
  );
}
