import { NextRequest, NextResponse } from "next/server";
import { verificarFirmaWebhook, capturarOrdenPayPal } from "@/lib/paypal-server";
import { crearClienteSupabaseAdmin, otorgarAcceso, type ItemComprado } from "@/lib/mercadopago-server";

// Siempre respondemos 200 (salvo que la notificación ni siquiera se pueda leer),
// porque si le devolvemos error a PayPal reintenta el mismo aviso sin parar y un
// bug de nuestro lado nunca se arregla solo reintentando. Mismo criterio que el
// webhook de Mercado Pago.
const OK = () => NextResponse.json({ success: true }, { status: 200 });

export async function POST(req: NextRequest) {
  try {
    const bodyCrudo = await req.text();

    // Nunca confiamos en el body del webhook (cualquiera puede hacerle un POST a
    // esta URL): validamos la firma contra la API de PayPal antes de hacer nada.
    const firmaValida = await verificarFirmaWebhook(req.headers, bodyCrudo);
    if (!firmaValida) return OK();

    const evento = JSON.parse(bodyCrudo);
    if (evento.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return OK(); // Otro tipo de evento: no hay nada que hacer.
    }

    const ordenId: string | undefined = evento.resource?.supplementary_data?.related_ids?.order_id;
    if (!ordenId) return OK();

    // La captura ya está confirmada por el evento, pero puede que la página de
    // retorno todavía no haya llamado a capturarOrdenPayPal: nos aseguramos de que
    // quede capturada (capturarOrdenPayPal ya trata "ya capturada" como éxito).
    const capturaOk = await capturarOrdenPayPal(ordenId);
    if (!capturaOk) return OK();

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (!supabaseAdmin) return OK();

    const { data: ordenPendiente } = await supabaseAdmin
      .from("paypal_ordenes_pendientes")
      .select("usuario_id, items_json")
      .eq("orden_id", ordenId)
      .single();

    if (!ordenPendiente) return OK(); // Ya se procesó (la página de retorno la borró) o no existe.

    const items: ItemComprado[] = JSON.parse(ordenPendiente.items_json);
    await Promise.all(
      items.map((item) => otorgarAcceso(supabaseAdmin, ordenPendiente.usuario_id, item, ordenId, "paypal"))
    );

    await supabaseAdmin.from("paypal_ordenes_pendientes").delete().eq("orden_id", ordenId);

    return OK();
  } catch (error) {
    console.error("Error en el webhook de PayPal:", error);
    return OK();
  }
}
