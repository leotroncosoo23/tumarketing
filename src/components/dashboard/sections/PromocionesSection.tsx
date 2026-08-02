"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Input, Select, Badge, StatCard } from "@/components/dashboard/ui";
import type { Cupon } from "@/components/dashboard/AdminShell";

function generarCodigo() {
  return "TM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function PromocionesSection({ initial }: { initial: Cupon[] }) {
  const [cupones, setCupones] = useState<Cupon[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    codigo: "",
    tipo_descuento: "porcentaje",
    valor: "",
    limite_usos: "",
    fecha_vencimiento: "",
  });

  const refrescar = async () => {
    const { data } = await supabase.from("cupones").select("*").order("creado_en", { ascending: false });
    setCupones(data || []);
  };

  const crearCupon = async (payload: {
    codigo: string;
    tipo_descuento: string;
    valor: number;
    limite_usos: number | null;
    fecha_vencimiento: string | null;
  }) => {
    const { error } = await supabase.from("cupones").insert([{ ...payload, activo: true, usos_actuales: 0 }]);
    if (error) {
      alert("Error al crear cupón: " + error.message);
      return false;
    }
    await refrescar();
    return true;
  };

  const generarAutomatico = async () => {
    const descuentos = [10, 15, 20, 25, 30];
    const valor = descuentos[Math.floor(Math.random() * descuentos.length)];
    await crearCupon({
      codigo: generarCodigo(),
      tipo_descuento: "porcentaje",
      valor,
      limite_usos: 100,
      fecha_vencimiento: null,
    });
  };

  const handleGuardarManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await crearCupon({
      codigo: nuevo.codigo.toUpperCase().replace(/\s/g, ""),
      tipo_descuento: nuevo.tipo_descuento,
      valor: Number(nuevo.valor),
      limite_usos: nuevo.limite_usos ? Number(nuevo.limite_usos) : null,
      fecha_vencimiento: nuevo.fecha_vencimiento ? new Date(nuevo.fecha_vencimiento).toISOString() : null,
    });
    if (ok) {
      setShowForm(false);
      setNuevo({ codigo: "", tipo_descuento: "porcentaje", valor: "", limite_usos: "", fecha_vencimiento: "" });
    }
    setGuardando(false);
  };

  const eliminarCupon = async (id: string) => {
    if (!confirm("¿Borrar este cupón?")) return;
    const { error } = await supabase.from("cupones").delete().eq("id", id);
    if (error) return alert("Error al borrar: " + error.message);
    refrescar();
  };

  const toggleActivo = async (id: string, actual: boolean) => {
    const { error } = await supabase.from("cupones").update({ activo: !actual }).eq("id", id);
    if (!error) refrescar();
  };

  const activos = cupones.filter((c) => c.activo);
  const usosTotal = cupones.reduce((acc, c) => acc + c.usos_actuales, 0);
  const descuentoPromedio = cupones.length
    ? Math.round(cupones.reduce((acc, c) => acc + Number(c.valor), 0) / cupones.length)
    : 0;
  const vencidos = cupones.filter((c) => !c.activo).length;

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Cupones activos" value={activos.length} />
        <StatCard label="Usos totales" value={usosTotal} />
        <StatCard label="Descuento promedio" value={`${descuentoPromedio}%`} />
        <StatCard label="Inactivos" value={vencidos} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[480px] text-sm text-[var(--text-secondary)]">
          Los cupones se pueden generar automáticamente o cargar a mano.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={generarAutomatico}>
            ✦ Generar cupón automático
          </Button>
          <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Cupón manual"}</Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-5">
          <form onSubmit={handleGuardarManual} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              label="Código"
              required
              value={nuevo.codigo}
              onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value.toUpperCase() })}
              placeholder="MIPROMO"
            />
            <Select
              label="Tipo de descuento"
              value={nuevo.tipo_descuento}
              onChange={(e) => setNuevo({ ...nuevo, tipo_descuento: e.target.value })}
            >
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="fijo">Monto fijo ($)</option>
            </Select>
            <Input
              label="Valor"
              type="number"
              required
              value={nuevo.valor}
              onChange={(e) => setNuevo({ ...nuevo, valor: e.target.value })}
            />
            <Input
              label="Límite de usos (opcional)"
              type="number"
              value={nuevo.limite_usos}
              onChange={(e) => setNuevo({ ...nuevo, limite_usos: e.target.value })}
            />
            <Input
              label="Vencimiento (opcional)"
              type="date"
              value={nuevo.fecha_vencimiento}
              onChange={(e) => setNuevo({ ...nuevo, fecha_vencimiento: e.target.value })}
            />
            <div className="flex items-end">
              <Button type="submit" disabled={guardando} className="w-full">
                {guardando ? "Guardando..." : "Guardar cupón"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card padded={false}>
        <div className="grid grid-cols-[1.1fr_1fr_0.7fr_0.8fr] gap-3 border-b border-[var(--border-subtle)] px-5 py-3 text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
          <span>Código</span>
          <span>Descuento</span>
          <span>Usos</span>
          <span>Estado</span>
        </div>
        {cupones.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[1.1fr_1fr_0.7fr_0.8fr] items-center gap-3 border-b border-[var(--border-subtle)] px-5 py-3 last:border-0"
          >
            <span className="tm-display font-bold text-[var(--accent)]">{c.codigo}</span>
            <span className="text-sm text-[var(--text-secondary)]">
              {c.tipo_descuento === "porcentaje" ? `${c.valor}% OFF` : `$${Number(c.valor).toLocaleString("es-AR")}`}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {c.usos_actuales}
              {c.limite_usos ? `/${c.limite_usos}` : ""}
            </span>
            <div className="flex items-center gap-2">
              <Badge tone={c.activo ? "lime" : "gray"}>{c.activo ? "Activo" : "Inactivo"}</Badge>
              <button onClick={() => toggleActivo(c.id, c.activo)} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                {c.activo ? "Apagar" : "Prender"}
              </button>
              <button onClick={() => eliminarCupon(c.id)} className="text-xs text-[var(--signal-error)]">
                Borrar
              </button>
            </div>
          </div>
        ))}
        {cupones.length === 0 && <p className="p-8 text-center text-[var(--text-tertiary)]">No hay cupones creados.</p>}
      </Card>
    </div>
  );
}
