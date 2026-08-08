const API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

export type ItemOrdenPayPal = { id: string; titulo: string; precioUsd: number };
export type OrdenPayPalCreada = { ok: true; ordenId: string; linkAprobacion: string } | { ok: false; error: string };

// PayPal no usa API key fija: hay que pedir un access token OAuth2 (client_credentials)
// en cada operación. No lo cacheamos entre requests porque las Server Actions de
// Next.js no comparten memoria de forma confiable entre invocaciones.
type AccessTokenResult = { ok: true; token: string } | { ok: false; error: string };

async function obtenerAccessToken(): Promise<AccessTokenResult> {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return { ok: false, error: "Falta PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en el servidor." };
  }

  const credenciales = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const respuesta = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credenciales}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!respuesta.ok) {
    // No devolvemos el body crudo al cliente (podría filtrar detalles internos
    // de la cuenta de PayPal), pero sí lo logueamos server-side para poder
    // diagnosticar credenciales inválidas/vencidas sin adivinar.
    const detalle = await respuesta.text().catch(() => "");
    console.error(`PayPal OAuth token falló (status ${respuesta.status}):`, detalle);
    return { ok: false, error: `PayPal rechazó las credenciales configuradas (status ${respuesta.status}).` };
  }
  const data = await respuesta.json();
  return { ok: true, token: data.access_token as string };
}

// Crea la orden en PayPal (intent CAPTURE: recién se cobra cuando llamemos a
// capturarOrdenPayPal más adelante, no en este paso). El total y los ítems ya
// vienen calculados con precios reales de Supabase, nunca con lo que mande el cliente.
export async function crearOrdenPayPal(
  items: ItemOrdenPayPal[],
  urlBase: string,
  returnPath: string = "/pago-exitoso-paypal"
): Promise<OrdenPayPalCreada> {
  const resultadoToken = await obtenerAccessToken();
  if (!resultadoToken.ok) return { ok: false, error: resultadoToken.error };
  const accessToken = resultadoToken.token;

  const totalUsd = items.reduce((suma, item) => suma + item.precioUsd, 0);

  const respuesta = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalUsd.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: totalUsd.toFixed(2) },
            },
          },
          items: items.map((item) => ({
            name: item.titulo.slice(0, 127),
            unit_amount: { currency_code: "USD", value: item.precioUsd.toFixed(2) },
            quantity: "1",
          })),
        },
      ],
      application_context: {
        return_url: `${urlBase}${returnPath}`,
        cancel_url: `${urlBase}/estado-pago`,
        user_action: "PAY_NOW",
      },
    }),
  });

  if (!respuesta.ok) {
    console.error("Error al crear la orden de PayPal:", await respuesta.text());
    return { ok: false, error: "No pudimos conectar con PayPal." };
  }

  const orden = await respuesta.json();
  const linkAprobacion: string | undefined = orden.links?.find((link: { rel: string }) => link.rel === "approve")?.href;
  if (!linkAprobacion) return { ok: false, error: "PayPal no devolvió una URL de pago." };

  return { ok: true, ordenId: orden.id, linkAprobacion };
}

// Captura de verdad el dinero de una orden ya aprobada por el comprador. Antes de
// esto no hubo ningún cobro: la aprobación en PayPal solo autoriza, no cobra.
export async function capturarOrdenPayPal(ordenId: string): Promise<boolean> {
  const resultadoToken = await obtenerAccessToken();
  if (!resultadoToken.ok) return false;
  const accessToken = resultadoToken.token;

  const respuesta = await fetch(`${API_BASE}/v2/checkout/orders/${ordenId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // 422 UNPROCESSABLE_ENTITY con "ORDER_ALREADY_CAPTURED" es esperable si la página
  // de retorno y el webhook intentan capturar la misma orden casi al mismo tiempo:
  // lo tratamos como éxito porque el otorgamiento de acceso ya es idempotente.
  if (!respuesta.ok) {
    const cuerpo = await respuesta.text();
    if (cuerpo.includes("ORDER_ALREADY_CAPTURED")) return true;
    console.error(`No pudimos capturar la orden ${ordenId} de PayPal:`, cuerpo);
    return false;
  }

  const resultado = await respuesta.json();
  return resultado.status === "COMPLETED";
}

// Igual que verificarPagoAprobado en Mercado Pago: nunca confiamos en el body que
// llega al webhook, siempre le volvemos a preguntar a la API de PayPal si la firma
// es válida antes de otorgar acceso.
export async function verificarFirmaWebhook(headers: Headers, bodyCrudo: string): Promise<boolean> {
  const resultadoToken = await obtenerAccessToken();
  if (!resultadoToken.ok || !process.env.PAYPAL_WEBHOOK_ID) return false;
  const accessToken = resultadoToken.token;

  const respuesta = await fetch(`${API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(bodyCrudo),
    }),
  });

  if (!respuesta.ok) return false;
  const resultado = await respuesta.json();
  return resultado.verification_status === "SUCCESS";
}
