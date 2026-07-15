"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { NuevoServicioPayload } from "@/lib/servicios";

type ResultadoAccion = { error?: string };

export async function crearServicio(payload: NuevoServicioPayload): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("servicios").insert([payload]);

  if (error) {
    return { error: "No pudimos guardar el servicio: " + error.message };
  }

  revalidatePath("/admin/servicios");
  redirect("/admin/servicios");
}

export async function actualizarServicio(id: string, payload: NuevoServicioPayload): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("servicios").update(payload).eq("id", id);

  if (error) {
    return { error: "No pudimos actualizar el servicio: " + error.message };
  }

  revalidatePath("/admin/servicios");
  revalidatePath(`/servicios/${id}`);
  redirect("/admin/servicios");
}

export async function eliminarServicio(id: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("servicios").delete().eq("id", id);

  if (error) {
    return { error: "No pudimos eliminar el servicio: " + error.message };
  }

  revalidatePath("/admin/servicios");
  return {};
}
