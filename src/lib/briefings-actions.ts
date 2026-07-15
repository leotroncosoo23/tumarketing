"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type ResultadoAccion = { error?: string };

export type BriefingPayload = {
  plan: string;
  servicio_contratado_id: string | null;
  whatsapp: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  objetivo_negocio: string;
  cliente_ideal: string;
  gestion_cuenta: "agencia" | "cliente";
};

export async function crearBriefing(payload: BriefingPayload): Promise<ResultadoAccion> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Se perdió la sesión, iniciá sesión de nuevo." };
  }

  const { error } = await supabase.from("briefings").insert([{ usuario_id: user.id, ...payload }]);

  if (error) {
    return { error: "No pudimos guardar tu información: " + error.message };
  }

  return {};
}
