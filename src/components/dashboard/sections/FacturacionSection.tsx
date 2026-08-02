"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, StatCard, Badge } from "@/components/dashboard/ui";
import { getFacturasConCliente, type FacturaConCliente } from "@/lib/dashboard-queries";

function money(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export default function FacturacionSection() {
  const [facturas, setFacturas] = useState<FacturaConCliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | string>("todos");

  useEffect(() => {
    getFacturasConCliente(supabase)
      .then(setFacturas)
      .finally(() => setCargando(false));
  }, []);

  const esteMes = new Date().toISOString().slice(0, 7);
  const facturadoMes = facturas
    .filter((f) => f.estado === "pagada" && f.fechaVencimiento?.slice(0, 7) === esteMes)
    .reduce((acc, f) => acc + f.monto, 0);
  const pendiente = facturas.filter((f) => f.estado === "pendiente").reduce((acc, f) => acc + f.monto, 0);
  const vencido = facturas.filter((f) => f.estado === "vencida").reduce((acc, f) => acc + f.monto, 0);

  const filtradas = facturas.filter((f) => filtro === "todos" || f.estado === filtro);

  if (cargando) return <p className="py-10 text-center text-[var(--text-tertiary)]">Cargando...</p>;

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard label="Facturado este mes" value={money(facturadoMes)} />
        <StatCard label="Pendiente de cobro" value={money(pendiente)} />
        <StatCard label="Vencido" value={money(vencido)} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["todos", "pagada", "pendiente", "vencida"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold capitalize ${
              filtro === f ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card padded={false}>
        <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_0.9fr] gap-3 border-b border-[var(--border-subtle)] px-5 py-3 text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
          <span>Cliente</span>
          <span>Concepto</span>
          <span>Monto</span>
          <span>Vencimiento</span>
          <span>Estado</span>
        </div>
        {filtradas.map((f) => (
          <div
            key={f.id}
            className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_0.9fr] items-center gap-3 border-b border-[var(--border-subtle)] px-5 py-3 last:border-0"
          >
            <span className="font-semibold text-[var(--text-primary)]">{f.clienteNombre}</span>
            <span className="text-sm text-[var(--text-secondary)]">{f.concepto}</span>
            <span className="text-sm text-[var(--text-primary)]">{money(f.monto)}</span>
            <span className="text-sm text-[var(--text-secondary)]">
              {f.fechaVencimiento ? new Date(f.fechaVencimiento).toLocaleDateString("es-AR") : "—"}
            </span>
            <Badge tone={f.estado === "pagada" ? "lime" : f.estado === "vencida" ? "red" : "gray"}>{f.estado}</Badge>
          </div>
        ))}
        {filtradas.length === 0 && <p className="p-8 text-center text-[var(--text-tertiary)]">No hay facturas con este filtro.</p>}
      </Card>
    </div>
  );
}
