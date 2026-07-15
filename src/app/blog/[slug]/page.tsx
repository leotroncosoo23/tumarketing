"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { renderizarContenidoBlog } from "@/lib/blogContenido";
import { iniciales } from "@/lib/iniciales";

type Blog = {
  id: string;
  titulo: string;
  slug: string;
  autor: string | null;
  resumen: string;
  contenido: string;
  imagen_url: string;
  categoria: string;
  estado: string;
  creado_en: string;
};

type Comentario = {
  id: string;
  nombre: string;
  comentario: string;
  creado_en: string;
};

export default function BlogDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [otrosBlogs, setOtrosBlogs] = useState<Blog[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nombreComentario, setNombreComentario] = useState("");
  const [textoComentario, setTextoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  const cargarComentarios = async (blogId: string) => {
    const { data } = await supabase
      .from("comentarios_blog")
      .select("*")
      .eq("blog_id", blogId)
      .order("creado_en", { ascending: false });
    setComentarios(data || []);
  };

  useEffect(() => {
    const cargar = async () => {
      const { data: blogData } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("estado", "Publicado")
        .single();

      setBlog(blogData || null);

      if (blogData) {
        const [{ data: otros }] = await Promise.all([
          supabase
            .from("blogs")
            .select("*")
            .eq("estado", "Publicado")
            .neq("id", blogData.id)
            .order("creado_en", { ascending: false })
            .limit(5),
          cargarComentarios(blogData.id),
        ]);
        setOtrosBlogs(otros || []);
      }
      setCargando(false);
    };
    cargar();
  }, [slug]);

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !nombreComentario.trim() || !textoComentario.trim()) return;

    setEnviandoComentario(true);
    const { error } = await supabase.from("comentarios_blog").insert([
      { blog_id: blog.id, nombre: nombreComentario.trim(), comentario: textoComentario.trim() },
    ]);

    if (error) {
      alert("Error al publicar tu comentario: " + error.message);
    } else {
      setNombreComentario("");
      setTextoComentario("");
      await cargarComentarios(blog.id);
    }
    setEnviandoComentario(false);
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 flex items-center justify-center">
        <Navbar />
        <p className="text-neutral-400">Cargando artículo...</p>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No encontramos este artículo</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
            ← Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const fecha = new Date(blog.creado_en).toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const autor = blog.autor || "Equipo TuMarketing";

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link href="/" className="hover:text-[#ccff00] transition-colors">🏠</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#ccff00] transition-colors">Blog</Link>
          {blog.categoria && (
            <>
              <span>/</span>
              <span className="text-neutral-300">{blog.categoria}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{blog.titulo}</h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">{blog.resumen}</p>

            {/* Autor y meta */}
            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-neutral-900">
              <div className="w-11 h-11 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center font-black text-[#ccff00] shrink-0">
                {iniciales(autor)}
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-white text-sm break-words">{autor}</p>
                <p className="text-neutral-500 text-xs">Actualizado el {fecha}hs ART</p>
              </div>
              <a
                href={`#comentarios`}
                className="shrink-0 flex items-center gap-1.5 text-neutral-400 hover:text-[#ccff00] text-sm font-bold transition-colors"
              >
                💬 {comentarios.length}
              </a>
            </div>

            {blog.imagen_url && (
              <div className="rounded-2xl overflow-hidden border border-neutral-800 mb-10">
                <img src={blog.imagen_url} alt={blog.titulo} className="w-full object-cover" />
              </div>
            )}

            {/* Cuerpo del artículo */}
            <div className="mb-16">{renderizarContenidoBlog(blog.contenido)}</div>

            {/* Comentarios */}
            <div id="comentarios" className="scroll-mt-28">
              <h2 className="text-2xl font-black mb-6">Comentarios ({comentarios.length})</h2>

              <form onSubmit={handleComentar} className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 mb-8 space-y-4">
                <input
                  type="text"
                  required
                  value={nombreComentario}
                  onChange={(e) => setNombreComentario(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                />
                <textarea
                  required
                  value={textoComentario}
                  onChange={(e) => setTextoComentario(e.target.value)}
                  placeholder="Escribí tu comentario..."
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={enviandoComentario}
                  className="bg-[#ccff00] text-black font-black px-6 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {enviandoComentario ? "Publicando..." : "Publicar comentario"}
                </button>
              </form>

              <div className="space-y-4">
                {comentarios.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-8">Sé el primero en comentar este artículo.</p>
                ) : (
                  comentarios.map((c) => (
                    <div key={c.id} className="flex gap-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-300 shrink-0 text-sm">
                        {iniciales(c.nombre)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-white text-sm">{c.nombre}</span>
                          <span className="text-neutral-500 text-xs">
                            {new Date(c.creado_en).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-sm leading-relaxed">{c.comentario}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl overflow-hidden">
              <div className="bg-neutral-950 px-5 py-4 border-b border-neutral-800">
                <span className="text-xs font-black uppercase tracking-wider text-[#ccff00]">Más artículos</span>
              </div>
              <div className="divide-y divide-neutral-800">
                {otrosBlogs.length === 0 ? (
                  <p className="p-5 text-neutral-500 text-sm">No hay más artículos todavía.</p>
                ) : (
                  otrosBlogs.map((b) => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="flex gap-3 p-4 hover:bg-neutral-800/40 transition-colors group">
                      <div className="w-16 h-16 shrink-0 bg-neutral-800 rounded-xl overflow-hidden">
                        {b.imagen_url ? (
                          <img src={b.imagen_url} alt={b.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-40">📄</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-[#ccff00] transition-colors">{b.titulo}</h4>
                        {b.categoria && <span className="text-neutral-500 text-xs">{b.categoria}</span>}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
