"use server";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ResultadoAccion = { error?: string; mensaje?: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// Común a login y registro exitosos: si todavía no existe fila en "usuarios"
// (recién se creó la cuenta), manda a aceptar términos; si la cuenta está
// desactivada, cierra sesión; si está todo en orden, entra al portal.
async function redirigirSegunPerfil(supabase: SupabaseServerClient, user: User): Promise<ResultadoAccion> {
  const { data: perfil, error: errorPerfil } = await supabase
    .from("usuarios")
    .select("rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (errorPerfil) {
    return { error: "No pudimos verificar tu cuenta: " + errorPerfil.message };
  }

  if (!perfil) {
    redirect("/auth/bienvenida");
  }

  if (!perfil.activo) {
    await supabase.auth.signOut();
    redirect("/login?revocado=1");
  }

  redirect(perfil.rol === "admin" ? "/admin/dashboard" : "/alumnos");
}

// Registro con email y contraseña. Guarda nombre y apellido en los metadatos
// del usuario; la fila en "usuarios" se crea después, en /auth/bienvenida,
// junto con la aceptación de términos (mismo flujo que ya usa Google).
export async function registrarConEmail(
  nombre: string,
  apellido: string,
  email: string,
  password: string
): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre, apellido } },
  });

  if (error) {
    return { error: "No pudimos crear tu cuenta: " + error.message };
  }

  // Si el proyecto tiene "Confirm email" activado en Supabase, no hay sesión
  // todavía: el usuario tiene que confirmar por email antes de poder entrar.
  if (!data.session || !data.user) {
    return {
      mensaje: "Te enviamos un email para confirmar tu cuenta. Abrilo y después iniciá sesión.",
    };
  }

  return redirigirSegunPerfil(supabase, data.user);
}

export async function iniciarSesionConEmail(email: string, password: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email o contraseña incorrectos." };
  }

  return redirigirSegunPerfil(supabase, data.user);
}
