"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MetricasUsuario = {
  nombre: string | null;
  email: string;
  ig_seguidores: number | null;
  ig_alcance: number | null;
  ig_interacciones: number | null;
};

function StatCard({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
      <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2 truncate">{valor}</p>
      <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500 truncate">{label}</p>
    </div>
  );
}

// Progreso fijo (no viene de la base todavía): solo completa la estética de
// la fila mientras no exista una fuente real para este dato.
function ProgresoEstatico({ porcentaje }: { porcentaje: number }) {
  const radio = 26;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 h-full">
      <svg width="52" height="52" viewBox="0 0 64 64" className="-rotate-90 shrink-0">
        <circle cx="32" cy="32" r={radio} fill="none" stroke="#2f2f2f" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={radio}
          fill="none"
          stroke="#ccff00"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="min-w-0">
        <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500 mb-1 truncate">Progreso</p>
        <p className="text-2xl font-black text-white leading-none">{porcentaje}%</p>
      </div>
    </div>
  );
}

// Formatea un valor numérico de Instagram: "Cargando..." mientras se resuelve
// el fetch, "0" para null/0 ya resuelto (nunca texto vacío ni "—").
function formatearMetrica(valor: number | null, cargando: boolean): string {
  if (cargando) return "Cargando...";
  return (valor ?? 0).toLocaleString("es-AR");
}

export default function CabeceraMetricasDashboard() {
  const [datos, setDatos] = useState<MetricasUsuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;

    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (vigente) setCargando(false);
        return;
      }

      const { data } = await supabase
        .from("usuarios")
        .select("nombre, email, ig_seguidores, ig_alcance, ig_interacciones")
        .eq("id", user.id)
        .maybeSingle();

      if (!vigente) return;
      setDatos((data as MetricasUsuario) || null);
      setCargando(false);
    };

    cargar();
    return () => {
      vigente = false;
    };
  }, []);

  const nombreMostrado = datos?.nombre || datos?.email || "de nuevo";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black">
          ¡Hola, <span className="text-[#ccff00]">{cargando ? "..." : nombreMostrado}</span>!
        </h1>
        <p className="text-neutral-400 text-sm mt-1">Así está hoy el estado de tus servicios con Tu Marketing.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
        <StatCard label="Seguidores en Instagram" valor={formatearMetrica(datos?.ig_seguidores ?? null, cargando)} />
        <StatCard label="Alcance mensual" valor={formatearMetrica(datos?.ig_alcance ?? null, cargando)} />
        <StatCard label="Interacciones" valor={formatearMetrica(datos?.ig_interacciones ?? null, cargando)} />
        <ProgresoEstatico porcentaje={20} />
        <StatCard label="Entrega estimada" valor="3 a 7 días hábiles" />
      </div>
    </div>
  );
}
