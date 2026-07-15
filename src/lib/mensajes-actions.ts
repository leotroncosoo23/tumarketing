"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { TipoArchivoMensaje } from "@/lib/mensajes";

type ResultadoAccion = { error?: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type NuevoMensajeInput = {
  servicioContratadoId: string;
  texto?: string;
  archivoNombre?: string;
  archivoTipo?: TipoArchivoMensaje;
  archivoPath?: string;
};

// Determina si quien llama es admin, o el cliente dueño de este proyecto.
// Nunca confiamos en un "rol" que mande el cliente: lo resolvemos acá, del lado del servidor.
async function resolverRolEnProyecto(
  supabase: SupabaseServerClient,
  userId: string,
  servicioContratadoId: string
): Promise<"admin" | "cliente" | null> {
  const { data: perfil } = await supabase.from("usuarios").select("rol").eq("id", userId).maybeSingle();
  if (perfil?.rol === "admin") return "admin";

  const { data: proyecto } = await supabase
    .from("servicios_contratados")
    .select("usuario_id")
    .eq("id", servicioContratadoId)
    .maybeSingle();

  if (proyecto?.usuario_id === userId) return "cliente";

  return null;
}

export async function enviarMensaje(input: NuevoMensajeInput): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Se perdió la sesión, iniciá sesión de nuevo." };

  const rol = await resolverRolEnProyecto(supabase, user.id, input.servicioContratadoId);
  if (!rol) return { error: "No tenés acceso a este proyecto." };

  if (!input.texto?.trim() && !input.archivoNombre) {
    return { error: "El mensaje está vacío." };
  }

  const { error } = await supabase.from("mensajes_proyecto").insert([
    {
      servicio_contratado_id: input.servicioContratadoId,
      autor_id: user.id,
      autor_rol: rol,
      texto: input.texto?.trim() || null,
      archivo_nombre: input.archivoNombre || null,
      archivo_tipo: input.archivoTipo || null,
      archivo_path: input.archivoPath || null,
    },
  ]);

  if (error) return { error: "No pudimos enviar el mensaje: " + error.message };
  return {};
}

// Solo tiene efecto para admin: la RLS de "mensajes_proyecto" no le da permiso
// de UPDATE al cliente, así que si lo llama un cliente simplemente no actualiza nada.
export async function marcarMensajesLeidos(servicioContratadoId: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("mensajes_proyecto")
    .update({ leido: true })
    .eq("servicio_contratado_id", servicioContratadoId)
    .eq("autor_rol", "cliente")
    .eq("leido", false);

  if (error) return { error: error.message };
  return {};
}

export async function obtenerUrlArchivo(path: string): Promise<{ url?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage.from("archivos-proyectos").createSignedUrl(path, 60);

  if (error || !data) {
    return { error: error?.message || "No pudimos generar el link de descarga." };
  }
  return { url: data.signedUrl };
}
