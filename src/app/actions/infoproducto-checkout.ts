"use server";

import { crearOrdenPayPal, capturarOrdenPayPal } from "@/lib/paypal-server";
import { crearClienteSupabaseAdmin } from "@/lib/mercadopago-server";
import { obtenerUrlBase } from "@/lib/notificar-suscriptores";
import { PRECIO_LANZAMIENTO } from "@/app/de-creador-a-dueno/precios";
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

type ResultadoConfirmacion = { ok: true } | { ok: false; error: string };

export async function confirmarCompraInfoproducto(ordenId: string): Promise<ResultadoConfirmacion> {
  if (!ordenId) return { ok: false, error: "Falta el ID de la orden." };

  try {
    // Nunca confiamos en "llegamos hasta la página de gracias" como prueba de
    // pago: hay que capturar de verdad contra la API de PayPal.
    const capturaOk = await capturarOrdenPayPal(ordenId);
    if (!capturaOk) {
      return { ok: false, error: "No pudimos confirmar que el pago esté aprobado." };
    }

    const supabaseAdmin = crearClienteSupabaseAdmin();
    if (supabaseAdmin) {
      // Update condicional (.eq("estado", "pendiente")): esta función puede
      // llamarse dos veces para la misma venta —una vez desde la página de
      // "gracias" y otra desde el webhook real de PayPal—, y solo la
      // transición pendiente→pagado debe disparar el envío del email. Si la
      // fila ya estaba en "pagado", "data" vuelve vacío y no reenviamos nada.
      const { data, error } = await supabaseAdmin
        .from("ventas_infoproductos")
        .update({ estado: "pagado" })
        .eq("paypal_order_id", ordenId)
        .eq("estado", "pendiente")
        .select("nombre, email")
        .maybeSingle();

      if (error) {
        console.error("No pudimos actualizar la venta a 'pagado':", error.message);
      } else if (data) {
        const envio = await enviarAccesoInfoproducto({ email: data.email, nombre: data.nombre });
        if (!envio.ok) {
          console.error(`Venta ${ordenId} marcada como pagada pero el email de acceso falló:`, envio.error);
        }
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Error al confirmar la compra del infoproducto:", error);
    return { ok: false, error: "Ocurrió un error inesperado al confirmar tu pago." };
  }
}
