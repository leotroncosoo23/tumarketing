"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { renderizarContenidoBlog } from "@/lib/blogContenido";

type Recurso = {
  id: string;
  titulo: string;
  slug: string;
  tipo: string;
  precio: number | null;
  formato: string;
  icono: string;
  imagen_url: string;
  archivo_url: string;
  descripcion_corta: string;
  descripcion_larga: string;
  beneficios: string;
  estado: string;
};

function FormularioDescarga({
  onSubmit, enviando, exito, nombre, setNombre, email, setEmail,
}: {
  onSubmit: (e: React.FormEvent) => void;
  enviando: boolean;
  exito: boolean;
  nombre: string;
  setNombre: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
}) {
  if (exito) {
    return (
      <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="text-white font-bold mb-1">¡Listo! Se abrió tu descarga en una pestaña nueva.</p>
        <p className="text-neutral-400 text-sm">Si no se abrió, revisá que tu navegador no haya bloqueado la ventana emergente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-md">
      <input
        type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white outline-none focus:border-[#ccff00] transition-colors"
      />
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white outline-none focus:border-[#ccff00] transition-colors"
      />
      <button
        type="submit" disabled={enviando}
        className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {enviando ? "Procesando..." : "⬇️ Descargar Gratis"}
      </button>
      <p className="text-neutral-600 text-xs">Sin spam. Podés darte de baja cuando quieras.</p>
    </form>
  );
}

export default function RecursoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const [{ data: recursoData }, { data: configData }] = await Promise.all([
        supabase.from("recursos").select("*").eq("slug", slug).eq("estado", "Publicado").single(),
        supabase.from("configuracion").select("whatsapp_numero").eq("id", 1).single(),
      ]);
      setRecurso(recursoData || null);
      setWhatsapp(configData?.whatsapp_numero || "");
      setCargando(false);
    };
    cargar();
  }, [slug]);

  const handleDescargar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recurso || !nombre.trim() || !email.trim()) return;

    setEnviando(true);
    try {
      await supabase.from("recursos_descargas").insert([
        { recurso_id: recurso.id, nombre: nombre.trim(), email: email.trim() },
      ]);

      const { data: existente } = await supabase
        .from("suscriptores")
        .select("id")
        .eq("email", email.trim())
        .maybeSingle();

      if (!existente) {
        await supabase.from("suscriptores").insert([{ email: email.trim(), activo: true }]);
      }

      setExito(true);
      if (recurso.archivo_url) {
        window.open(recurso.archivo_url, "_blank", "noopener,noreferrer");
      }
    } catch {
      alert("Hubo un error al procesar tu descarga. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 flex items-center justify-center">
        <Navbar />
        <p className="text-neutral-400">Cargando recurso...</p>
      </main>
    );
  }

  if (!recurso) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No encontramos este recurso</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link href="/recursos" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors">
            ← Volver a Recursos
          </Link>
        </div>
      </main>
    );
  }

  const esPago = recurso.tipo === "Pago";
  const whatsappLimpio = whatsapp.replace(/\D/g, "");
  const mensajeWhatsapp = encodeURIComponent(`Hola! Quiero más información sobre "${recurso.titulo}" 🚀`);
  const linkWhatsapp = whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${mensajeWhatsapp}` : "#contacto";

  const beneficios = (recurso.beneficios || "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link href="/" className="hover:text-[#ccff00] transition-colors">🏠</Link>
          <span>/</span>
          <Link href="/recursos" className="hover:text-[#ccff00] transition-colors">Recursos</Link>
        </div>

        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {esPago ? (
                <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  💎 Recurso Premium
                </span>
              ) : (
                <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  🎁 Recurso Gratis
                </span>
              )}
              {recurso.formato && (
                <span className="bg-neutral-900 text-neutral-400 border border-neutral-800 px-3 py-1 rounded-full text-xs font-bold">
                  {recurso.formato}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{recurso.titulo}</h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10">{recurso.descripcion_corta}</p>

            {esPago ? (
              <div>
                <p className="text-4xl font-black text-white mb-6">
                  ${Number(recurso.precio || 0).toLocaleString("es-AR")} <span className="text-sm font-normal text-neutral-500">ARS</span>
                </p>
                <a
                  href={linkWhatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-black text-lg px-8 py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                >
                  Comprar por WhatsApp <span>→</span>
                </a>
              </div>
            ) : (
              <FormularioDescarga
                onSubmit={handleDescargar} enviando={enviando} exito={exito}
                nombre={nombre} setNombre={setNombre} email={email} setEmail={setEmail}
              />
            )}
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl flex items-center justify-center min-h-[280px]">
              {recurso.imagen_url ? (
                <img src={recurso.imagen_url} alt={recurso.titulo} className="w-full rounded-2xl object-cover" />
              ) : (
                <span className="text-8xl opacity-50">{recurso.icono || "📄"}</span>
              )}
            </div>
          </div>
        </section>

        {/* QUÉ TE LLEVÁS */}
        {beneficios.length > 0 && (
          <section className="mb-20 max-w-3xl">
            <h2 className="text-2xl font-black mb-6">¿Qué te llevás cuando lo pedís?</h2>
            <ul className="space-y-3">
              {beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] text-xs">✓</span>
                  <span className="text-neutral-300 text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* DESARROLLO */}
        {recurso.descripcion_larga && (
          <section className="mb-20 max-w-3xl">
            {renderizarContenidoBlog(recurso.descripcion_larga)}
          </section>
        )}

        {/* CTA FINAL */}
        {!esPago && !exito && (
          <section className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-[#ccff00]/5 blur-[120px] rounded-full z-0 pointer-events-none" />
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-10 md:p-16 relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Descargá <span className="text-[#ccff00]">{recurso.titulo}</span>
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto mb-8 text-lg">
                Completá el formulario para acceder ahora mismo.
              </p>
              <div className="flex justify-center">
                <FormularioDescarga
                  onSubmit={handleDescargar} enviando={enviando} exito={exito}
                  nombre={nombre} setNombre={setNombre} email={email} setEmail={setEmail}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
