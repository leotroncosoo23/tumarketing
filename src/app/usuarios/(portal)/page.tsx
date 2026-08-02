"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUsuarioPortal } from "./layout";
import { ESTADOS_SERVICIO_CONTRATADO, ETIQUETA_ESTADO, type EstadoServicioContratado } from "@/lib/estado-servicio";
import type { ModuloServicio } from "@/lib/servicios";

type ServicioActivo = {
  id: string;
  nombre: string;
  modulo: ModuloServicio;
  estado: EstadoServicioContratado;
  tieneBriefing: boolean;
  suspendido: boolean;
  otorgadoEn: string;
  tiempoEntrega: string | null;
  linkStaging: string | null;
  linkPanelFinal: string | null;
  videoTutorialUrl: string | null;
};

type PostReciente = { id: string; titulo: string; fecha_publicacion: string };
type MetricasMes = {
  inversion: number | null;
  clics: number | null;
  leads: number | null;
  conversaciones_ia: number | null;
  tiempo_ahorrado_horas: number | null;
};
type MetricaRedMes = {
  mes: string;
  seguidores: number | null;
  alcance_mensual: number | null;
  interacciones: number | null;
  nuevos_seguidores: number | null;
  conversiones: number | null;
  clics: number | null;
  invertido: number | null;
};

type Categoria = "marketing" | "programacion";

// El diseño divide todo en dos categorías (Marketing / Programación). Nuestro
// catálogo real tiene más módulos que eso, así que todo lo que no sea "web"
// (social, ads, branding, otro) cae bajo "Marketing".
function categoriaDeModulo(modulo: ModuloServicio): Categoria {
  return modulo === "web" ? "programacion" : "marketing";
}

const TITULO_CATEGORIA: Record<Categoria, string> = { marketing: "Marketing", programacion: "Programación" };

const DESCRIPCION_PASO: Record<EstadoServicioContratado, string> = {
  "Esperando información": "Recibimos tu solicitud y estamos a la espera de tu información para arrancar.",
  Diseño: "Tu equipo está definiendo el enfoque y diseñando las piezas o la propuesta.",
  Desarrollo: "Estamos ejecutando el trabajo: producción de contenido, desarrollo o configuración según tu servicio.",
  Revisión: "Revisamos internamente el resultado antes de compartirlo con vos.",
  Lanzamiento: "Tu servicio está publicado y en marcha.",
};

// Estos son ejemplos de referencia (idénticos a los del mockup de diseño) que
// se muestran únicamente hasta que tu equipo carga datos reales en
// "metricas_redes". Apenas haya una fila real, se reemplazan solos.
const DEMO = {
  seguidores: 8420,
  alcanceMensual: 62300,
  interacciones: 4180,
  nuevosSeguidores: 320,
  conversiones: 46,
  clicsLink: 1240,
  invertido: 85000,
  contenidoDestacado: [
    { titulo: "Reel: detrás de escena", rendimiento: 82 },
    { titulo: "Carrusel: casos de éxito", rendimiento: 64 },
    { titulo: "Historia: promo del mes", rendimiento: 41 },
  ],
};

function mesActualISO() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;
}

function nombreMesActual() {
  const hoy = new Date();
  const nombre = hoy.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

// Serie de 12 meses ascendente con un poco de zigzag (determinística, no
// aleatoria) para que el gráfico de ejemplo se vea igual de "vivo" que el del
// diseño, sin depender de datos reales todavía cargados.
function serieDemo(valorFinal: number, valorInicial: number): MetricaRedMes[] {
  return Array.from({ length: 12 }).map((_, i) => {
    const progreso = i / 11;
    const ruido = Math.sin(i * 1.7) * valorFinal * 0.04;
    const valor = Math.round(valorInicial + (valorFinal - valorInicial) * progreso + ruido);
    return {
      mes: "",
      seguidores: null,
      alcance_mensual: Math.max(valor, Math.round(valorInicial * 0.8)),
      interacciones: null,
      nuevos_seguidores: null,
      conversiones: null,
      clics: null,
      invertido: null,
    };
  });
}
const SERIE_ALCANCE_DEMO = serieDemo(DEMO.alcanceMensual, Math.round(DEMO.alcanceMensual * 0.29));

// Próxima renovación mensual "estimada" a partir de la fecha real de alta del
// servicio (mismo día del mes, la próxima vez que caiga). No es una fecha de
// facturación real todavía — placeholder hasta que haya suscripciones.
function proximaRenovacionEstimada(otorgadoEnISO: string): string {
  const inicio = new Date(otorgadoEnISO);
  const hoy = new Date();
  const resultado = new Date(hoy.getFullYear(), hoy.getMonth(), inicio.getDate());
  if (resultado <= hoy) resultado.setMonth(resultado.getMonth() + 1);
  return resultado.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
}

function BadgeVistaPrevia() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
      Vista previa
    </span>
  );
}

function ProgresoCircular({ estado, label }: { estado: EstadoServicioContratado; label: string }) {
  const total = ESTADOS_SERVICIO_CONTRATADO.length;
  const indiceActual = ESTADOS_SERVICIO_CONTRATADO.indexOf(estado);
  const porcentaje = Math.round(((indiceActual + 1) / total) * 100);
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
        <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500 mb-1 truncate">{label}</p>
        <p className="text-2xl font-black text-white leading-none">{porcentaje}%</p>
      </div>
    </div>
  );
}

function StatOverview({ label, valor, caption }: { label: string; valor: string; caption?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-center h-full min-h-26">
      <p className="text-2xl md:text-3xl font-black text-white leading-none mb-2 truncate">{valor}</p>
      <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-500 truncate">{label}</p>
      {caption && <p className="text-xs text-neutral-500 mt-1 truncate">{caption}</p>}
    </div>
  );
}

// El padre le pasa `key={servicio.id}` al instanciarlo: React lo remonta
// entero al cambiar de servicio, así el estado de expandido arranca limpio
// sin necesidad de resetearlo a mano dentro de un efecto.
function TimelineVertical({ estado }: { estado: EstadoServicioContratado }) {
  const indiceActual = ESTADOS_SERVICIO_CONTRATADO.indexOf(estado);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({ [estado]: true });

  return (
    <ol className="flex flex-col">
      {ESTADOS_SERVICIO_CONTRATADO.map((paso, indice) => {
        const completado = indice < indiceActual;
        const activo = indice === indiceActual;
        const esUltimo = indice === ESTADOS_SERVICIO_CONTRATADO.length - 1;
        const abierto = !!expandido[paso];
        return (
          <li key={paso} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  completado
                    ? "bg-[#ccff00] text-black"
                    : activo
                    ? "bg-neutral-950 border-2 border-[#ccff00] text-[#ccff00] shadow-[0_0_0_4px_rgba(204,255,0,0.15)]"
                    : "bg-neutral-950 border-2 border-neutral-700 text-neutral-500"
                }`}
              >
                {completado ? "✓" : indice + 1}
              </div>
              {!esUltimo && <div className={`w-0.5 flex-1 min-h-6.5 ${completado ? "bg-[#ccff00]" : "bg-neutral-800"}`} />}
            </div>
            <button
              type="button"
              onClick={() => setExpandido((e) => ({ ...e, [paso]: !e[paso] }))}
              className={`text-left flex-1 ${esUltimo ? "pb-0" : "pb-6"}`}
            >
              <p className={`text-sm font-bold ${activo || completado ? "text-white" : "text-neutral-500"}`}>{ETIQUETA_ESTADO[paso]}</p>
              {abierto && <p className="text-xs text-neutral-400 mt-1">{DESCRIPCION_PASO[paso]}</p>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function GraficoAlcance({ historial }: { historial: MetricaRedMes[] }) {
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

  const primero = valores[0];
  const ultimo = valores[valores.length - 1];
  const variacion = primero !== 0 ? Math.round(((ultimo - primero) / primero) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-500">Alcance mensual — últimos {puntos.length} meses</span>
        <span className={`font-black text-lg ${variacion >= 0 ? "text-[#ccff00]" : "text-red-400"}`}>
          {variacion >= 0 ? "+" : ""}
          {variacion}%
        </span>
      </div>
      <svg viewBox={`0 0 ${ancho} ${alto + 20}`} className="w-full h-40 block">
        <defs>
          <linearGradient id="areaFillDashboard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ccff00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFillDashboard)" />
        <path d={linea} fill="none" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 5 : 0} fill="#ccff00" stroke="#1a1a1a" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

function DetalleServicio({ servicio }: { servicio: ServicioActivo }) {
  const [posts, setPosts] = useState<PostReciente[]>([]);
  const [metricas, setMetricas] = useState<MetricasMes | null>(null);
  const [metricasRedes, setMetricasRedes] = useState<MetricaRedMes[]>([]);

  useEffect(() => {
    if (servicio.modulo === "social") {
      supabase
        .from("posts_calendario")
        .select("id, titulo, fecha_publicacion")
        .eq("servicio_contratado_id", servicio.id)
        .order("fecha_publicacion", { ascending: false })
        .limit(5)
        .then(({ data }) => setPosts(data || []));

      // "metricas_redes" es carga manual del admin (no hay integración con
      // Instagram): si el equipo todavía no cargó nada, esto vuelve vacío y
      // la sección de reporte cae al set de datos de ejemplo.
      supabase
        .from("metricas_redes")
        .select("mes, seguidores, alcance_mensual, interacciones, nuevos_seguidores, conversiones, clics, invertido")
        .eq("servicio_contratado_id", servicio.id)
        .order("mes", { ascending: true })
        .limit(12)
        .then(({ data, error }) => {
          if (error) return; // tabla puede no existir todavía si no se corrió el SQL
          setMetricasRedes(data || []);
        });
    }
    if (servicio.modulo === "ads") {
      supabase
        .from("metricas_mensuales")
        .select("inversion, clics, leads, conversaciones_ia, tiempo_ahorrado_horas")
        .eq("servicio_contratado_id", servicio.id)
        .eq("mes", mesActualISO())
        .maybeSingle()
        .then(({ data }) => setMetricas(data || null));
    }
  }, [servicio.id, servicio.modulo]);

  const hayMetricasReales = metricasRedes.length > 0;
  const metricasActualReales = hayMetricasReales ? metricasRedes[metricasRedes.length - 1] : null;
  const historialGrafico = hayMetricasReales ? metricasRedes : SERIE_ALCANCE_DEMO;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
        {/* Columna principal */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-white mb-1">{servicio.nombre}</h3>
              <p className="text-xs text-neutral-500">
                Contratado desde el{" "}
                {new Date(servicio.otorgadoEn).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
            {servicio.suspendido ? (
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-red-500/10 text-red-400 border border-red-500/30">
                🚫 Suspendido
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
                {ETIQUETA_ESTADO[servicio.estado]}
              </span>
            )}
          </div>

          <p className="text-xs font-bold uppercase text-neutral-500 mb-4">Proceso de tu servicio</p>
          <div className="mb-8">
            <TimelineVertical key={servicio.id} estado={servicio.estado} />
          </div>

          <p className="text-xs text-neutral-500 mb-6">
            ⏱️ Entrega estimada:{" "}
            <span className="text-white font-bold">{servicio.tiempoEntrega || proximaRenovacionEstimada(servicio.otorgadoEn)}</span>
          </p>

          {servicio.modulo === "web" && (servicio.linkStaging || servicio.linkPanelFinal || servicio.videoTutorialUrl) && (
            <div className="mb-8 flex flex-wrap gap-3">
              {servicio.linkStaging && (
                <a href={servicio.linkStaging} target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] px-4 py-2 rounded-lg transition-colors">
                  🔗 Ver sitio de prueba
                </a>
              )}
              {servicio.linkPanelFinal && (
                <a href={servicio.linkPanelFinal} target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] px-4 py-2 rounded-lg transition-colors">
                  🔗 Panel de administración
                </a>
              )}
              {servicio.videoTutorialUrl && (
                <a href={servicio.videoTutorialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] px-4 py-2 rounded-lg transition-colors">
                  🎬 Video tutorial
                </a>
              )}
            </div>
          )}

          {servicio.modulo === "ads" && (
            <div className="mb-8">
              <p className="text-xs font-bold uppercase text-neutral-500 mb-3">Este mes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Inversión</p>
                  <p className="text-lg font-black text-white">{metricas?.inversion != null ? `$${Number(metricas.inversion).toLocaleString("es-AR")}` : "—"}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Clics</p>
                  <p className="text-lg font-black text-white">{metricas?.clics != null ? metricas.clics : "—"}</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Leads</p>
                  <p className="text-lg font-black text-white">{metricas?.leads != null ? metricas.leads : "—"}</p>
                </div>
              </div>
            </div>
          )}

          <Link
            href={servicio.tieneBriefing || servicio.estado !== "Esperando información" ? `/usuarios/proyectos/${servicio.id}` : `/usuarios/onboarding?servicio=${encodeURIComponent(servicio.nombre)}&scid=${servicio.id}`}
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors"
          >
            {servicio.tieneBriefing || servicio.estado !== "Esperando información" ? "Ver proyecto completo" : "Completar Formulario Base"} <span>→</span>
          </Link>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h4 className="font-black text-white mb-2">Chat directo con tu equipo</h4>
            <p className="text-sm text-neutral-400 mb-4">Escribile a tu equipo para dudas, cambios o pedidos puntuales.</p>
            <Link
              href={`/usuarios/proyectos/${servicio.id}`}
              className="block text-center bg-[#ccff00] text-black text-sm font-bold px-4 py-3 rounded-xl hover:bg-[#b8e600] transition-colors"
            >
              Abrir chat
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h4 className="font-black text-white mb-4">Actividad reciente</h4>
            {servicio.modulo === "social" && posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-sm shrink-0">📅</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{p.titulo}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(p.fecha_publicacion).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Todavía no hay actividad registrada para este servicio.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reporte del mes (solo para módulo social) — usa datos reales de
          "metricas_redes" apenas existan; mientras tanto, de ejemplo. */}
      {servicio.modulo === "social" && (
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-block text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-transparent border border-neutral-700 text-neutral-400">
              Reporte de {nombreMesActual()}
            </span>
            {!hayMetricasReales && <BadgeVistaPrevia />}
          </div>
          <h3 className="text-lg font-black text-white mb-4">Cómo fue tu mes</h3>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8">
            <GraficoAlcance historial={historialGrafico} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatOverview
              label="Nuevos seguidores"
              valor={`+${metricasActualReales?.nuevos_seguidores ?? DEMO.nuevosSeguidores}`}
            />
            <StatOverview label="Conversiones" valor={String(metricasActualReales?.conversiones ?? DEMO.conversiones)} />
            <StatOverview label="Clics al link" valor={(metricasActualReales?.clics ?? DEMO.clicsLink).toLocaleString("es-AR")} />
            <StatOverview
              label="Invertido en pauta"
              valor={`$${(metricasActualReales?.invertido ?? DEMO.invertido).toLocaleString("es-AR")}`}
            />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-neutral-500">Contenido con mejor rendimiento</p>
              {!hayMetricasReales && <BadgeVistaPrevia />}
            </div>
            <div className="space-y-4">
              {(posts.length > 0
                ? posts.slice(0, 3).map((p, i) => ({ titulo: p.titulo, rendimiento: DEMO.contenidoDestacado[i]?.rendimiento ?? 50 }))
                : DEMO.contenidoDestacado
              ).map((item, i) => (
                <div key={i} className="grid grid-cols-[20px_1.4fr_1fr_auto] items-center gap-4">
                  <span className="text-xs text-neutral-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-white truncate">{item.titulo}</span>
                  <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-[#ccff00]" style={{ width: `${item.rendimiento}%` }} />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
                    {item.rendimiento}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/usuarios/reportes"
              className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] text-sm font-bold px-5 py-3 rounded-xl transition-colors"
            >
              Ver todos tus reportes <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardPage() {
  const { perfil } = useUsuarioPortal();
  const searchParams = useSearchParams();
  const categoriaActiva: Categoria = searchParams.get("tab") === "programacion" ? "programacion" : "marketing";

  const [serviciosActivos, setServiciosActivos] = useState<ServicioActivo[]>([]);
  const [tabActivo, setTabActivo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [metricasOverview, setMetricasOverview] = useState<MetricaRedMes | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const [serviciosRes, briefingsRes] = await Promise.all([
        supabase
          .from("servicios_contratados")
          .select(
            "id, estado, suspendido, otorgado_en, link_staging, link_panel_final, video_tutorial_url, servicios (titulo, modulo, tiempo_entrega)"
          )
          .eq("usuario_id", perfil.id)
          .order("otorgado_en", { ascending: false }),
        supabase.from("briefings").select("servicio_contratado_id").eq("usuario_id", perfil.id),
      ]);

      if (serviciosRes.error) {
        console.error("Error al traer tus servicios:", serviciosRes.error.message);
        setCargando(false);
        return;
      }

      const idsConBriefing = new Set(
        (briefingsRes.data || []).map((b: { servicio_contratado_id: string | null }) => b.servicio_contratado_id)
      );

      type Fila = {
        id: string;
        estado: string;
        suspendido: boolean;
        otorgado_en: string;
        link_staging: string | null;
        link_panel_final: string | null;
        video_tutorial_url: string | null;
        servicios: { titulo: string; modulo: ModuloServicio; tiempo_entrega: string | null } | null;
      };

      const lista = ((serviciosRes.data as unknown as Fila[]) || []).map((sc) => ({
        id: sc.id,
        nombre: sc.servicios?.titulo || "Servicio eliminado",
        modulo: sc.servicios?.modulo || "otro",
        estado: sc.estado as EstadoServicioContratado,
        tieneBriefing: idsConBriefing.has(sc.id),
        suspendido: sc.suspendido,
        otorgadoEn: sc.otorgado_en,
        tiempoEntrega: sc.servicios?.tiempo_entrega || null,
        linkStaging: sc.link_staging,
        linkPanelFinal: sc.link_panel_final,
        videoTutorialUrl: sc.video_tutorial_url,
      }));

      setServiciosActivos(lista);
      setCargando(false);
    };
    cargar();
  }, [perfil.id]);

  // Fila superior siempre visible: usa la métrica más reciente del primer
  // servicio de módulo "social" que tenga el usuario (si tiene alguno).
  useEffect(() => {
    const cargarOverview = async () => {
      const servicioSocial = serviciosActivos.find((s) => s.modulo === "social");
      if (!servicioSocial) {
        setMetricasOverview(null);
        return;
      }
      const { data, error } = await supabase
        .from("metricas_redes")
        .select("mes, seguidores, alcance_mensual, interacciones, nuevos_seguidores, conversiones, clics, invertido")
        .eq("servicio_contratado_id", servicioSocial.id)
        .order("mes", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return; // tabla puede no existir todavía si no se corrió el SQL
      setMetricasOverview(data || null);
    };
    cargarOverview();
  }, [serviciosActivos]);

  // No hace falta un efecto para "resetear" tabActivo al cambiar de categoría:
  // si el id guardado no pertenece a la categoría activa, el find() de abajo
  // cae solo al primer servicio de esa categoría. Como bonus, si el usuario
  // vuelve a la categoría anterior, recupera la selección que tenía ahí.
  const serviciosDeCategoria = serviciosActivos.filter((s) => categoriaDeModulo(s.modulo) === categoriaActiva);

  const nombreMostrado = perfil.nombre || perfil.email;
  const servicioSeleccionado = serviciosDeCategoria.find((s) => s.id === tabActivo) || serviciosDeCategoria[0] || null;
  const servicioParaResumen = servicioSeleccionado || serviciosActivos[0] || null;
  const hayOverviewReal = metricasOverview != null;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">
            ¡Hola, <span className="text-[#ccff00]">{nombreMostrado}</span>!
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Así está hoy el estado de tus servicios con Tu Marketing.</p>
        </div>
        {servicioParaResumen && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 whitespace-nowrap">
              {servicioParaResumen.nombre}
            </span>
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              Próxima actualización el {proximaRenovacionEstimada(servicioParaResumen.otorgadoEn)}
            </span>
            <Link
              href={`/usuarios/proyectos/${servicioParaResumen.id}`}
              className="text-sm font-bold text-white hover:text-[#ccff00] transition-colors whitespace-nowrap"
            >
              Hablar con mi equipo
            </Link>
          </div>
        )}
      </div>

      {cargando ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : serviciosActivos.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
          <p className="text-neutral-400 text-lg mb-6">Todavía no contrataste ningún servicio.</p>
          <Link href="/servicios" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
            Ver nuestros servicios <span>→</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Fila superior: siempre visible, igual que en el diseño */}
          <div className="flex items-center gap-2 mb-3">
            {!hayOverviewReal && <BadgeVistaPrevia />}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 items-stretch">
            <StatOverview label="Seguidores en Instagram" valor={(metricasOverview?.seguidores ?? DEMO.seguidores).toLocaleString("es-AR")} />
            <StatOverview label="Alcance mensual" valor={(metricasOverview?.alcance_mensual ?? DEMO.alcanceMensual).toLocaleString("es-AR")} />
            <StatOverview label="Interacciones" valor={(metricasOverview?.interacciones ?? DEMO.interacciones).toLocaleString("es-AR")} />
            {servicioParaResumen ? (
              <ProgresoCircular estado={servicioParaResumen.estado} label={`Progreso · ${servicioParaResumen.nombre}`} />
            ) : (
              <StatOverview label="Progreso del proyecto" valor="—" />
            )}
            <StatOverview
              label="Entrega estimada"
              valor={servicioParaResumen?.tiempoEntrega || (servicioParaResumen ? proximaRenovacionEstimada(servicioParaResumen.otorgadoEn) : "—")}
              caption={servicioParaResumen?.nombre}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-black text-white">{TITULO_CATEGORIA[categoriaActiva]}</h2>
          </div>

          {serviciosDeCategoria.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 text-lg mb-6">
                Todavía no tenés servicios de {TITULO_CATEGORIA[categoriaActiva]} contratados.
              </p>
              <Link href="/servicios" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
                Ver nuestros servicios <span>→</span>
              </Link>
            </div>
          ) : (
            <>
              {serviciosDeCategoria.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {serviciosDeCategoria.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTabActivo(s.id)}
                      className={`text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${
                        (tabActivo || serviciosDeCategoria[0].id) === s.id
                          ? "bg-[#ccff00] text-black"
                          : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-[#ccff00]/40"
                      }`}
                    >
                      {s.nombre}
                    </button>
                  ))}
                </div>
              )}

              {servicioSeleccionado && <DetalleServicio key={servicioSeleccionado.id} servicio={servicioSeleccionado} />}
            </>
          )}
        </>
      )}
    </>
  );
}
