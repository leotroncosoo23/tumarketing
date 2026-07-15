"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RecursosPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [guias, setGuias] = useState<any[]>([]);
  const [cargandoGuias, setCargandoGuias] = useState(true);

  useEffect(() => {
    const fetchGuias = async () => {
      const { data, error } = await supabase
        .from("recursos")
        .select("*")
        .eq("estado", "Publicado")
        .order("creado_en", { ascending: false });

      if (error) {
        console.error("Error al cargar recursos:", error.message);
        setGuias([]);
      } else {
        setGuias(data || []);
      }
      setCargandoGuias(false);
    };

    fetchGuias();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("estado", "Publicado")
        .order("creado_en", { ascending: false });

      if (error) {
        console.error("Error al cargar blogs:", error.message);
        setBlogs([]);
      } else {
        setBlogs(data || []);
      }
      setCargando(false);
    };

    fetchBlogs();
  }, []);

  const blogsFiltrados = blogs.filter(blog =>
    blog.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (blog.resumen && blog.resumen.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HERO DE RECURSOS */}
        <section className="text-center max-w-3xl mx-auto py-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Recursos y <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">Herramientas</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Todo lo que necesitas para potenciar tu marketing en un solo lugar. Artículos, guías descargables y tendencias del sector, directo de nuestra agencia a tu pantalla.
          </p>
        </section>

        {/* SECCIÓN 1: GUÍAS GRATUITAS (Lead Magnets) */}
        <section id="guias" className="mb-24 scroll-mt-32">
          
          {/* Cabecera actualizada con botón "Ver todas" */}
          <div className="flex justify-between items-end mb-10">
            <div className="flex items-center gap-4 w-full">
              <h2 className="text-3xl font-bold">Guías y <span className="text-white">Recursos</span></h2>
              <div className="h-[1px] flex-grow bg-neutral-800 hidden md:block"></div>
            </div>
            <Link href="/guias" className="hidden md:block whitespace-nowrap text-[#ccff00] hover:text-white transition-colors font-semibold text-sm">
              Ver todas las guías →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cargandoGuias ? (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-400">Cargando recursos...</p>
              </div>
            ) : guias.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-400 text-lg">Todavía no hay recursos publicados.</p>
              </div>
            ) : (
              guias.map((guia) => (
                <Link key={guia.id} href={`/recursos/${guia.slug}`} className="group">
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 hover:border-[#ccff00]/50 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute -right-4 -top-4 text-7xl opacity-5 group-hover:scale-110 transition-transform duration-500">
                      {guia.icono}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      <span className="bg-neutral-950 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        {guia.formato}
                      </span>
                      {guia.tipo === "Pago" && (
                        <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold w-fit">
                          💎 ${Number(guia.precio || 0).toLocaleString("es-AR")}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3 z-10 relative">{guia.titulo}</h3>
                    <p className="text-neutral-400 text-sm mb-8 flex-grow z-10 relative">
                      {guia.descripcion_corta}
                    </p>

                    <span className="w-full relative z-10 bg-neutral-950 border border-neutral-700 text-white px-4 py-3 rounded-xl font-bold group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-colors flex justify-center items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      {guia.tipo === "Pago" ? "Ver Recurso" : "Descargar Gratis"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* SECCIÓN 2: BLOG DINÁMICO */}
        <section id="blog" className="mb-24 scroll-mt-32">
          <div className="mb-10">
            <div className="flex items-center gap-4 w-full mb-6">
              <h2 className="text-3xl font-bold">Blog y <span className="text-[#ccff00]">Artículos</span></h2>
              <div className="h-[1px] flex-grow bg-neutral-800 hidden md:block"></div>
            </div>
            
            {/* Buscador */}
            <input
              type="text"
              placeholder="🔍 Buscar artículos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-3 text-white focus:border-[#ccff00] outline-none transition-colors"
            />
          </div>

          {cargando ? (
            <div className="text-center py-12">
              <p className="text-neutral-400">Cargando artículos...</p>
            </div>
          ) : blogsFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                {busqueda ? "No encontramos artículos que coincidan." : "No hay artículos disponibles todavía."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogsFiltrados.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
                  <article className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden bg-neutral-800">
                      {blog.imagen_url ? (
                        <img
                          src={blog.imagen_url}
                          alt={blog.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
                      )}
                      {blog.categoria && (
                        <span className="absolute top-4 left-4 bg-neutral-950/90 backdrop-blur-sm text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold">
                          {blog.categoria}
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ccff00] transition-colors">
                        {blog.titulo}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-6 flex-grow line-clamp-3">{blog.resumen}</p>

                      <div className="flex items-center justify-between gap-2 pt-4 border-t border-neutral-800/50 text-xs text-neutral-500">
                        <span className="truncate">{blog.autor || "Equipo TuMarketing"}</span>
                        <span className="shrink-0 text-[#ccff00] group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/blog" className="text-[#ccff00] hover:text-white transition-colors font-semibold text-sm">
              Ver todo el blog →
            </Link>
          </div>
        </section>

        {/* SECCIÓN 3: NEWSLETTER */}
        <section id="newsletter" className="relative scroll-mt-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-[#ccff00]/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-10 md:p-16 relative z-10 text-center overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Sumate a la <span className="text-[#ccff00]">Comunidad</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto mb-10 text-lg">
              Recibí todas las semanas un mail con estrategias accionables, novedades de las plataformas y recursos gratuitos antes que nadie. Cero spam, solo valor.
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="flex-grow bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all placeholder-neutral-600"
                required
              />
              <button 
                type="button" 
                className="bg-[#ccff00] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#b8e600] transition-transform hover:scale-105 whitespace-nowrap"
              >
                Suscribirme
              </button>
            </form>
            <p className="text-neutral-600 text-xs mt-4">
              Ya somos más de 10,000 marketers y emprendedores.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}