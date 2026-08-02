"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, Button } from "@/components/dashboard/ui";
import "@/app/admin/admin.css";

const fontDisplay = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export default function ActualizarPassword() {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [linkValido, setLinkValido] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verificar = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError("Este link de recuperación ya no es válido: " + error.message);
          setVerificando(false);
          return;
        }
      }
      // Sin "code" en la URL, puede ser que ya se haya canjeado (algunos
      // clientes de mail abren el link antes que el usuario) — igual
      // chequeamos si hay una sesión de recuperación activa.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Este link de recuperación venció o ya se usó. Pedí uno nuevo desde /login.");
        setVerificando(false);
        return;
      }
      setLinkValido(true);
      setVerificando(false);
    };
    verificar();
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setGuardando(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("No pudimos actualizar la contraseña: " + error.message);
      setGuardando(false);
      return;
    }

    // Cerramos la sesión de recuperación a propósito: que vuelva a entrar
    // con la contraseña nueva, sin ambigüedad sobre qué sesión quedó activa.
    await supabase.auth.signOut();
    router.replace("/login?reset=1");
  };

  return (
    <main className={`tm-admin-theme ${fontDisplay.variable} ${fontBody.variable} flex min-h-screen items-center justify-center bg-[var(--surface-page)] p-6`}>
      <div className="w-full max-w-sm">
        <h1 className="tm-display mb-2 text-center font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-l)]">
          Nueva contraseña
        </h1>
        <p className="mb-8 text-center text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">
          Elegí una contraseña nueva para tu cuenta.
        </p>

        <Card>
          {verificando ? (
            <p className="text-center text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">Verificando el link...</p>
          ) : !linkValido ? (
            <div className="text-center">
              <p className="mb-4 text-[var(--signal-error)] [font-size:var(--fs-body-s)]">{error}</p>
              <Button onClick={() => router.replace("/login")} className="w-full">
                Volver al login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleGuardar} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-[var(--radius-m)] border border-[var(--signal-error)]/50 bg-[var(--signal-error)]/10 px-4 py-3 text-center font-medium text-[var(--signal-error)] [font-size:var(--fs-body-s)]">
                  {error}
                </div>
              )}

              <label className="flex flex-col gap-2">
                <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Contraseña nueva</span>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] pr-11 text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword((v) => !v)}
                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    {mostrarPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Verificar contraseña</span>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
                />
              </label>

              <Button type="submit" disabled={guardando} className="mt-2 w-full">
                {guardando ? "Guardando..." : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
