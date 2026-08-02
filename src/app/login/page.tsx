"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Space_Grotesk, Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button, StatCard } from "@/components/dashboard/ui";
import "@/app/admin/admin.css";

// admin.css espera --font-display/--font-body, pero nunca se cargaban de
// verdad en ningún lado (solo tenían un fallback string en la propia hoja de
// estilos) — sin esto, "Space Grotesk"/"Inter" caían silenciosamente a la
// fuente del sistema. Acá los cargamos y exponemos como esas mismas variables.
const fontDisplay = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export default function LoginUsuarios() {
  const router = useRouter();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Solo para el registro:
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  useEffect(() => {
    // window no existe en el servidor: este chequeo tiene que esperar a que
    // el componente esté montado en el cliente, por eso va en un efecto.
    const params = new URLSearchParams(window.location.search);
    if (params.get("revocado") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Tu acceso fue revocado. Contactanos si creés que es un error.");
      return;
    }
    // auth/callback/route.ts manda acá el motivo exacto cuando el login con
    // Google falla, en vez de rebotar en silencio (ver mensaje al usuario más
    // abajo: no dice "arreglado", muestra la razón real para poder diagnosticar).
    const errorOAuth = params.get("error");
    if (errorOAuth) {
      const razon = params.get("razon");
      const mensajes: Record<string, string> = {
        oauth_sin_code: "Google no devolvió un código de autorización" + (razon ? `: ${razon}` : "."),
        oauth_exchange: `No pudimos canjear el código por una sesión: ${razon || "error desconocido"}.`,
        oauth_sin_user: "La sesión no quedó creada después del canje.",
        oauth_perfil: `No pudimos leer tu perfil en 'usuarios': ${razon || "error desconocido"}.`,
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(mensajes[errorOAuth] || `No pudimos completar el login con Google (${errorOAuth}).`);
    }
  }, []);

  // Mismo criterio de redirección que auth/callback/route.ts (Google): sin
  // perfil todavía -> completar alta en /auth/bienvenida; cuenta desactivada
  // -> afuera; si no, admin/editor al panel, el resto al portal de cliente.
  const redirigirSegunPerfil = async (userId: string) => {
    const { data: perfil, error: errorPerfil } = await supabase
      .from("usuarios")
      .select("rol, activo")
      .eq("id", userId)
      .maybeSingle();

    if (errorPerfil) {
      setError("No pudimos leer tu perfil en 'usuarios': " + errorPerfil.message);
      setCargando(false);
      return;
    }
    if (!perfil) {
      router.replace("/auth/bienvenida");
      return;
    }
    if (!perfil.activo) {
      await supabase.auth.signOut();
      setError("Tu acceso fue revocado. Contactanos si creés que es un error.");
      setCargando(false);
      return;
    }
    router.replace(perfil.rol === "admin" || perfil.rol === "editor" ? "/admin" : "/usuarios");
  };

  const handleLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");
    setCargando(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setError(error ? "No pudimos iniciar sesión: " + error.message : "No pudimos iniciar sesión.");
      setCargando(false);
      return;
    }
    await redirigirSegunPerfil(data.user.id);
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!nombre.trim() || !apellido.trim()) {
      setError("Completá nombre y apellido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre: nombre.trim(), apellido: apellido.trim() } },
    });

    if (error) {
      setError("No pudimos crear la cuenta: " + error.message);
      setCargando(false);
      return;
    }

    if (!data.session) {
      // El proyecto tiene confirmación de email activada: todavía no hay
      // sesión, hay que esperar a que confirme desde el mail.
      setMensajeExito("¡Casi! Te mandamos un email para confirmar tu cuenta. Confirmalo y después iniciá sesión acá.");
      setCargando(false);
      setModo("login");
      return;
    }

    // Sesión activa de una (confirmación de email desactivada en el proyecto):
    // falta el mismo paso de términos/newsletter que ya usa el login con
    // Google, así que reusamos esa misma pantalla en vez de duplicar lógica.
    router.replace("/auth/bienvenida");
  };

  const handleLoginGoogle = async () => {
    setError("");
    setMensajeExito("");
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

  const cambiarModo = (nuevoModo: "login" | "registro") => {
    setModo(nuevoModo);
    setError("");
    setMensajeExito("");
  };

  return (
    <main className={`tm-admin-theme ${fontDisplay.variable} ${fontBody.variable} flex min-h-screen bg-[var(--surface-page)]`}>
      {/* Columna izquierda: branding, oculta en móvil */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-[var(--border-subtle)] p-10 md:flex lg:p-16">
        <div className="flex items-center gap-3">
          <Image src="/logo-mark.jpg" alt="Tu Marketing" width={56} height={56} className="rounded-full" />
          <span className="tm-display font-bold uppercase tracking-[var(--ls-tight)] text-[var(--text-primary)] [font-size:15px]">
            Tu Marketing.
          </span>
        </div>

        <div className="max-w-lg">
          <span className="font-bold uppercase text-[var(--accent)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
            Panel de acceso
          </span>
          <h1 className="tm-display mt-3 font-bold leading-[var(--lh-tight)] text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            Entrá y mirá <span className="text-[var(--accent)]">tus resultados.</span>
          </h1>
          <p className="mt-4 text-[var(--text-secondary)] [font-size:var(--fs-body-m)]">
            Un solo acceso para todo: tu dashboard de campañas si sos cliente, o el panel de administración si sos
            parte del equipo.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <StatCard label="Vistas generadas" value="+80K" />
            <StatCard label="Campañas activas" value="+200" />
          </div>
        </div>

        <p className="text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
          Convertimos marcas en negocios digitales reales.
        </p>
      </div>

      {/* Columna derecha: formulario */}
      <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 lg:p-16">
        <div className="w-full max-w-sm">
          <h2 className="tm-display font-bold uppercase text-[var(--text-primary)] [font-size:var(--fs-heading-l)]">
            {modo === "login" ? "Bienvenido de vuelta" : "Creá tu cuenta"}
          </h2>
          <p className="mt-2 mb-8 text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">
            {modo === "login" ? "Iniciá sesión para ver tus resultados." : "Es rápido: solo necesitamos algunos datos."}
          </p>

          {error && (
            <div className="mb-6 rounded-[var(--radius-m)] border border-[var(--signal-error)]/50 bg-[var(--signal-error)]/10 px-4 py-3 text-center font-medium text-[var(--signal-error)] [font-size:var(--fs-body-s)]">
              {error}
            </div>
          )}
          {mensajeExito && (
            <div className="mb-6 rounded-[var(--radius-m)] border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-3 text-center font-medium text-[var(--accent)] [font-size:var(--fs-body-s)]">
              {mensajeExito}
            </div>
          )}

          <form onSubmit={modo === "login" ? handleLoginPassword : handleRegistro} className="flex flex-col gap-4">
            {modo === "registro" && (
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Nombre</span>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juana"
                    className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Apellido</span>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Pérez"
                    className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
                  />
                </label>
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Email</span>
              <input
                type="email"
                required
                placeholder="tu@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Contraseña</span>
                {modo === "login" && (
                  <Link href="/login" className="font-semibold text-[var(--accent)] [font-size:var(--fs-body-s)] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </div>
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

            {modo === "registro" && (
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
            )}

            <Button type="submit" disabled={cargando} className="mt-2 w-full">
              {cargando ? "Un momento..." : modo === "login" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">o</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <Button variant="secondary" onClick={handleLoginGoogle} disabled={cargando} className="w-full">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 12S6.9 21.6 12 21.6c6.9 0 9.3-4.9 9.3-7.4 0-.5-.1-.9-.1-1.3H12z"
              />
            </svg>
            {cargando ? "Conectando..." : "Continuar con Google"}
          </Button>

          <p className="mt-6 text-center text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">
            {modo === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button type="button" onClick={() => cambiarModo("registro")} className="font-semibold text-[var(--accent)] hover:underline">
                  Registrate acá
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button type="button" onClick={() => cambiarModo("login")} className="font-semibold text-[var(--accent)] hover:underline">
                  Iniciá sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
