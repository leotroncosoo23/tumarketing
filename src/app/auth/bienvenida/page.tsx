"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { crearPerfilAlumno } from "@/lib/alumnos";

export default function BienvenidaAlumno() {
  const router = useRouter();
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [email, setEmail] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaNewsletter, setAceptaNewsletter] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verificar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email || "");
      setCargandoSesion(false);
    };
    verificar();
  }, [router]);

  const handleCrearCuenta = async () => {
    if (!aceptaTerminos) return;
    setGuardando(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Se perdió la sesión, iniciá sesión de nuevo.");
      await crearPerfilAlumno(user, aceptaNewsletter);
      router.replace("/alumnos");
    } catch (e: any) {
      setError("No pudimos crear tu cuenta: " + e.message);
      setGuardando(false);
    }
  };

  const handleCancelar = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (cargandoSesion) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ccff00]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tighter inline-block hover:scale-105 transition-transform">
            Tu<span className="text-[#ccff00]">Marketing</span>
          </Link>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">¡Ya casi!</h2>
          <p className="text-neutral-400 text-sm text-center mb-8">
            Un último paso para crear tu cuenta con <span className="text-white font-medium">{email}</span>.
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
              />
              <span className="text-sm text-neutral-300">
                Acepto la{" "}
                <Link href="/politica-de-privacidad" target="_blank" className="text-[#ccff00] hover:underline">
                  Política de Privacidad
                </Link>{" "}
                y los Términos y Condiciones. <span className="text-neutral-500">(obligatorio)</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaNewsletter}
                onChange={(e) => setAceptaNewsletter(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#ccff00] shrink-0"
              />
              <span className="text-sm text-neutral-300">
                Quiero recibir novedades, promociones y contenido nuevo por email. <span className="text-neutral-500">(opcional)</span>
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCrearCuenta}
              disabled={!aceptaTerminos || guardando}
              className="w-full bg-[#ccff00] text-black font-bold text-base py-3.5 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {guardando ? "Creando cuenta..." : "Crear mi cuenta"}
            </button>
            <button
              onClick={handleCancelar}
              className="w-full text-neutral-500 hover:text-neutral-300 text-sm font-medium py-2 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
