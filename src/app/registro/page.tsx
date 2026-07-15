"use client";

import Link from "next/link";
import { useState } from "react";
import { registrarConEmail } from "@/lib/auth-actions";

export default function RegistroAlumnos() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    const resultado = await registrarConEmail(nombre.trim(), apellido.trim(), email.trim(), password);
    // Si la cuenta quedó activa de una, la Server Action ya redirigió.
    if (resultado?.error) {
      setError(resultado.error);
    } else if (resultado?.mensaje) {
      setMensaje(resultado.mensaje);
    }
    setCargando(false);
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
            Creá tu cuenta
          </h2>
          <p className="text-neutral-400 text-sm text-center mb-8">
            Registrate con tu email para acceder a tus cursos.
          </p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-6 bg-[#ccff00]/10 border border-[#ccff00]/40 text-[#ccff00] px-4 py-3 rounded-xl text-sm font-medium text-center">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleRegistro} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all"
                  placeholder="Juan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

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
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#ccff00] text-black font-bold text-base py-3.5 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            >
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-neutral-600 text-xs text-center mt-8">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-neutral-400 hover:text-[#ccff00] transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
