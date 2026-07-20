import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContratarServicioButton from "@/components/ContratarServicioButton";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Servicio } from "@/lib/servicios";

export default async function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: servicioData } = await supabase
    .from("servicios")
    .select("*")
    .eq("id", id)
    .ilike("estado", "activo")
    .maybeSingle();

  const servicio = servicioData as Servicio | null;

  if (!servicio) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No encontramos este servicio</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
          >
            ← Volver a Servicios
          </Link>
        </div>
      </main>
    );
  }

  const caracteristicas = Array.isArray(servicio.caracteristicas) ? servicio.caracteristicas : [];

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link
          href="/servicios"
          className="text-neutral-400 hover:text-white mb-8 flex items-center gap-2 text-sm font-bold transition-colors w-fit"
        >
          ← Volver a Servicios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {servicio.categorias?.map((c) => (
                <span
                  key={c}
                  className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                >
                  {c}
                </span>
              ))}
              {servicio.destacado && (
                <span className="bg-gradient-to-r from-[#ccff00] to-lime-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  ⭐ Destacado
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{servicio.titulo}</h1>

            {servicio.descripcion_corta && (
              <p className="text-neutral-300 text-lg leading-relaxed mb-6">{servicio.descripcion_corta}</p>
            )}

            {servicio.descripcion_detallada && (
              <p className="text-neutral-400 leading-relaxed mb-10 whitespace-pre-wrap">
                {servicio.descripcion_detallada}
              </p>
            )}

            {caracteristicas.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black mb-6">Qué incluye</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caracteristicas.map((item, indice) => (
                    <li
                      key={indice}
                      className="flex items-start gap-3 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-5 h-5 shrink-0 text-[#ccff00] mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span className="text-neutral-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SIDEBAR STICKY */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <p className="text-white font-black text-4xl">
                    ${Number(servicio.precio_ars || 0).toLocaleString("es-AR")}
                  </p>
                  <span className="text-neutral-500 text-xs">ARS</span>
                </div>

                <ContratarServicioButton servicio={servicio} />

                <div className="border-t border-neutral-800 mt-6 pt-6 space-y-3 text-sm">
                  {(servicio.categorias?.length ?? 0) > 0 && (
                    <div className="flex items-start gap-3 text-neutral-400">
                      <span>🏷️</span>
                      <span>
                        Categorías: <span className="text-white font-bold">{servicio.categorias.join(", ")}</span>
                      </span>
                    </div>
                  )}
                  {servicio.tiempo_entrega && (
                    <div className="flex items-center gap-3 text-neutral-400">
                      <span>⏱️</span> Entrega: <span className="text-white font-bold">{servicio.tiempo_entrega}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
