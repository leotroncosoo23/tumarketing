import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type PerfilAlumno = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string;
  rol: string;
  activo: boolean;
};

// Solo busca. No crea nada: mientras el alumno no acepte los términos en /auth/bienvenida
// no existe fila en "usuarios", y por lo tanto no tiene cuenta funcional en la plataforma.
export async function buscarPerfilAlumno(user: User): Promise<PerfilAlumno | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, apellido, email, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return (data as PerfilAlumno) || null;
}

// Se llama una sola vez, después de que el alumno acepta la política de privacidad
// en /auth/bienvenida. Si no acepta, esta función nunca se ejecuta y no se crea cuenta.
export async function crearPerfilAlumno(user: User, aceptaNewsletter: boolean): Promise<PerfilAlumno> {
  const metadata = user.user_metadata || {};

  // El registro con Email + OTP guarda "nombre" y "apellido" a mano.
  // El login con Google solo trae given_name/family_name (o el nombre completo).
  const nombre = (metadata.nombre ||
    metadata.given_name ||
    metadata.full_name ||
    metadata.name ||
    null) as string | null;

  const apellido = (metadata.apellido || metadata.family_name || null) as string | null;

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{
      id: user.id,
      nombre,
      apellido,
      email: user.email,
      rol: "alumno",
      activo: true,
      acepta_terminos: true,
      terminos_aceptados_en: new Date().toISOString(),
      acepta_newsletter: aceptaNewsletter,
    }])
    .select("id, nombre, apellido, email, rol, activo")
    .single();

  if (error) throw error;

  // Si quiso sumarse al newsletter, lo agregamos a la misma tabla que usa Email Marketing
  if (aceptaNewsletter && user.email) {
    const { data: existente } = await supabase
      .from("suscriptores")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (!existente) {
      await supabase.from("suscriptores").insert([{ email: user.email, activo: true }]);
    }
  }

  return data as PerfilAlumno;
}
