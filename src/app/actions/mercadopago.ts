"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ItemCarrito } from "@/lib/CartContext";

type ResultadoPreferencia = { ok: true; initPoint: string } | { ok: false; error: string };

const URL_BASE = process.env.NEXTAUTH_URL || "http://localhost:3000";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// Busca el precio real en Supabase en vez de confiar en el que manda el cliente,
// porque el carrito vive en localStorage y cualquiera podría editarlo antes de pagar.
async function buscarPrecioArsReal(supabase: SupabaseServerClient, item: ItemCarrito): Promise<number> {
  if (item.tipo === "servicio") {
    const { data, error } = await supabase.from("servicios").select("precio_ars").eq("id", item.id).single();
    if (error || !data) throw new Error(`No encontramos el servicio "${item.titulo}".`);
    return data.precio_ars;
  }

  const { data, error } = await supabase.from("cursos").select("precio, precio_descuento").eq("id", item.id).single();
  if (error || !data) throw new Error(`No encontramos el curso "${item.titulo}".`);
  return data.precio_descuento ?? data.precio;
}

export async function crearPreferenciaPago(itemsCarrito: ItemCarrito[]): Promise<ResultadoPreferencia> {
  if (!itemsCarrito || itemsCarrito.length === 0) {
    return { ok: false, error: "Tu carrito está vacío." };
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return { ok: false, error: "Mercado Pago no está configurado en el servidor." };
  }

  try {
    const supabase = await createSupabaseServerClient();

    // El webhook necesita saber a quién darle acceso cuando el pago se apruebe,
    // así que exigimos sesión iniciada antes de generar la preferencia.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Iniciá sesión para poder comprar." };
    }

    const items = await Promise.all(
      itemsCarrito.map(async (item) => ({
        id: item.id,
        title: item.titulo,
        picture_url: item.miniatura_url,
        quantity: 1,
        unit_price: await buscarPrecioArsReal(supabase, item),
        currency_id: "ARS",
      }))
    );

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    // "auto_return" exige que back_urls.success sea una URL pública (https), así que
    // solo lo mandamos cuando URL_BASE no es localhost; si no, el usuario vuelve
    // manualmente con el botón que ya muestra el checkout de Mercado Pago.
    const esUrlPublica = /^https:\/\//.test(URL_BASE);

    const respuesta = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${URL_BASE}/pago-exitoso`,
          failure: `${URL_BASE}/estado-pago`,
          pending: `${URL_BASE}/estado-pago`,
        },
        ...(esUrlPublica ? { auto_return: "approved" as const } : {}),
        external_reference: user.id,
        // Mandamos los ítems como string (no como objeto anidado) para que el
        // webhook los recupere tal cual, sin depender de cómo Mercado Pago
        // serialice metadata compleja.
        metadata: {
          usuario_id: user.id,
          items_json: JSON.stringify(itemsCarrito.map((item) => ({ id: item.id, tipo: item.tipo }))),
        },
      },
    });

    const initPoint = respuesta.init_point ?? respuesta.sandbox_init_point;
    if (!initPoint) throw new Error("Mercado Pago no devolvió una URL de pago.");

    return { ok: true, initPoint };
  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    const mensaje = extraerMensajeError(error);
    return { ok: false, error: mensaje };
  }
}

// El SDK de Mercado Pago no siempre lanza instancias de Error: en varios casos
// rechaza con un objeto plano ({ message, error, status }) con la respuesta de su API.
function extraerMensajeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "No pudimos conectar con Mercado Pago.";
}
