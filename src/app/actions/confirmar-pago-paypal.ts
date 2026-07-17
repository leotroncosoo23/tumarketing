"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { capturarOrdenPayPal } from "@/lib/paypal-server";
import { crearClienteSupabaseAdmin, otorgarAcceso, type ItemComprado } from "@/lib/mercadopago-server";

type ResultadoConfirmacion = { ok: true } | { ok: false; error: string };

// Atajo de UX (activa el acceso al toque cuando el comprador vuelve de PayPal), NO el
// mecanismo de seguridad principal: el webhook (src/app/api/webhooks/paypal/route.ts)
// sigue siendo la fuente de verdad, porque corre server-to-server sin depender de que
// el navegador del comprador vuelva a cargar esta página. Mismo patrón que
// confirmar-pago.ts para Mercado Pago.
export async function confirmarCapturaPayPal(ordenId: string): Promise<ResultadoConfirmacion> {
  if (!ordenId) {
    return { ok: false, error: "Falta el ID de la orden." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Iniciá sesión para ver tu compra." };
    }

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (!supabaseAdmin) {
      return { ok: false, error: "Falta configuración en el servidor." };
    }

    const { data: ordenPendiente } = await supabaseAdmin
      .from("paypal_ordenes_pendientes")
      .select("usuario_id, items_json")
      .eq("orden_id", ordenId)
      .single();

    // Y tampoco alcanza con que la orden exista: tiene que ser DE este usuario. Si no,
    // cualquiera con un orden_id ajeno (visible en la URL de retorno) podría activarse
    // una compra que no hizo.
    if (!ordenPendiente || ordenPendiente.usuario_id !== user.id) {
      return { ok: false, error: "Este pago no pertenece a tu cuenta." };
    }

    // Nunca confiamos en que "llegamos hasta acá" signifique que PayPal ya cobró:
    // la aprobación solo autoriza, hay que capturar para que el cobro sea real.
    const capturaOk = await capturarOrdenPayPal(ordenId);
    if (!capturaOk) {
      return { ok: false, error: "No pudimos confirmar que el pago esté aprobado." };
    }

    const items: ItemComprado[] = JSON.parse(ordenPendiente.items_json);
    await Promise.all(items.map((item) => otorgarAcceso(supabaseAdmin, user.id, item, ordenId, "paypal")));

    await supabaseAdmin.from("paypal_ordenes_pendientes").delete().eq("orden_id", ordenId);

    return { ok: true };
  } catch (error) {
    console.error("Error al confirmar el pago de PayPal:", error);
    return { ok: false, error: "Ocurrió un error inesperado al confirmar tu pago." };
  }
}
