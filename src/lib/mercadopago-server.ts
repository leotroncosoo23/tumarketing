import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ItemComprado = { id: string; tipo: "curso" | "servicio" };
export type PagoVerificado = { usuarioId: string; items: ItemComprado[] };

// Nunca confiamos en datos que vengan del cliente (ni el body de un webhook ni
// los query params de un redirect): esta función siempre vuelve a preguntarle
// a la API de Mercado Pago cuál es el estado real de un pago antes de que
// otorguemos ningún acceso. Devuelve null si el pago no está aprobado o si
// no se pudo verificar.
export async function verificarPagoAprobado(paymentId: string): Promise<PagoVerificado | null> {
  if (!process.env.MP_ACCESS_TOKEN) {
    console.error("Falta MP_ACCESS_TOKEN para verificar el pago.");
    return null;
  }

  const respuesta = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });

  if (!respuesta.ok) {
    console.error(`No pudimos verificar el pago ${paymentId} (status ${respuesta.status}).`);
    return null;
  }

  const pago = await respuesta.json();
  if (pago.status !== "approved") return null;

  const usuarioId: string | undefined = pago.metadata?.usuario_id;
  const items: ItemComprado[] = JSON.parse(pago.metadata?.items_json || "[]");
  if (!usuarioId || items.length === 0) return null;

  return { usuarioId, items };
}

export function crearClienteSupabaseAdmin(): SupabaseClient | null {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Falta SUPABASE_SERVICE_ROLE_KEY para escribir en Supabase como admin.");
    return null;
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// TABLA: inscripciones (usuario_id, curso_id, progreso, mercadopago_payment_id)
// TABLA: servicios_contratados (usuario_id, servicio_id, estado, mercadopago_payment_id)
// El índice único (mercadopago_payment_id, curso_id / servicio_id) hace que insertar
// dos veces el mismo pago no duplique el acceso: la segunda inserción falla con
// el código 23505 (unique_violation) y lo tratamos como éxito silencioso.
export async function otorgarAcceso(
  supabaseAdmin: SupabaseClient,
  usuarioId: string,
  item: ItemComprado,
  paymentId: string
) {
  if (item.tipo === "curso") {
    const { error } = await supabaseAdmin
      .from("inscripciones")
      .insert([{ usuario_id: usuarioId, curso_id: item.id, progreso: 0, mercadopago_payment_id: paymentId }]);

    if (error && error.code !== "23505") {
      console.error(`No pudimos dar acceso al curso ${item.id} para ${usuarioId}:`, error.message);
    }
    return;
  }

  // Estado inicial "Esperando información": es el mismo texto que ya lee
  // el panel de alumnos (src/app/alumnos/page.tsx).
  const { error } = await supabaseAdmin
    .from("servicios_contratados")
    .insert([{ usuario_id: usuarioId, servicio_id: item.id, estado: "Esperando información", mercadopago_payment_id: paymentId }]);

  if (error && error.code !== "23505") {
    console.error(`No pudimos activar el servicio ${item.id} para ${usuarioId}:`, error.message);
  }
}
