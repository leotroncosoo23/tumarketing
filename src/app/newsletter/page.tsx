import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function NewsletterPage() {
  const supabase = await createSupabaseServerClient();

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("estado", "Publicado")
    .order("creado_en", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error al cargar artículos:", error.message);
  }

  const articulos = blogs || [];

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#ccff00]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <span className="inline-block bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Newsletter Oficial
            </span>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.05]">
              Recibí novedades de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
                Marketing Digital
              </span>{" "}
              [Gratis]
            </h1>

            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-xl">
              Sumate a la comunidad que recibe todos los meses las últimas tendencias, ideas de negocio, herramientas nuevas y contenido útil para hacer crecer tu marca.
            </p>

            <NewsletterForm />
          </div>

          {/* Visual decorativo */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute w-72 h-72 bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-2xl w-full max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-xl shrink-0">
                  📬
                </span>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">TuMarketing</p>
                  <p className="text-neutral-500 text-xs">hola@tumarketing.ar</p>
                </div>
              </div>
              <p className="text-white font-bold mb-2">¡Llegó tu newsletter! 🔔</p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Nuevas tendencias, herramientas y estrategias de marketing, directo a tu bandeja de entrada.
              </p>
              <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center gap-2 text-xs text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                Sin spam. Cancelás cuando quieras.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOGS HABILITADOS */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-neutral-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
              Lo último del{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
                Blog
              </span>
            </h2>
            <p className="text-neutral-400 text-lg">Una muestra de lo que te vas a encontrar en tu email.</p>
          </div>
          <Link href="/blog" className="text-[#ccff00] hover:text-white transition-colors font-semibold text-sm whitespace-nowrap">
            Ver todo el blog →
          </Link>
        </div>

        {articulos.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
            <p className="text-neutral-400 text-lg">Todavía no hay artículos publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulos.map((blog) => (
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
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ccff00] transition-colors">
                      {blog.titulo}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6 flex-grow line-clamp-3">{blog.resumen}</p>

                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-neutral-800/50 text-xs text-neutral-500">
                      <span className="truncate">{blog.autor || "Equipo TuMarketing"}</span>
                      <span className="shrink-0">
                        {new Date(blog.creado_en).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
