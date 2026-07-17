"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const VEINTIUN_DIAS_MS = 1000 * 60 * 60 * 24 * 21;

type Curso = {
  id: string;
  titulo: string;
  categoria: string | null;
  duracion: string | null;
  nivel: string | null;
  precio: number;
  precio_descuento: number | null;
  oferta_activa: boolean;
  oferta_etiqueta: string | null;
  oferta_fecha_fin: string | null;
  creado_en: string;
};

type InscripcionConCurso = {
  id: string;
  progreso: number;
  cursos: { id: string; titulo: string; imagen_url: string | null; modalidad: string | null } | null;
};

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [vista, setVista] = useState<"catalogo" | "mis-cursos">("catalogo");
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [misInscripciones, setMisInscripciones] = useState<InscripcionConCurso[]>([]);
  const [cargandoMisCursos, setCargandoMisCursos] = useState(false);
  // Capturado una sola vez al montar: "esNuevo" no necesita recalcularse en cada
  // render, y Date.now() no puede llamarse directamente durante el render.
  const [ahora] = useState(() => Date.now());

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const { data, error } = await supabase.from("cursos").select("*");

        if (error) {
          console.error("Error al cargar cursos:", error);
          setCursos([]);
        } else {
          setCursos(data || []);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchCursos();
  }, []);

  // Chequeamos si hay sesión activa, sin redirigir a nadie: acá el catálogo sigue siendo público.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user);
      setCargandoUsuario(false);
    });

    const { data: subscripcion } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });

    return () => subscripcion.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!usuario) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMisInscripciones([]);
      return;
    }
    const fetchMisCursos = async () => {
      setCargandoMisCursos(true);
      const { data, error } = await supabase
        .from("inscripciones")
        .select("id, progreso, cursos (id, titulo, imagen_url, modalidad)")
        .eq("usuario_id", usuario.id);

      if (error) console.error("Error al traer tus cursos:", error.message);
      setMisInscripciones((data as unknown as InscripcionConCurso[]) || []);
      setCargandoMisCursos(false);
    };
    fetchMisCursos();
  }, [usuario]);

  const categorias = useMemo(
    () => Array.from(new Set(cursos.map((c) => c.categoria).filter((c): c is string => Boolean(c)))),
    [cursos]
  );

  const cursosFiltrados = cursos.filter((curso) => {
    const coincideBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaFiltro || curso.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Cabecera de la página */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-neutral-900 pb-8 gap-6">
          <div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">Cursos</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl">
              Fórmate con las estrategias exactas que usamos todos los días para escalar negocios. Elige tu próximo paso.
            </p>
          </div>

          {/* Selector: Catálogo vs Mis Cursos */}
          <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setVista("catalogo")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                vista === "catalogo" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-white font-medium"
              }`}
            >
              Catálogo Completo
            </button>
            <button
              onClick={() => setVista("mis-cursos")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                vista === "mis-cursos" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-white font-medium"
              }`}
            >
              {usuario ? "Mis Cursos" : "Mis Cursos (Login)"}
            </button>
          </div>
        </div>

        {vista === "catalogo" ? (
        <>
        {/* Buscador y filtro de categoría */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cursos..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors"
            />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors sm:w-64"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Grilla de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cargando ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400">Cargando cursos...</p>
            </div>
          ) : cursosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400 text-lg">
                {cursos.length === 0 ? "No hay cursos disponibles todavía." : "Ningún curso coincide con tu búsqueda."}
              </p>
            </div>
          ) : (
            cursosFiltrados.map((curso) => {
              const esNuevo = ahora - new Date(curso.creado_en).getTime() < VEINTIUN_DIAS_MS;
              const porcentajeOff = curso.precio_descuento
                ? Math.round((1 - curso.precio_descuento / curso.precio) * 100)
                : null;

              return (
                <div
                  key={curso.id}
                  className="relative bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300 flex flex-col"
                >
                  {/* Cinta de oferta especial */}
                  {curso.oferta_activa && (
                    <div className="absolute top-4 left-0 z-10 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-black text-xs font-black px-4 py-1.5 rounded-r-full shadow-lg flex items-center gap-1.5">
                      🔥 {curso.oferta_etiqueta || "Oferta especial"}
                    </div>
                  )}

                  <div className={`p-6 flex flex-col flex-grow ${curso.oferta_activa ? "pt-12" : ""}`}>
                    {/* Categoría + Nuevo */}
                    <div className="flex items-center justify-between mb-4 gap-2">
                      {curso.categoria ? (
                        <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold">
                          {curso.categoria}
                        </span>
                      ) : <span />}
                      {esNuevo && (
                        <span className="border border-orange-400/50 text-orange-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                          Nuevo
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 leading-snug">{curso.titulo}</h3>

                    {/* Detalles rápidos */}
                    <div className="space-y-1.5 mb-6 text-sm">
                      <p className="text-neutral-400"><span className="text-neutral-500">Nivel:</span> <span className="text-white font-medium">{curso.nivel}</span></p>
                      {curso.duracion && (
                        <p className="text-neutral-400"><span className="text-neutral-500">Duración:</span> <span className="text-white font-medium">{curso.duracion}</span></p>
                      )}
                      <p className="text-neutral-400"><span className="text-neutral-500">Certificado:</span> <span className="text-white font-medium">Digital, al finalizar</span></p>
                    </div>

                    <div className="flex-grow" />

                    {/* Precio */}
                    <div className="pt-4 border-t border-neutral-800/50 mb-5">
                      {curso.precio_descuento ? (
                        <>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-[#ccff00] text-black text-xs font-black px-2 py-0.5 rounded-full">{porcentajeOff}% OFF</span>
                            <span className="text-neutral-500 line-through text-sm">${curso.precio.toLocaleString("es-AR")}</span>
                          </div>
                          <p className="text-2xl font-black text-white">
                            ${curso.precio_descuento.toLocaleString("es-AR")} <span className="text-xs font-normal text-neutral-500">ARS</span>
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-black text-white">
                          ${curso.precio.toLocaleString("es-AR")} <span className="text-xs font-normal text-neutral-500">ARS</span>
                        </p>
                      )}
                    </div>

                    <Link href={`/cursos/${curso.id}`}>
                      <button className="w-full bg-[#ccff00] text-black px-5 py-3 rounded-xl font-black hover:bg-[#b8e600] transition-all flex justify-center items-center gap-2">
                        Ver curso <span>→</span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </>
        ) : (
          <div>
            {cargandoUsuario ? null : !usuario ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
                <p className="text-neutral-400 text-lg mb-6">Iniciá sesión para ver los cursos en los que estás inscripto.</p>
                <Link href="/login" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
                  Iniciar sesión <span>→</span>
                </Link>
              </div>
            ) : cargandoMisCursos ? (
              <div className="text-center py-16 text-neutral-400">Cargando tus cursos...</div>
            ) : misInscripciones.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
                <p className="text-neutral-400 text-lg mb-6">Todavía no estás inscripto en ningún curso.</p>
                <button
                  onClick={() => setVista("catalogo")}
                  className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
                >
                  Ver catálogo completo <span>→</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {misInscripciones.map((insc) => (
                  <div key={insc.id} className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#ccff00]/50 transition-all duration-300 flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-neutral-800">
                      {insc.cursos?.imagen_url ? (
                        <img src={insc.cursos.imagen_url} alt={insc.cursos.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                        {insc.cursos?.titulo || "Curso eliminado"}
                      </h3>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                          <span className="text-neutral-500 uppercase tracking-wide">Progreso</span>
                          <span className="text-[#ccff00]">{insc.progreso}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div className="bg-[#ccff00] h-2 rounded-full transition-all" style={{ width: `${insc.progreso}%` }} />
                        </div>
                      </div>
                      {insc.cursos && (
                        <Link
                          href={`/alumnos/cursos/${insc.cursos.id}`}
                          className="mt-auto w-full bg-[#ccff00] text-black px-5 py-3 rounded-xl font-bold hover:bg-[#b8e600] transition-all flex justify-center items-center gap-2"
                        >
                          Continuar curso <span>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </section>
    </main>
  );
}
