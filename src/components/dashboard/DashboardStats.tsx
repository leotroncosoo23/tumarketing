"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/ui";
import { supabase } from "@/lib/supabase";
import { getProyectosResumen, getFacturacionMensual, type FacturacionMensual } from "@/lib/dashboard-queries";
import type { InitialAdminData } from "./AdminShell";

const MES_ABREV = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function money(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

type Kpis = {
  clientesActivos: number;
  proyectosEnCurso: number;
  postsDelMes: number;
};

function calcularKpis(clientes: InitialAdminData["clientes"], proyectos: InitialAdminData["proyectos"], blogs: InitialAdminData["blogs"]): Kpis {
  const ahora = new Date();
  return {
    clientesActivos: clientes.filter((c) => c.activo).length,
    proyectosEnCurso: proyectos.filter((p) => !p.suspendido).length,
    postsDelMes: blogs.filter((b) => {
      if (b.estado !== "Publicado") return false;
      const fecha = new Date(b.creado_en);
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
    }).length,
  };
}

// Consulta las 4 métricas del Dashboard directamente contra Supabase (arranca
// con `initial`, ya resuelto en el servidor, para no mostrar la grilla vacía)
// y las recalcula solas cuando cambia algo en `usuarios`, `servicios_contratados`,
// `blogs` o `facturas` — así no dependen de un refresh manual de la página.
export function DashboardStats({ initial }: { initial: InitialAdminData }) {
  const [kpis, setKpis] = useState<Kpis>(() => calcularKpis(initial.clientes, initial.proyectos, initial.blogs));
  const [facturacion, setFacturacion] = useState<FacturacionMensual>(initial.facturacionMensual);

  useEffect(() => {
    const refrescarKpis = async () => {
      const [{ data: clientes }, proyectos, { data: blogs }] = await Promise.all([
        supabase.from("usuarios").select("*").eq("rol", "usuario"),
        getProyectosResumen(supabase),
        supabase.from("blogs").select("*"),
      ]);
      const ahora = new Date();
      setKpis({
        clientesActivos: (clientes || []).filter((u: { activo: boolean }) => u.activo).length,
        proyectosEnCurso: proyectos.filter((p) => !p.suspendido).length,
        postsDelMes: (blogs || []).filter((b: { estado: string; creado_en: string }) => {
          if (b.estado !== "Publicado") return false;
          const fecha = new Date(b.creado_en);
          return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
        }).length,
      });
    };
    const refrescarFacturacion = () => getFacturacionMensual(supabase).then(setFacturacion);

    const canal = supabase
      .channel("dashboard-stats-kpis")
      .on("postgres_changes", { event: "*", schema: "public", table: "usuarios" }, refrescarKpis)
      .on("postgres_changes", { event: "*", schema: "public", table: "servicios_contratados" }, refrescarKpis)
      .on("postgres_changes", { event: "*", schema: "public", table: "blogs" }, refrescarKpis)
      .on("postgres_changes", { event: "*", schema: "public", table: "facturas" }, refrescarFacturacion)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-[var(--space-5)] lg:grid-cols-4">
      <StatCard label="Clientes activos" value={kpis.clientesActivos} />
      <StatCard
        label="Facturación mensual"
        value={money(facturacion.ars)}
        hint={facturacion.usd > 0 ? `+ USD ${facturacion.usd.toLocaleString("en-US")}` : undefined}
      />
      <StatCard label="Proyectos en curso" value={kpis.proyectosEnCurso} />
      <StatCard label={`Posts publicados (${MES_ABREV[new Date().getMonth()]})`} value={kpis.postsDelMes} />
    </div>
  );
}
