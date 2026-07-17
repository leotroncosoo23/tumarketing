"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { obtenerUrlEmbed } from "@/lib/media";

type Curso = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  precio_descuento: number | null;
  imagen_url: string;
  video_url: string;
  duracion: string;
  nivel: string;
  modalidad: string;
  requisitos: string;
  para_quien: string;
  aprendizajes: string;
  oferta_activa: boolean;
  oferta_etiqueta: string | null;
  oferta_fecha_fin: string | null;
};

type Leccion = { id: string; titulo: string; orden: number };

const FAQS = [
  {
    pregunta: "¿Cómo es la modalidad de cursada?",
    respuesta: "Depende del curso: puede ser a tu ritmo (con clases grabadas que ves cuando quieras) o en vivo. Lo indicamos siempre en los detalles de cada curso.",
  },
  {
    pregunta: "¿Recibo un certificado al finalizar?",
    respuesta: "Sí, al completar todas las lecciones del curso te entregamos un certificado digital que podés compartir en tu perfil profesional.",
  },
  {
    pregunta: "¿Puedo hacer consultas durante el curso?",
    respuesta: "Sí. Vas a tener acceso directo a nuestro equipo por WhatsApp para resolver dudas mientras avanzás con el contenido.",
  },
];

export default function CursoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [curso, setCurso] = useState<Curso | null>(null);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [cargando, setCargando] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState<string | null>(null);
  const [verRequisitos, setVerRequisitos] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const [{ data: cursoData }, { data: leccionesData }, { data: configData }] = await Promise.all([
        supabase.from("cursos").select("*").eq("id", id).single(),
        supabase.from("lecciones").select("*").eq("curso_id", id).order("orden", { ascending: true }),
        supabase.from("configuracion").select("whatsapp_numero").eq("id", 1).single(),
      ]);
      setCurso(cursoData || null);
      setLecciones(leccionesData || []);
      setWhatsapp(configData?.whatsapp_numero || "");
      setCargando(false);
    };
    cargar();
  }, [id]);

  useEffect(() => {
    // Sincroniza con un timer externo (setInterval más abajo): es un caso
    // legítimo de efecto, no un simple fetch-on-mount.
    if (!curso?.oferta_activa || !curso.oferta_fecha_fin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTiempoRestante(null);
      return;
    }
    const fechaFin = curso.oferta_fecha_fin;

    const actualizar = () => {
      const diff = new Date(fechaFin).getTime() - Date.now();
      if (diff <= 0) {
        setTiempoRestante(null);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTiempoRestante(`${d}d ${h}h ${m}m ${s}s`);
    };

    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, [curso?.oferta_activa, curso?.oferta_fecha_fin]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 flex items-center justify-center">
        <Navbar />
        <p className="text-neutral-400">Cargando curso...</p>
      </main>
    );
  }

  if (!curso) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No encontramos este curso</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link href="/cursos" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const embedUrl = curso.video_url ? obtenerUrlEmbed(curso.video_url) : null;
  const porcentajeOff = curso.precio_descuento
    ? Math.round((1 - curso.precio_descuento / curso.precio) * 100)
    : null;

  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensajeWhatsapp = encodeURIComponent(`Hola! Quiero más información sobre el curso "${curso.titulo}" 🚀`);
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensajeWhatsapp}` : "#contacto";

  const paraQuienItems = (curso.para_quien || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const aprendizajesItems = (curso.aprendizajes || "")
    .split("\n")
    .map((s) => s.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/cursos" className="text-neutral-400 hover:text-white mb-8 flex items-center gap-2 text-sm font-bold transition-colors w-fit">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {curso.nivel}
              </span>
              <span className="bg-neutral-900 text-neutral-400 border border-neutral-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {curso.modalidad}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{curso.titulo}</h1>

            <p className="text-neutral-400 text-lg leading-relaxed mb-8 whitespace-pre-wrap">{curso.descripcion}</p>

            {embedUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 mb-10 bg-neutral-900">
                <iframe
                  src={embedUrl}
                  title="Tráiler del curso"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            )}

            {/* Pills de detalles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl">⏱️</span>
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase font-bold">Duración</p>
                  <p className="text-white font-bold text-sm">{curso.duracion || "A definir"}</p>
                </div>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase font-bold">Nivel</p>
                  <p className="text-white font-bold text-sm">{curso.nivel}</p>
                </div>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase font-bold">Módulos</p>
                  <p className="text-white font-bold text-sm">{lecciones.length || "Próximamente"}</p>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            {curso.requisitos && (
              <div className="mb-10 border-b border-neutral-900 pb-8">
                <button
                  onClick={() => setVerRequisitos(!verRequisitos)}
                  className="flex items-center gap-2 text-[#ccff00] font-bold hover:text-[#b8e600] transition-colors"
                >
                  Ver requisitos
                  <svg className={`w-4 h-4 transition-transform ${verRequisitos ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {verRequisitos && (
                  <p className="text-neutral-400 text-sm leading-relaxed mt-4 whitespace-pre-wrap">{curso.requisitos}</p>
                )}
              </div>
            )}

            {/* Para quién es */}
            {paraQuienItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black mb-6">¿Para quién es este curso?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {paraQuienItems.map((item, i) => (
                    <div key={i} className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                      <span className="text-[#ccff00] text-xl">✦</span>
                      <p className="text-neutral-300 text-sm leading-relaxed mt-2">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Al finalizar */}
            {aprendizajesItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black mb-6">Al finalizar, vas a poder:</h2>
                <ul className="space-y-3">
                  {aprendizajesItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] text-xs">✓</span>
                      <span className="text-neutral-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Programa del curso */}
            <div className="mb-12">
              <h2 className="text-2xl font-black mb-6">Programa del curso</h2>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
                {lecciones.length === 0 ? (
                  <p className="p-8 text-center text-neutral-500 text-sm">Muy pronto vamos a publicar el programa completo de este curso.</p>
                ) : (
                  <div className="divide-y divide-neutral-800">
                    {lecciones.map((leccion) => (
                      <div key={leccion.id} className="p-4 flex items-center gap-4 hover:bg-neutral-800/40 transition-colors">
                        <span className="shrink-0 w-9 h-9 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-[#ccff00] text-sm">
                          {leccion.orden}
                        </span>
                        <h4 className="font-bold text-white text-sm">{leccion.titulo}</h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-black mb-6">Preguntas Frecuentes</h2>
              <div className="flex flex-col gap-4">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-white">
                      {faq.pregunta}
                      <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00] shrink-0 ml-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-1">
                      {faq.respuesta}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR STICKY */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Cartel de oferta */}
              {curso.oferta_activa && (curso.oferta_etiqueta || porcentajeOff) && (
                <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-black px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black italic text-lg leading-none">
                      {curso.oferta_etiqueta || "Oferta especial"}
                    </span>
                    {porcentajeOff && <span className="font-black text-2xl leading-none">-{porcentajeOff}%</span>}
                  </div>
                  {tiempoRestante && (
                    <p className="text-black/70 text-xs font-bold mt-2 flex items-center gap-1.5">
                      ⏳ Finaliza en: {tiempoRestante}
                    </p>
                  )}
                </div>
              )}

              <div className="p-6 md:p-8">
                {curso.precio_descuento ? (
                  <div className="mb-6">
                    <span className="text-neutral-500 line-through text-sm">${curso.precio.toLocaleString("es-AR")}</span>
                    <p className="text-white font-black text-4xl">${curso.precio_descuento.toLocaleString("es-AR")}</p>
                    <span className="text-neutral-500 text-xs">ARS</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-white font-black text-4xl">${curso.precio.toLocaleString("es-AR")}</p>
                    <span className="text-neutral-500 text-xs">ARS</span>
                  </div>
                )}

                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
                >
                  Comprar curso <span>→</span>
                </a>
                <p className="text-neutral-500 text-xs text-center mt-3">
                  💬 Te respondemos por WhatsApp para coordinar el pago y el acceso.
                </p>

                <div className="border-t border-neutral-800 mt-6 pt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <span>⏱️</span> Duración: <span className="text-white font-bold">{curso.duracion || "A definir"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-400">
                    <span>🎬</span> Modalidad: <span className="text-white font-bold">{curso.modalidad}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-400">
                    <span>📚</span> Clases: <span className="text-white font-bold">{lecciones.length || "Próximamente"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
