import { NextRequest, NextResponse } from "next/server";
import { verificarPagoAprobado, crearClienteSupabaseAdmin, otorgarAcceso } from "@/lib/mercadopago-server";

// Siempre respondemos 200 (salvo que la notificación ni siquiera se pueda leer),
// porque si le devolvemos error a Mercado Pago reintenta el mismo aviso sin parar
// y un bug de nuestro lado nunca se arregla solo reintentando.
const OK = () => NextResponse.json({ success: true }, { status: 200 });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const url = new URL(req.url);

    // Mercado Pago manda el aviso de dos formas: el formato nuevo ({ type, data: { id } })
    // o los query params clásicos de IPN (?topic=payment&id=...).
    const topic = body?.type || url.searchParams.get("topic");
    const paymentId = body?.data?.id || url.searchParams.get("id") || url.searchParams.get("data.id");

    if (topic !== "payment" || !paymentId) {
      return OK(); // Otro tipo de notificación (merchant_order, test ping, etc.): no hay nada que hacer.
    }

    // Nunca confiamos en el body de la notificación (cualquiera puede hacerle un POST
    // a esta URL): verificarPagoAprobado vuelve a preguntarle a la API de Mercado Pago.
    const pago = await verificarPagoAprobado(String(paymentId));
    if (!pago) return OK(); // No aprobado, o no se pudo verificar: no se entrega nada todavía.

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (!supabaseAdmin) return OK();

    await Promise.all(pago.items.map((item) => otorgarAcceso(supabaseAdmin, pago.usuarioId, item, String(paymentId))));

    return OK();
  } catch (error) {
    console.error("Error en el webhook de Mercado Pago:", error);
    return OK();
  }
}
