"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type ResultadoAccion = { error?: string; yaSuscripto?: boolean };

export async function suscribirNewsletter(nombre: string, email: string): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("suscriptores").insert([{ nombre, email, activo: true }]);

  if (error) {
    // 23505 = violación de restricción única de Postgres (el email ya estaba suscripto).
    if (error.code === "23505") {
      return { yaSuscripto: true };
    }
    return { error: "No pudimos suscribirte: " + error.message };
  }

  return {};
}
