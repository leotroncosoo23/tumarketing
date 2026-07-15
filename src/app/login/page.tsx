"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { iniciarSesionConEmail } from "@/lib/auth-actions";

export default function LoginAlumnos() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("revocado") === "1") {
      setError("Tu acceso fue revocado. Contactanos si creés que es un error.");
    }
  }, []);

  const handleLoginGoogle = async () => {
    setError("");
    setCargando(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError("No pudimos conectar con Google: " + error.message);
      setCargando(false);
    }
    // Si no hay error, el navegador redirige a Google y no seguimos acá.
  };

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const resultado = await iniciarSesionConEmail(email, password);
    // Si todo salió bien, la Server Action ya redirigió y esta línea no se ejecuta.
    if (resultado?.error) {
      setError(resultado.error);
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ccff00]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold tracking-tighter inline-block hover:scale-105 transition-transform">
            Tu<span className="text-[#ccff00]">Marketing</span>
          </Link>
          <p className="text-neutral-500 text-sm mt-2 font-medium tracking-widest uppercase">
            Plataforma de Alumnos
          </p>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Entrá a tus cursos
          </h2>
          <p className="text-neutral-400 text-sm text-center mb-8">
            Iniciá sesión para ver tus cursos, tu progreso y las clases.
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLoginGoogle}
            disabled={cargando}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-bold text-base py-3.5 rounded-xl hover:bg-neutral-200 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 12S6.9 21.6 12 21.6c6.9 0 9.3-4.9 9.3-7.4 0-.5-.1-.9-.1-1.3H12z"/>
            </svg>
            {cargando ? "Conectando..." : "Continuar con Google"}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-neutral-600 text-xs font-medium uppercase tracking-widest">o</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          <form onSubmit={handleLoginEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#ccff00] text-black font-bold text-base py-3.5 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-neutral-600 text-xs text-center mt-8">
            ¿No tenés cuenta?{" "}
            <Link href="/registro" className="text-neutral-400 hover:text-[#ccff00] transition-colors">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
