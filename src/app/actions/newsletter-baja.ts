"use server";

import { crearClienteSupabaseAdmin } from "@/lib/mercadopago-server";
import { verificarTokenBaja } from "@/lib/unsubscribe-token";

type ResultadoBaja = { ok: true } | { ok: false; error: string };

// Requiere confirmación explícita del usuario (llamado desde un botón, no al
// renderizar la página) a propósito: muchos clientes de correo corporativos
// "pre-visitan" cada link de un mail por seguridad, y si esto corriera con
// solo un GET, esos escaneos automáticos darían de baja gente sin que lo pida.
//
// Usa el cliente admin (service role) en vez del cliente normal: "suscriptores"
// no tiene policy de UPDATE pública (solo alta e insert), así que un usuario
// anónimo no podría tocar esta fila igual — el gate de seguridad real es la
// verificación del token acá arriba, no una policy nueva y más permisiva.
export async function confirmarBajaNewsletter(email: string, token: string): Promise<ResultadoBaja> {
  if (!verificarTokenBaja(email, token)) {
    return { ok: false, error: "El link no es válido o está incompleto." };
  }

  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) {
    return { ok: false, error: "Falta configuración en el servidor." };
  }

  const { error } = await supabaseAdmin.from("suscriptores").update({ activo: false }).eq("email", email.toLowerCase().trim());
  if (error) {
    return { ok: false, error: "No pudimos procesar la baja: " + error.message };
  }
  return { ok: true };
}

export async function reactivarSuscripcion(email: string, token: string): Promise<ResultadoBaja> {
  if (!verificarTokenBaja(email, token)) {
    return { ok: false, error: "El link no es válido o está incompleto." };
  }

  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) {
    return { ok: false, error: "Falta configuración en el servidor." };
  }

  const { error } = await supabaseAdmin.from("suscriptores").update({ activo: true }).eq("email", email.toLowerCase().trim());
  if (error) {
    return { ok: false, error: "No pudimos reactivar la suscripción: " + error.message };
  }
  return { ok: true };
}
