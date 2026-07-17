"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { crearOrdenPayPal } from "@/lib/paypal-server";
import { crearClienteSupabaseAdmin } from "@/lib/mercadopago-server";
import type { ItemCarrito } from "@/lib/CartContext";

type ResultadoOrdenPayPal = { ok: true; linkAprobacion: string } | { ok: false; error: string };

const URL_BASE = process.env.NEXTAUTH_URL || "http://localhost:3000";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// Igual que buscarPrecioArsReal en mercadopago.ts: nunca confiamos en el precio_usd
// que manda el cliente (el carrito vive en localStorage). Solo "servicio" tiene
// columna precio_usd en Supabase hoy; los cursos no soportan pago en dólares.
async function buscarPrecioUsdReal(supabase: SupabaseServerClient, item: ItemCarrito): Promise<number> {
  if (item.tipo !== "servicio") {
    throw new Error(`"${item.titulo}" no está disponible para pago en dólares todavía.`);
  }

  const { data, error } = await supabase.from("servicios").select("precio_usd").eq("id", item.id).single();
  if (error || !data) throw new Error(`No encontramos el servicio "${item.titulo}".`);
  return data.precio_usd;
}

export async function crearOrdenPayPalAction(itemsCarrito: ItemCarrito[]): Promise<ResultadoOrdenPayPal> {
  if (!itemsCarrito || itemsCarrito.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }

  try {
    const supabase = await createSupabaseServerClient();

    // El webhook y la página de retorno necesitan saber a quién darle acceso,
    // así que exigimos sesión iniciada antes de generar la orden.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Iniciá sesión para poder comprar." };
    }

    const items = await Promise.all(
      itemsCarrito.map(async (item) => ({
        id: item.id,
        titulo: item.titulo,
        precioUsd: await buscarPrecioUsdReal(supabase, item),
      }))
    );

    const resultado = await crearOrdenPayPal(items, URL_BASE);
    if (!resultado.ok) return resultado;

    // Guardamos quién compró y qué compró en nuestra propia base, porque PayPal
    // limita custom_id/invoice_id a 127 caracteres (no alcanza para serializar
    // varios ítems). La página de retorno y el webhook leen esta fila por orden_id.
    // Usamos el cliente admin porque esta tabla solo la toca el servidor (sin RLS pública).
    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (!supabaseAdmin) {
      return { ok: false, error: "Falta configuración en el servidor." };
    }

    const { error: errorInsert } = await supabaseAdmin.from("paypal_ordenes_pendientes").insert([
      {
        orden_id: resultado.ordenId,
        usuario_id: user.id,
        items_json: JSON.stringify(itemsCarrito.map((item) => ({ id: item.id, tipo: item.tipo }))),
      },
    ]);

    if (errorInsert) {
      console.error("Error al guardar la orden pendiente de PayPal:", errorInsert.message);
      return { ok: false, error: "No pudimos preparar el pago con PayPal." };
    }

    return { ok: true, linkAprobacion: resultado.linkAprobacion };
  } catch (error) {
    console.error("Error al crear la orden de PayPal:", error);
    const mensaje = error instanceof Error ? error.message : "No pudimos conectar con PayPal.";
    return { ok: false, error: mensaje };
  }
}
