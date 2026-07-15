"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Users,
  Zap,
  MoonStar,
  GraduationCap,
  Newspaper,
  Ticket,
  Calendar,
  FlaskConical,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Ingresos y ventas: todavía no existe una tabla de pagos/ventas en Supabase,
// así que estos números siguen siendo de ejemplo hasta que se defina cómo se
// van a registrar los pagos (carga manual o integración con una pasarela).
const INGRESOS_MOCK = { mes: 450000, variacionMes: 12, anual: 2400000, historico: 8750000 };
const VENTAS_MOCK = { cantidad: 34, variacion: 8 };

type CursoRanking = { id: string; nombre: string; ventas: number };
type BlogReciente = { id: string; titulo: string; fecha: string };
type CuponReciente = { id: string; codigo: string; descuento: string; activo: boolean; fecha: string };

function formatoARS(valor: number) {
  return `$${valor.toLocaleString("es-AR")}`;
}

function Delta({ valor }: { valor: number }) {
  const positivo = valor >= 0;
  const Icono = positivo ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${positivo ? "text-[#ccff00]" : "text-red-400"}`}>
      <Icono className="w-3.5 h-3.5" />
      {positivo ? "+" : ""}
      {valor}% vs. mes anterior
    </span>
  );
}

export default function ResumenTab() {
  const [cargando, setCargando] = useState(true);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [alumnosActivos, setAlumnosActivos] = useState(0);
  const [alumnosInactivos, setAlumnosInactivos] = useState(0);
  const [topCursos, setTopCursos] = useState<CursoRanking[]>([]);
  const [ultimosBlogs, setUltimosBlogs] = useState<BlogReciente[]>([]);
  const [ultimosCupones, setUltimosCupones] = useState<CuponReciente[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const [alumnosRes, inscripcionesRes, blogsRes, cuponesRes] = await Promise.all([
        supabase.from("usuarios").select("activo").eq("rol", "alumno"),
        supabase.from("inscripciones").select("curso_id, cursos(titulo)"),
        supabase
          .from("blogs")
          .select("id, titulo, creado_en")
          .eq("estado", "Publicado")
          .order("creado_en", { ascending: false })
          .limit(3),
        supabase
          .from("cupones")
          .select("id, codigo, tipo_descuento, valor, activo, creado_en")
          .order("creado_en", { ascending: false })
          .limit(4),
      ]);

      const alumnos = alumnosRes.data || [];
      setTotalAlumnos(alumnos.length);
      setAlumnosActivos(alumnos.filter((a) => a.activo).length);
      setAlumnosInactivos(alumnos.filter((a) => !a.activo).length);

      // Sin tabla de ventas propia, contamos inscripciones por curso como proxy.
      const conteoPorCurso = new Map<string, { nombre: string; ventas: number }>();
      (inscripcionesRes.data || []).forEach((insc: any) => {
        const nombre = insc.cursos?.titulo || "Curso eliminado";
        const actual = conteoPorCurso.get(insc.curso_id) || { nombre, ventas: 0 };
        actual.ventas += 1;
        conteoPorCurso.set(insc.curso_id, actual);
      });
      const ranking = Array.from(conteoPorCurso.entries())
        .map(([id, valor]) => ({ id, ...valor }))
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 3);
      setTopCursos(ranking);

      setUltimosBlogs(
        (blogsRes.data || []).map((b: any) => ({
          id: b.id,
          titulo: b.titulo,
          fecha: new Date(b.creado_en).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        }))
      );

      setUltimosCupones(
        (cuponesRes.data || []).map((c: any) => ({
          id: c.id,
          codigo: c.codigo,
          descuento: c.tipo_descuento === "porcentaje" ? `${c.valor}%` : `$${Number(c.valor).toLocaleString("es-AR")}`,
          activo: c.activo,
          fecha: new Date(c.creado_en).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        }))
      );

      setCargando(false);
    };

    cargar();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black">Panel General</h1>
          <p className="text-neutral-400 text-sm">Resumen rápido de la actividad de la plataforma.</p>
        </div>
        {cargando && <span className="text-xs text-[#ccff00] animate-pulse font-bold">Sincronizando...</span>}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* FILA 1 — Ingresos y ventas (datos de ejemplo, sin tabla de pagos todavía) */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-neutral-500">
            <FlaskConical className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Datos de ejemplo — todavía no hay una tabla de pagos/ventas conectada
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Hero: Ingresos del Mes */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border border-[#ccff00]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(204,255,0,0.08)]">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ccff00]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center">
                  <Banknote className="w-6 h-6" />
                </div>
                <Delta valor={INGRESOS_MOCK.variacionMes} />
              </div>
              <p className="relative text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Ingresos del Mes
              </p>
              <p className="relative text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatoARS(INGRESOS_MOCK.mes)}
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Ingresos Anuales</p>
                <p className="text-3xl font-black text-white">{formatoARS(INGRESOS_MOCK.anual)}</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Total Histórico</p>
                <p className="text-3xl font-black text-white">{formatoARS(INGRESOS_MOCK.historico)}</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Ventas del Mes</p>
                <p className="text-3xl font-black text-white mb-1">+{VENTAS_MOCK.cantidad}</p>
                <Delta valor={VENTAS_MOCK.variacion} />
              </div>
            </div>
          </div>
        </div>

        {/* FILA 2 — Alumnos (datos reales de "usuarios") */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 truncate">Total de Alumnos</p>
              <p className="text-3xl font-black text-white">{totalAlumnos}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 truncate">Alumnos Activos</p>
              <p className="text-3xl font-black text-white">{alumnosActivos}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-neutral-800 text-neutral-400 flex items-center justify-center">
              <MoonStar className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 truncate">Alumnos Inactivos</p>
              <p className="text-3xl font-black text-white">{alumnosInactivos}</p>
            </div>
          </div>
        </div>

        {/* FILA 3 — Rendimiento: Top Cursos + Últimos artículos del blog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950/50 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-[#ccff00]" />
              <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
                Top Cursos (por inscripciones)
              </span>
            </div>
            <div className="divide-y divide-neutral-800">
              {topCursos.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  {cargando ? "Cargando..." : "Todavía no hay inscripciones."}
                </div>
              ) : (
                topCursos.map((curso, indice) => (
                  <div key={curso.id} className="p-4 flex items-center gap-4 hover:bg-neutral-800/40 transition-colors">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-[#ccff00] text-sm">
                      {indice + 1}
                    </span>
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg">
                      🎓
                    </div>
                    <p className="min-w-0 flex-grow font-medium text-white text-sm truncate">{curso.nombre}</p>
                    <span className="shrink-0 text-[#ccff00] font-bold text-sm">{curso.ventas} inscriptos</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950/50 flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-[#ccff00]" />
              <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
                Últimos Artículos del Blog
              </span>
            </div>
            <div className="divide-y divide-neutral-800">
              {ultimosBlogs.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  {cargando ? "Cargando..." : "Todavía no hay artículos publicados."}
                </div>
              ) : (
                ultimosBlogs.map((post, indice) => (
                  <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-neutral-800/40 transition-colors">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-[#ccff00] text-sm">
                      {indice + 1}
                    </span>
                    <p className="min-w-0 flex-grow font-medium text-white text-sm truncate">{post.titulo}</p>
                    <span className="shrink-0 flex items-center gap-1.5 text-neutral-400 font-bold text-xs">
                      <Calendar className="w-4 h-4" />
                      {post.fecha}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FILA 4 — Últimos cupones creados (la tabla no registra quién los usa) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-neutral-800 bg-neutral-950/50 flex items-center gap-3">
            <Ticket className="w-5 h-5 text-[#ccff00]" />
            <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">Últimos Cupones Creados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold">Cupón</th>
                  <th className="px-5 py-3 font-bold">Descuento</th>
                  <th className="px-5 py-3 font-bold">Estado</th>
                  <th className="px-5 py-3 font-bold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {ultimosCupones.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-neutral-400">
                      {cargando ? "Cargando..." : "Todavía no creaste ningún cupón."}
                    </td>
                  </tr>
                ) : (
                  ultimosCupones.map((cupon) => (
                    <tr key={cupon.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-2.5 py-1 rounded-full text-xs font-bold">
                          {cupon.codigo}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-300 font-bold whitespace-nowrap">{cupon.descuento}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            cupon.activo ? "bg-[#ccff00]/20 text-[#ccff00]" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {cupon.activo ? "🟢 Activo" : "🔴 Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-400 whitespace-nowrap">{cupon.fecha}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
