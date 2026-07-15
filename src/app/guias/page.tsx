"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function GuiasPage() {
  const [recursos, setRecursos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [formatoFiltro, setFormatoFiltro] = useState("");

  useEffect(() => {
    const fetchRecursos = async () => {
      const { data, error } = await supabase
        .from("recursos")
        .select("*")
        .eq("estado", "Publicado")
        .order("creado_en", { ascending: false });

      if (error) {
        console.error("Error al cargar recursos:", error.message);
        setRecursos([]);
      } else {
        setRecursos(data || []);
      }
      setCargando(false);
    };
    fetchRecursos();
  }, []);

  const formatos = useMemo(
    () => Array.from(new Set(recursos.map((r) => r.formato).filter(Boolean))),
    [recursos]
  );

  const cantidadGratis = recursos.filter((r) => r.tipo !== "Pago").length;
  const cantidadPago = recursos.filter((r) => r.tipo === "Pago").length;

  const recursosFiltrados = recursos.filter((r) => {
    const coincideBusqueda = r.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = !tipoFiltro || r.tipo === tipoFiltro;
    const coincideFormato = !formatoFiltro || r.formato === formatoFiltro;
    return coincideBusqueda && coincideTipo && coincideFormato;
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-20 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-[#ccff00]/10 blur-[130px] rounded-full pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-lime-500/10 blur-[100px] rounded-full pointer-events-none animate-float-slow" style={{ animationDelay: "-3s" }} />

        <span className="relative inline-flex items-center gap-2 text-[#ccff00] font-bold tracking-widest uppercase mb-6 text-sm">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
          Todo en un solo lugar
        </span>

        <h1 className="relative text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.05]">
          Guías que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">aceleran</span> <br />
          tu marketing
        </h1>

        <p className="relative text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Plantillas, checklists y recursos gratuitos y premium, listos para descargar y aplicar hoy mismo en tu negocio.
        </p>

        <div className="relative flex flex-wrap justify-center gap-4">
          <span className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 px-5 py-2.5 rounded-full text-sm">
            <span className="text-[#ccff00] font-black">{cantidadGratis}</span> guías gratis
          </span>
          <span className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 px-5 py-2.5 rounded-full text-sm">
            <span className="text-amber-400 font-black">{cantidadPago}</span> recursos premium
          </span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {/* Buscador y filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar guías y recursos..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors"
            />
          </div>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors sm:w-52"
          >
            <option value="">Gratis y Pago</option>
            <option value="Gratis">🎁 Solo Gratis</option>
            <option value="Pago">💎 Solo Premium</option>
          </select>
          {formatos.length > 0 && (
            <select
              value={formatoFiltro}
              onChange={(e) => setFormatoFiltro(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors sm:w-56"
            >
              <option value="">Todos los formatos</option>
              {formatos.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
        </div>

        {/* Grilla */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cargando ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400">Cargando guías...</p>
            </div>
          ) : recursosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-400 text-lg">
                {recursos.length === 0 ? "Todavía no hay guías publicadas." : "Ninguna guía coincide con tu búsqueda."}
              </p>
            </div>
          ) : (
            recursosFiltrados.map((r) => (
              <Link key={r.id} href={`/recursos/${r.slug}`} className="group">
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute -right-4 -top-4 text-7xl opacity-5 group-hover:scale-110 transition-transform duration-500">
                    {r.icono}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-6">
                    {r.formato && (
                      <span className="bg-neutral-950 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        {r.formato}
                      </span>
                    )}
                    {r.tipo === "Pago" ? (
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        💎 ${Number(r.precio || 0).toLocaleString("es-AR")}
                      </span>
                    ) : (
                      <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        🎁 Gratis
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 z-10 relative">{r.titulo}</h3>
                  <p className="text-neutral-400 text-sm mb-8 flex-grow z-10 relative">{r.descripcion_corta}</p>

                  <span className="w-full relative z-10 bg-neutral-950 border border-neutral-700 text-white px-4 py-3 rounded-xl font-bold group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-colors flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {r.tipo === "Pago" ? "Ver Recurso" : "Descargar Gratis"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}} />
    </main>
  );
}
