"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, StatCard, Select } from "@/components/dashboard/ui";
import { getReporteCliente } from "@/lib/dashboard-queries";
import type { ClienteResumen, ProyectoResumen } from "@/lib/dashboard-queries";

export default function ReportesSection({
  clientes,
  proyectos,
}: {
  clientes: ClienteResumen[];
  proyectos: ProyectoResumen[];
}) {
  const clientesConProyecto = clientes.filter((c) => c.proyectos.length > 0);
  const [clienteId, setClienteId] = useState(clientesConProyecto[0]?.id ?? "");
  const [datos, setDatos] = useState<{ mes: string; alcance: number; interacciones: number; conversiones: number }[]>([]);
  const [cargando, setCargando] = useState(false);

  const proyecto = proyectos.find((p) => p.usuarioId === clienteId);

  useEffect(() => {
    if (!proyecto) return;
    setCargando(true);
    getReporteCliente(supabase, proyecto.id).then((r) => {
      setDatos(r.meses);
      setCargando(false);
    });
  }, [proyecto?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const cliente = clientes.find((c) => c.id === clienteId);
  const ultimoMes = datos[datos.length - 1];
  const maxAlcance = Math.max(1, ...datos.map((d) => d.alcance));

  if (clientesConProyecto.length === 0) {
    return <p className="py-10 text-center text-[var(--text-tertiary)]">Todavía no hay clientes con proyectos activos.</p>;
  }

  return (
    <div>
      <div className="mb-5 w-[280px]">
        <Select label="Cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          {clientesConProyecto.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre || c.email}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard label="Alcance del mes" value={ultimoMes ? ultimoMes.alcance.toLocaleString("es-AR") : "—"} />
        <StatCard label="Interacciones" value={ultimoMes ? ultimoMes.interacciones.toLocaleString("es-AR") : "—"} />
        <StatCard label="Conversiones" value={ultimoMes ? ultimoMes.conversiones.toLocaleString("es-AR") : "—"} />
      </div>

      <Card>
        <h3 className="mb-5 font-bold text-[var(--text-primary)]">
          Alcance {cliente ? `— ${cliente.nombre || cliente.email}` : ""}
        </h3>
        {cargando ? (
          <p className="text-center text-[var(--text-tertiary)]">Cargando...</p>
        ) : datos.length === 0 ? (
          <p className="text-center text-[var(--text-tertiary)]">
            Sin datos de métricas todavía para este cliente.
          </p>
        ) : (
          <div className="flex h-[180px] items-end gap-4">
            {datos.map((d) => (
              <div key={d.mes} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs text-[var(--text-tertiary)]">{d.alcance}</span>
                <div
                  className="w-full rounded-t-md bg-[var(--accent)]"
                  style={{ height: `${(d.alcance / maxAlcance) * 100}%` }}
                />
                <span className="text-xs text-[var(--text-tertiary)]">{d.mes}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
