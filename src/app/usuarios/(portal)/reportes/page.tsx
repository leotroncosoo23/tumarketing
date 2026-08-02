"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUsuarioPortal } from "../layout";
import { ESTADOS_SERVICIO_CONTRATADO, type EstadoServicioContratado } from "@/lib/estado-servicio";

type Reporte = {
  id: string;
  titulo: string;
  tipo: string;
  mes: string;
  url_pdf: string;
  servicio: string;
};

type MetricaRedMes = { mes: string; alcance_mensual: number | null; interacciones: number | null; conversiones: number | null };
type ServicioMin = { id: string; modulo: string; estado: EstadoServicioContratado };

// Ejemplos de referencia (idénticos al mockup) hasta que "metricas_redes"
// tenga filas reales cargadas por el equipo.
const DEMO = { alcanceMensual: 62300, interacciones: 4180, conversiones: 46 };

function serieDemo(valorFinal: number, valorInicial: number): MetricaRedMes[] {
  return Array.from({ length: 12 }).map((_, i) => {
    const progreso = i / 11;
    const ruido = Math.sin(i * 1.7) * valorFinal * 0.04;
    const valor = Math.round(valorInicial + (valorFinal - valorInicial) * progreso + ruido);
    return { mes: "", alcance_mensual: Math.max(valor, Math.round(valorInicial * 0.8)), interacciones: null, conversiones: null };
  });
}
const SERIE_DEMO = serieDemo(DEMO.alcanceMensual, Math.round(DEMO.alcanceMensual * 0.29));

function GraficoRendimiento({ historial }: { historial: MetricaRedMes[] }) {
  const puntos = historial.filter((m) => m.alcance_mensual != null);
  if (puntos.length < 2) return null;

  const valores = puntos.map((p) => p.alcance_mensual as number);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const ancho = 760;
  const alto = 160;
  const paso = ancho / (puntos.length - 1);
  const coords = valores.map((v, i) => {
    const x = i * paso;
    const y = max === min ? alto / 2 : alto - ((v - min) / (max - min)) * alto;
    return [x, y] as const;
  });
  const linea = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${linea} L${ancho},${alto} L0,${alto} Z`;
  const variacion = valores[0] !== 0 ? Math.round(((valores[valores.length - 1] - valores[0]) / valores[0]) * 100) : 0;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-500">Rendimiento general — últimos {puntos.length} meses</span>
        <span className={`font-black text-lg ${variacion >= 0 ? "text-[#ccff00]" : "text-red-400"}`}>
          {variacion >= 0 ? "+" : ""}
          {variacion}%
        </span>
      </div>
      <svg viewBox={`0 0 ${ancho} ${alto + 20}`} className="w-full h-40 block">
        <defs>
          <linearGradient id="areaFillReportes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ccff00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFillReportes)" />
        <path d={linea} fill="none" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function ReportesPage() {
  const { perfil } = useUsuarioPortal();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [servicios, setServicios] = useState<ServicioMin[]>([]);
  const [metricasOverview, setMetricasOverview] = useState<MetricaRedMes | null>(null);
  const [historial, setHistorial] = useState<MetricaRedMes[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [reportesRes, serviciosRes] = await Promise.all([
        // La tabla "reportes" es nueva: si todavía no se corrió la migración en
        // Supabase, esta consulta puede fallar — se trata como "sin reportes".
        supabase
          .from("reportes")
          .select("id, titulo, tipo, mes, url_pdf, servicios_contratados!inner (usuario_id, servicios (titulo))")
          .eq("servicios_contratados.usuario_id", perfil.id)
          .order("mes", { ascending: false }),
        supabase.from("servicios_contratados").select("id, estado, servicios (modulo)").eq("usuario_id", perfil.id),
      ]);

      if (reportesRes.error) {
        console.error("Error al traer tus reportes:", reportesRes.error.message);
      } else {
        type FilaReporte = {
          id: string;
          titulo: string;
          tipo: string;
          mes: string;
          url_pdf: string;
          servicios_contratados: { servicios: { titulo: string } | null } | null;
        };
        setReportes(
          ((reportesRes.data as unknown as FilaReporte[]) || []).map((r) => ({
            id: r.id,
            titulo: r.titulo,
            tipo: r.tipo,
            mes: r.mes,
            url_pdf: r.url_pdf,
            servicio: r.servicios_contratados?.servicios?.titulo || "Servicio eliminado",
          }))
        );
      }

      type FilaServicio = { id: string; estado: string; servicios: { modulo: string } | null };
      const listaServicios = ((serviciosRes.data as unknown as FilaServicio[]) || []).map((s) => ({
        id: s.id,
        modulo: s.servicios?.modulo || "otro",
        estado: s.estado as EstadoServicioContratado,
      }));
      setServicios(listaServicios);

      const servicioSocial = listaServicios.find((s) => s.modulo === "social");
      if (servicioSocial) {
        const { data: overview } = await supabase
          .from("metricas_redes")
          .select("mes, alcance_mensual, interacciones, conversiones")
          .eq("servicio_contratado_id", servicioSocial.id)
          .order("mes", { ascending: false })
          .limit(1)
          .maybeSingle();
        setMetricasOverview(overview || null);

        const { data: serieReal } = await supabase
          .from("metricas_redes")
          .select("mes, alcance_mensual, interacciones, conversiones")
          .eq("servicio_contratado_id", servicioSocial.id)
          .order("mes", { ascending: true })
          .limit(12);
        setHistorial(serieReal && serieReal.length > 1 ? serieReal : []);
      }

      setCargando(false);
    };
    cargar();
  }, [perfil.id]);

  const servicioWeb = servicios.find((s) => s.modulo === "web");
  const avanceWeb = servicioWeb
    ? Math.round(((ESTADOS_SERVICIO_CONTRATADO.indexOf(servicioWeb.estado) + 1) / ESTADOS_SERVICIO_CONTRATADO.length) * 100)
    : 30;
  const hayMetricasReales = metricasOverview != null;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black mb-1">Reportes</h1>
      <p className="text-neutral-400 text-sm mb-8">El desempeño de tus servicios, mes a mes.</p>

      {cargando ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            {!hayMetricasReales && (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                Vista previa
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 items-stretch">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
              <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2">
                {(metricasOverview?.alcance_mensual ?? DEMO.alcanceMensual).toLocaleString("es-AR")}
              </p>
              <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500">Alcance mensual</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
              <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2">
                {(metricasOverview?.interacciones ?? DEMO.interacciones).toLocaleString("es-AR")}
              </p>
              <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500">Interacciones</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
              <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2">
                {metricasOverview?.conversiones ?? DEMO.conversiones}
              </p>
              <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500">Conversiones</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
              <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2">{avanceWeb}%</p>
              <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500">Avance del sitio web</p>
            </div>
          </div>

          <div className="mb-8">
            <GraficoRendimiento historial={historial.length > 0 ? historial : SERIE_DEMO} />
          </div>

          <h3 className="text-lg font-black mb-4">Reportes disponibles</h3>
          {reportes.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 text-lg">Todavía no tenés reportes disponibles. Tu equipo va a subirlos acá cada mes.</p>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
              {reportes.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 shrink-0">
                      {r.servicio}
                    </span>
                    <span className="text-sm text-white truncate">{r.titulo}</span>
                  </div>
                  <a
                    href={r.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] px-4 py-2 rounded-lg transition-colors"
                  >
                    ⬇️ Descargar
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
