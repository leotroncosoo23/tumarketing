"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAlumnoSession } from "@/lib/useAlumnoSession";
import { crearBriefing } from "@/lib/briefings-actions";

type GestionCuenta = "agencia" | "cliente";

// Sin exigir formato de país específico (el criterio argentino del "9" antes
// del código de área confunde bastante) — solo validamos que sean números y
// que tenga un largo razonable para ser un teléfono real.
const REGEX_WHATSAPP = /^\d{8,15}$/;

export default function OnboardingPage() {
  const { perfil, cargando } = useAlumnoSession();

  const [plan, setPlan] = useState("Gestión de Redes - 5 Posts y 2 Historias");
  const [servicioContratadoId, setServicioContratadoId] = useState<string | null>(null);

  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [clienteIdeal, setClienteIdeal] = useState("");
  const [gestionCuenta, setGestionCuenta] = useState<GestionCuenta>("agencia");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const servicio = params.get("servicio");
    const scid = params.get("scid");
    if (servicio) setPlan(servicio);
    if (scid) setServicioContratadoId(scid);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!REGEX_WHATSAPP.test(whatsapp.trim())) {
      setError("Ingresá un número de WhatsApp válido, solo números (Ej: 5492945527821).");
      return;
    }

    setEnviando(true);

    const resultado = await crearBriefing({
      plan,
      servicio_contratado_id: servicioContratadoId,
      whatsapp: whatsapp.trim(),
      instagram_url: instagram.trim(),
      facebook_url: facebook.trim(),
      youtube_url: youtube.trim(),
      objetivo_negocio: objetivo.trim(),
      cliente_ideal: clienteIdeal.trim(),
      gestion_cuenta: gestionCuenta,
    });

    if (resultado?.error) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }

    setEnviando(false);
    setEnviado(true);
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }
  if (!perfil) return null;

  if (enviado) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ccff00]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md relative z-10">
          <span className="text-6xl mb-6 block">🎉</span>
          <h1 className="text-3xl font-black text-white mb-4">¡Recibimos tu información!</h1>
          <p className="text-neutral-400 mb-8">
            Nuestro equipo ya tiene todo lo que necesita para arrancar. Te vamos a contactar pronto con los
            primeros avances.
          </p>

          <div className="bg-neutral-900/60 backdrop-blur-xl border border-[#ccff00]/30 rounded-2xl p-6 mb-8 text-left flex items-start gap-4">
            <span className="w-11 h-11 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </span>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Cuando arranquemos con el desarrollo, se va a habilitar acá mismo un{" "}
              <span className="text-white font-bold">chat directo con el equipo de TuMarketing</span>, para que
              sigas el proyecto y nos mandes archivos sin salir de la plataforma.
            </p>
          </div>

          <Link
            href="/alumnos"
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
          >
            Volver a Mis Proyectos <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <Link
          href="/alumnos"
          className="text-neutral-400 hover:text-white text-sm font-bold flex items-center gap-2 mb-8 transition-colors w-fit"
        >
          ← Volver a Mis Proyectos
        </Link>

        {/* Encabezado */}
        <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
          ¡Hola, <span className="text-[#ccff00]">{perfil.nombre || "de nuevo"}</span>! Vamos a armar la base de
          tu proyecto.
        </h1>
        <p className="text-neutral-400 text-lg mb-6">
          Esta información nos permite arrancar a trabajar en tu cuenta con foco desde el primer día.
        </p>

        <div className="bg-neutral-900 border border-[#ccff00]/30 rounded-2xl px-6 py-4 flex items-center gap-4 mb-10">
          <span className="w-11 h-11 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center text-xl shrink-0">
            📋
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Plan Activo</p>
            <p className="text-white font-bold truncate">{plan}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contacto directo */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
              Tu WhatsApp
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
              pattern="\d{8,15}"
              title="Ingresá tu número de WhatsApp, solo números (Ej: 5492945527821)."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              placeholder="Ej: 5492945527821"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Solo números, sin espacios, guiones ni el signo +. Si podés, incluí el código de país.
              Por si necesitamos comunicarnos con vos y no llegamos a verte en la plataforma.
            </p>
          </section>

          {/* 1. Tus Plataformas */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
              1. Tus Plataformas
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Instagram</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://instagram.com/tu_negocio"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Facebook</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://facebook.com/tu_negocio"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">YouTube</label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://youtube.com/@tu_canal"
                />
              </div>
            </div>
          </section>

          {/* 2. ADN de la Marca */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
              2. ADN de la Marca
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  ¿Cuál es el objetivo principal de tu negocio?
                </label>
                <textarea
                  required
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-32 resize-none"
                  placeholder="Ej: Conseguir más reservas para mi restaurante, vender más online..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  Describí a tu cliente ideal / público objetivo
                </label>
                <textarea
                  required
                  value={clienteIdeal}
                  onChange={(e) => setClienteIdeal(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-32 resize-none"
                  placeholder="Ej: Mujeres de 25 a 40 años, interesadas en..."
                />
              </div>
            </div>
          </section>

          {/* 3. Gestión de Cuenta */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
              3. Gestión de Cuenta
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  gestionCuenta === "agencia" ? "border-[#ccff00] bg-[#ccff00]/5" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <input
                  type="radio"
                  name="gestion"
                  checked={gestionCuenta === "agencia"}
                  onChange={() => setGestionCuenta("agencia")}
                  className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
                />
                <span className="text-sm text-neutral-200">
                  Quiero que la agencia administre y publique el contenido.
                </span>
              </label>
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  gestionCuenta === "cliente" ? "border-[#ccff00] bg-[#ccff00]/5" : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <input
                  type="radio"
                  name="gestion"
                  checked={gestionCuenta === "cliente"}
                  onChange={() => setGestionCuenta("cliente")}
                  className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
                />
                <span className="text-sm text-neutral-200">
                  Solo quiero los diseños, yo me encargo de publicar.
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.01] shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "🚀 Enviar Información y Comenzar"}
          </button>
        </form>
      </div>
    </main>
  );
}
