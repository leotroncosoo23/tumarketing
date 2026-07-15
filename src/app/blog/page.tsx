"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("estado", "Publicado")
        .order("creado_en", { ascending: false });

      if (error) {
        console.error("Error al cargar artículos:", error.message);
        setBlogs([]);
      } else {
        setBlogs(data || []);
      }
      setCargando(false);
    };
    fetchBlogs();
  }, []);

  const categorias = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.categoria).filter(Boolean))),
    [blogs]
  );

  const blogsFiltrados = blogs.filter((blog) => {
    const coincideBusqueda = blog.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaFiltro || blog.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 border-b border-neutral-900 pb-8">
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">Blog</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            Estrategias, tips y novedades de marketing digital para que hagas crecer tu marca.
          </p>
        </div>

        {/* Buscador y filtro de categoría */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar artículos..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cargando ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400">Cargando artículos...</p>
            </div>
          ) : blogsFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400 text-lg">
                {blogs.length === 0 ? "Todavía no hay artículos publicados." : "Ningún artículo coincide con tu búsqueda."}
              </p>
            </div>
          ) : (
            blogsFiltrados.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-neutral-800">
                    {blog.imagen_url ? (
                      <img
                        src={blog.imagen_url}
                        alt={blog.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-4xl">📄</div>
                    )}
                    {blog.categoria && (
                      <span className="absolute top-4 left-4 bg-neutral-950/90 backdrop-blur-sm text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold">
                        {blog.categoria}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ccff00] transition-colors">{blog.titulo}</h3>
                    <p className="text-neutral-400 text-sm mb-6 flex-grow line-clamp-3">{blog.resumen}</p>

                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-neutral-800/50 text-xs text-neutral-500">
                      <span className="truncate">{blog.autor || "Equipo TuMarketing"}</span>
                      <span className="shrink-0">
                        {new Date(blog.creado_en).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
