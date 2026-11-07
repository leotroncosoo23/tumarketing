"use server";

import { randomUUID } from "crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { crearOrdenPayPal, capturarOrdenPayPal } from "@/lib/paypal-server";
import { crearClienteSupabaseAdmin, consultarPagoInfoproducto } from "@/lib/mercadopago-server";
import { obtenerAccessTokenMP } from "@/lib/mercadopago-oauth";
import { obtenerUrlBase } from "@/lib/notificar-suscriptores";
import { PRECIO_LANZAMIENTO, PRECIO_LANZAMIENTO_ARS } from "@/app/de-creador-a-dueno/precios";
import { enviarAccesoInfoproducto } from "@/lib/entrega-infoproducto";

// Precio fijo del lanzamiento: a diferencia del carrito (que busca el precio
// real en "servicios" para que nadie lo manipule desde el cliente), este
// infoproducto no vive en esa tabla — es una landing puntual, no un servicio
// del catálogo. Se importa de la MISMA fuente que usan la landing y el
// checkout para el precio que se muestra en pantalla: así lo que se cobra de
// verdad nunca puede quedar desincronizado de lo que el comprador vio.
const PRODUCTO = "de-creador-a-dueno";
const TITULO_PRODUCTO = "De Creador/a a Dueño/a — Sistema completo + 4 bonos";
const PRECIO_USD = PRECIO_LANZAMIENTO;

type ResultadoOrden = { ok: true; linkAprobacion: string } | { ok: false; error: string };

export async function crearOrdenInfoproducto(datos: {
  nombre: string;
  email: string;
  telefono: string;
}): Promise<ResultadoOrden> {
  const nombre = datos.nombre?.trim();
  const email = datos.email?.trim();
  const telefono = datos.telefono?.trim();

  if (!nombre || !email) {
    return { ok: false, error: "Completá tu nombre y tu email antes de continuar." };
  }

  try {
    const resultado = await crearOrdenPayPal(
      [{ id: PRODUCTO, titulo: TITULO_PRODUCTO, precioUsd: PRECIO_USD }],
      obtenerUrlBase(),
      "/de-creador-a-dueno/gracias"
    );
    if (!resultado.ok) return resultado;

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (supabaseAdmin) {
      // Guardamos el lead + la orden pendiente ahora, no después de pagar:
      // si el comprador nunca vuelve a completar el pago, igual queda el
      // registro de que alguien llegó hasta acá con sus datos de contacto.
      const { error } = await supabaseAdmin.from("ventas_infoproductos").insert([
        {
          producto: PRODUCTO,
          nombre,
          email,
          telefono: telefono || null,
          monto_usd: PRECIO_USD,
          estado: "pendiente",
          paypal_order_id: resultado.ordenId,
        },
      ]);
      if (error) console.error("No pudimos guardar el lead del infoproducto:", error.message);
    }

    return { ok: true, linkAprobacion: resultado.linkAprobacion };
  } catch (error) {
    console.error("Error al crear la orden del infoproducto:", error);
    const mensaje = error instanceof Error ? error.message : "No pudimos conectar con PayPal.";
    return { ok: false, error: mensaje };
  }
}

// Checkout por Mercado Pago. No exige sesión (igual que PayPal en este producto).
// Sin venta guardada no habría a quién entregarle, por eso acá un error al guardar
// corta la compra antes de que el comprador llegue a pagar.
// La referencia va en "paypal_order_id" para reusar la tabla y su índice único sin
// migrar la base; el prefijo mp_ distingue de qué pasarela vino cada venta.
export async function crearPreferenciaInfoproducto(datos: {
  nombre: string;
  email: string;
  telefono: string;
}): Promise<ResultadoOrden> {
  const nombre = datos.nombre?.trim();
  const email = datos.email?.trim();
  const telefono = datos.telefono?.trim();

  if (!nombre || !email) {
    return { ok: false, error: "Completá tu nombre y tu email antes de continuar." };
  }
  const supabaseAdmin = crearClienteSupabaseAdmin();
  const accessToken = await obtenerAccessTokenMP();
  if (!accessToken || !supabaseAdmin) {
    return { ok: false, error: "Mercado Pago no está disponible en este momento. Probá con PayPal o escribinos." };
  }

  try {
    const referencia = `mp_${randomUUID()}`;
    const urlBase = obtenerUrlBase();
    const urlGracias = `${urlBase}/de-creador-a-dueno/gracias`;
    // Mercado Pago rechaza auto_return y notification_url si la URL no es pública (https).
    const esUrlPublica = /^https:\/\//.test(urlBase);

    const preferencia = new Preference(new MercadoPagoConfig({ accessToken }));
    const respuesta = await preferencia.create({
      body: {
        items: [{ id: PRODUCTO, title: TITULO_PRODUCTO, quantity: 1, unit_price: PRECIO_LANZAMIENTO_ARS, currency_id: "ARS" }],
        payer: { name: nombre, email },
        back_urls: { success: urlGracias, pending: urlGracias, failure: urlGracias },
        external_reference: referencia,
        metadata: { producto: PRODUCTO },
        // Se manda en cada compra para no depender de configurar el webhook en el panel de Mercado Pago.
        ...(esUrlPublica ? { auto_return: "approved" as const, notification_url: `${urlBase}/api/webhooks/mercadopago` } : {}),
      },
    });

    const linkAprobacion = respuesta.init_point ?? respuesta.sandbox_init_point;
    if (!linkAprobacion) throw new Error("Mercado Pago no devolvió una URL de pago.");

    const { error } = await supabaseAdmin.from("ventas_infoproductos").insert([
      {
        producto: PRODUCTO,
        nombre,
        email,
        telefono: telefono || null,
        monto_usd: PRECIO_USD,
        estado: "pendiente",
        paypal_order_id: referencia,
      },
    ]);
    if (error) throw new Error(`No pudimos guardar la venta: ${error.message}`);

    return { ok: true, linkAprobacion };
  } catch (error) {
    console.error("Error al crear la preferencia del infoproducto:", error);
    return { ok: false, error: "No pudimos conectar con Mercado Pago. Probá de nuevo o elegí PayPal." };
  }
}

type ResultadoPagoMercadoPago = { ok: true } | { ok: false; error: string; pendiente?: boolean };

// Lo llaman la página de "gracias" y el webhook de Mercado Pago. Es idempotente:
// solo la transición pendiente→pagado manda el email de acceso.
export async function confirmarPagoMercadoPagoInfoproducto(paymentId: string): Promise<ResultadoPagoMercadoPago> {
  if (!paymentId) return { ok: false, error: "Falta el ID del pago." };

  try {
    const pago = await consultarPagoInfoproducto(paymentId, PRODUCTO);
    if (!pago) return { ok: false, error: "No pudimos confirmar el pago." };

    // Efectivo o pago en revisión: el acceso sale cuando el webhook avise que se acreditó.
    if (pago.estado === "pending" || pago.estado === "in_process") {
      return { ok: false, pendiente: true, error: "Tu pago todavía está pendiente." };
    }
    if (pago.estado !== "approved") {
      return { ok: false, error: "El pago no se completó. Podés volver a intentarlo." };
    }

    await marcarPagadaYEntregar(pago.referencia);
    return { ok: true };
  } catch (error) {
    console.error("Error al confirmar el pago de Mercado Pago del infoproducto:", error);
    return { ok: false, error: "Ocurrió un error inesperado al confirmar tu pago." };
  }
}

type ResultadoConfirmacion = { ok: true } | { ok: false; error: string };

// Update condicional (.eq("estado", "pendiente")): esta función puede llamarse dos
// veces para la misma venta —una vez desde la página de "gracias" y otra desde el
// webhook—, y solo la transición pendiente→pagado debe disparar el envío del email.
// Si la fila ya estaba en "pagado", "data" vuelve vacío y no reenviamos nada.
async function marcarPagadaYEntregar(referencia: string): Promise<void> {
  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) return;

  const { data, error } = await supabaseAdmin
    .from("ventas_infoproductos")
    .update({ estado: "pagado" })
    .eq("paypal_order_id", referencia)
    .eq("estado", "pendiente")
    .select("nombre, email")
    .maybeSingle();

  if (error) {
    console.error("No pudimos actualizar la venta a 'pagado':", error.message);
  } else if (data) {
    const envio = await enviarAccesoInfoproducto({ email: data.email, nombre: data.nombre });
    if (!envio.ok) {
      console.error(`Venta ${referencia} marcada como pagada pero el email de acceso falló:`, envio.error);
    }
  }
}

export async function confirmarCompraInfoproducto(ordenId: string): Promise<ResultadoConfirmacion> {
  if (!ordenId) return { ok: false, error: "Falta el ID de la orden." };

  try {
    // Nunca confiamos en "llegamos hasta la página de gracias" como prueba de
    // pago: hay que capturar de verdad contra la API de PayPal.
    const capturaOk = await capturarOrdenPayPal(ordenId);
    if (!capturaOk) {
      return { ok: false, error: "No pudimos confirmar que el pago esté aprobado." };
    }

    await marcarPagadaYEntregar(ordenId);

    return { ok: true };
  } catch (error) {
    console.error("Error al confirmar la compra del infoproducto:", error);
    return { ok: false, error: "Ocurrió un error inesperado al confirmar tu pago." };
  }
}
