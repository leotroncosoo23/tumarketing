"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { NuevoServicioPayload } from "@/lib/servicios";

type ResultadoAccion = { error?: string; id?: string };

export async function crearServicio(payload: NuevoServicioPayload): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("servicios").insert([payload]).select("id").single();

  if (error) {
    return { error: "No pudimos guardar el servicio: " + error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/servicios");
  return { id: data.id };
}

export async function actualizarServicio(id: string, payload: NuevoServicioPayload): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("servicios").update(payload).eq("id", id);

  if (error) {
    return { error: "No pudimos actualizar el servicio: " + error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${id}`);
  return {};
}

export async function eliminarServicio(id: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("servicios").delete().eq("id", id);

  if (error) {
    return { error: "No pudimos eliminar el servicio: " + error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/servicios");
  return {};
}
