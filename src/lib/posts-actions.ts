"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type ResultadoAccion = { error?: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// Nunca confiamos en que el cliente sea dueño del post por el solo hecho de
// mandar su id: siempre volvemos a preguntarle a Supabase de qué servicio
// contratado es ese post, y de quién es ese servicio. Mismo criterio que
// resolverRolEnProyecto en mensajes-actions.ts.
async function esDuenioDelPost(supabase: SupabaseServerClient, userId: string, postId: string): Promise<boolean> {
  const { data: post } = await supabase
    .from("posts_calendario")
    .select("servicio_contratado_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return false;

  const { data: proyecto } = await supabase
    .from("servicios_contratados")
    .select("usuario_id")
    .eq("id", post.servicio_contratado_id)
    .maybeSingle();

  return proyecto?.usuario_id === userId;
}

export async function aprobarPost(postId: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Se perdió la sesión, iniciá sesión de nuevo." };

  if (!(await esDuenioDelPost(supabase, user.id, postId))) {
    return { error: "No tenés acceso a este post." };
  }

  const { error } = await supabase
    .from("posts_calendario")
    .update({ estado: "aprobado", comentario_cliente: null })
    .eq("id", postId);

  if (error) return { error: error.message };
  return {};
}

export async function solicitarCambiosPost(postId: string, comentario: string): Promise<ResultadoAccion> {
  if (!comentario.trim()) return { error: "Contanos qué cambio necesitás." };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Se perdió la sesión, iniciá sesión de nuevo." };

  if (!(await esDuenioDelPost(supabase, user.id, postId))) {
    return { error: "No tenés acceso a este post." };
  }

  const { error } = await supabase
    .from("posts_calendario")
    .update({ estado: "cambios_solicitados", comentario_cliente: comentario.trim() })
    .eq("id", postId);

  if (error) return { error: error.message };
  return {};
}
