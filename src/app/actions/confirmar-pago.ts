"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { verificarPagoAprobado, crearClienteSupabaseAdmin, otorgarAcceso } from "@/lib/mercadopago-server";

type ResultadoConfirmacion = { ok: true } | { ok: false; error: string };

// Esto es un atajo de UX (activa el acceso al toque para que el usuario no
// tenga que esperar a que llegue el webhook), NO el mecanismo de seguridad
// principal: el webhook (src/app/api/webhooks/mercadopago/route.ts) sigue
// siendo la fuente de verdad, porque corre server-to-server sin depender de
// que el navegador del comprador vuelva a cargar esta página.
export async function confirmarPagoYOtorgarAcceso(paymentId: string): Promise<ResultadoConfirmacion> {
  if (!paymentId) {
    return { ok: false, error: "Falta el ID de pago." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Iniciá sesión para ver tu compra." };
    }

    // Nunca confiamos en el "status" que viene en la URL (cualquiera podría
    // escribir ?status=approved a mano): volvemos a verificar contra la API.
    const pago = await verificarPagoAprobado(paymentId);
    if (!pago) {
      return { ok: false, error: "No pudimos confirmar que el pago esté aprobado." };
    }

    // Y tampoco alcanza con que el pago esté aprobado: tiene que ser DE este
    // usuario. Si no, cualquiera con un payment_id ajeno (visible en el historial
    // del navegador, por ejemplo) podría activarse una compra que no hizo.
    if (pago.usuarioId !== user.id) {
      return { ok: false, error: "Este pago no pertenece a tu cuenta." };
    }

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (!supabaseAdmin) {
      return { ok: false, error: "Falta configuración en el servidor." };
    }

    await Promise.all(pago.items.map((item) => otorgarAcceso(supabaseAdmin, user.id, item, paymentId)));

    return { ok: true };
  } catch (error) {
    console.error("Error al confirmar el pago:", error);
    return { ok: false, error: "Ocurrió un error inesperado al confirmar tu pago." };
  }
}
