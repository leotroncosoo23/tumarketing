"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useAlumnoSession } from "@/lib/useAlumnoSession";
import { obtenerUrlEmbed } from "@/lib/media";

type Curso = { id: string; titulo: string };
type Leccion = { id: string; titulo: string; video_url: string; orden: number };

export default function AulaVirtualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { perfil, cargando } = useAlumnoSession();

  const [inscripcionId, setInscripcionId] = useState<string | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [leccionActiva, setLeccionActivaState] = useState<Leccion | null>(null);
  const [cargandoCurso, setCargandoCurso] = useState(true);

  const inscripto = inscripcionId !== null ? true : cargandoCurso ? null : false;

  const marcarComoVista = async (idInscripcion: string, idLeccion: string) => {
    await supabase.from("inscripciones").update({ ultima_leccion_id: idLeccion }).eq("id", idInscripcion);
  };

  useEffect(() => {
    if (!perfil) return;

    const cargar = async () => {
      const { data: inscripcion } = await supabase
        .from("inscripciones")
        .select("id, ultima_leccion_id")
        .eq("usuario_id", perfil.id)
        .eq("curso_id", id)
        .maybeSingle();

      if (!inscripcion) {
        setCargandoCurso(false);
        return;
      }
      setInscripcionId(inscripcion.id);

      const [{ data: cursoData }, { data: leccionesData }] = await Promise.all([
        supabase.from("cursos").select("id, titulo").eq("id", id).single(),
        supabase.from("lecciones").select("*").eq("curso_id", id).order("orden", { ascending: true }),
      ]);

      setCurso(cursoData || null);
      setLecciones(leccionesData || []);

      const ultimaVista = leccionesData?.find((l) => l.id === inscripcion.ultima_leccion_id);
      const leccionInicial = ultimaVista || (leccionesData && leccionesData[0]) || null;
      setLeccionActivaState(leccionInicial);
      if (leccionInicial) marcarComoVista(inscripcion.id, leccionInicial.id);

      setCargandoCurso(false);
    };

    cargar();
  }, [perfil, id]);

  const seleccionarLeccion = (leccion: Leccion) => {
    setLeccionActivaState(leccion);
    if (inscripcionId) marcarComoVista(inscripcionId, leccion.id);
  };

  if (cargando || cargandoCurso) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 flex items-center justify-center">
        <Navbar />
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }

  if (!perfil) return null;

  if (!inscripto) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No estás inscripto en este curso</h1>
          <p className="text-neutral-400 mb-8">Si creés que es un error, contactanos por WhatsApp.</p>
          <Link href="/alumnos" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
            ← Volver a mis cursos
          </Link>
        </div>
      </main>
    );
  }

  const embedUrl = leccionActiva?.video_url ? obtenerUrlEmbed(leccionActiva.video_url) : null;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/alumnos" className="text-neutral-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold transition-colors w-fit">
          ← Volver a mis cursos
        </Link>

        <h1 className="text-2xl md:text-3xl font-black mb-8">{curso?.titulo}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Reproductor */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 mb-6">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={leccionActiva?.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm">
                  {lecciones.length === 0 ? "Este curso todavía no tiene clases cargadas." : "Seleccioná una clase para verla."}
                </div>
              )}
            </div>
            {leccionActiva && (
              <h2 className="text-xl font-bold text-white">{leccionActiva.titulo}</h2>
            )}
          </div>

          {/* Temario */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-neutral-800">
                <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">Temario ({lecciones.length})</span>
              </div>
              <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto">
                {lecciones.map((leccion) => (
                  <button
                    key={leccion.id}
                    onClick={() => seleccionarLeccion(leccion)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      leccionActiva?.id === leccion.id ? "bg-[#ccff00]/10" : "hover:bg-neutral-800/40"
                    }`}
                  >
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                      leccionActiva?.id === leccion.id ? "border-[#ccff00] text-[#ccff00]" : "border-neutral-700 text-neutral-400"
                    }`}>
                      {leccion.orden}
                    </span>
                    <span className={`text-sm font-medium ${leccionActiva?.id === leccion.id ? "text-white" : "text-neutral-300"}`}>
                      {leccion.titulo}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
