import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { crearClienteSupabaseAdmin } from "@/lib/mercadopago-server";
import { obtenerUrlBase } from "@/lib/notificar-suscriptores";

// Conexión OAuth con Mercado Pago ("vincular cuenta").
//
// Flujo:
// 1. El admin genera un link desde el panel (Configuración > Pagos).
// 2. La dueña de la cuenta que cobra lo abre, inicia sesión en Mercado Pago y autoriza.
// 3. Mercado Pago vuelve a /api/mercadopago/callback con un "code" que se canjea
//    por un access_token + refresh_token, que se guardan en "mercadopago_conexion".
// 4. Todos los cobros usan obtenerAccessTokenMP(), que renueva el token solo
//    cuando le falta poco para vencer (Mercado Pago lo emite por 180 días).
//
// Variables necesarias: MP_CLIENT_ID y MP_CLIENT_SECRET (de la aplicación creada
// en mercadopago.com.ar/developers con la cuenta del programador).

const URL_AUTORIZACION = "https://auth.mercadopago.com.ar/authorization";
const URL_TOKEN = "https://api.mercadopago.com/oauth/token";
const VIGENCIA_LINK_MS = 48 * 60 * 60 * 1000;
const RENOVAR_ANTES_MS = 30 * 24 * 60 * 60 * 1000;

type RespuestaToken = {
  access_token: string;
  refresh_token: string;
  public_key?: string;
  user_id: number | string;
  expires_in: number;
  live_mode?: boolean;
};

function credencialesApp(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.MP_CLIENT_ID;
  const clientSecret = process.env.MP_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function urlCallbackOAuth(): string {
  return `${obtenerUrlBase().replace(/\/$/, "")}/api/mercadopago/callback`;
}

// El "state" viaja en el link y vuelve en el callback. Va firmado con el secret
// de la app y tiene vencimiento, así nadie puede fabricar un callback válido
// ni reutilizar un link viejo para conectar otra cuenta.
function firmar(datos: string, secret: string): string {
  return createHmac("sha256", secret).update(datos).digest("base64url");
}

function crearEstado(secret: string): string {
  const datos = `${Date.now() + VIGENCIA_LINK_MS}.${randomBytes(12).toString("base64url")}`;
  return `${datos}.${firmar(datos, secret)}`;
}

export function estadoEsValido(estado: string | null): boolean {
  const app = credencialesApp();
  if (!app || !estado) return false;

  const partes = estado.split(".");
  if (partes.length !== 3) return false;

  const [vencimiento, nonce, firma] = partes;
  const esperada = Buffer.from(firmar(`${vencimiento}.${nonce}`, app.clientSecret));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return false;

  return Number(vencimiento) > Date.now();
}

export function generarUrlAutorizacion(): string | null {
  const app = credencialesApp();
  if (!app) return null;

  const params = new URLSearchParams({
    client_id: app.clientId,
    response_type: "code",
    platform_id: "mp",
    state: crearEstado(app.clientSecret),
    redirect_uri: urlCallbackOAuth(),
  });
  return `${URL_AUTORIZACION}?${params.toString()}`;
}

async function pedirToken(cuerpo: Record<string, string>): Promise<RespuestaToken> {
  const app = credencialesApp();
  if (!app) throw new Error("Faltan MP_CLIENT_ID / MP_CLIENT_SECRET en el servidor.");

  const respuesta = await fetch(URL_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: app.clientId, client_secret: app.clientSecret, ...cuerpo }),
    cache: "no-store",
  });

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !datos?.access_token) {
    throw new Error(`Mercado Pago rechazó el pedido de token (status ${respuesta.status}): ${datos?.message || datos?.error || "sin detalle"}`);
  }
  return datos as RespuestaToken;
}

async function datosCuenta(accessToken: string): Promise<{ nickname: string | null; email: string | null }> {
  const respuesta = await fetch("https://api.mercadopago.com/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!respuesta.ok) return { nickname: null, email: null };
  const datos = await respuesta.json();
  return { nickname: datos.nickname ?? null, email: datos.email ?? null };
}

async function guardarToken(token: RespuestaToken, conDatosCuenta: boolean) {
  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY para guardar la conexión.");

  const fila: Record<string, unknown> = {
    id: 1,
    mp_user_id: String(token.user_id),
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    public_key: token.public_key ?? null,
    live_mode: token.live_mode ?? true,
    expira_en: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    actualizado_en: new Date().toISOString(),
  };

  if (conDatosCuenta) {
    const cuenta = await datosCuenta(token.access_token);
    fila.mp_nickname = cuenta.nickname;
    fila.mp_email = cuenta.email;
    fila.conectado_en = new Date().toISOString();
  }

  const { error } = await supabaseAdmin.from("mercadopago_conexion").upsert(fila);
  if (error) throw new Error(`No pudimos guardar la conexión con Mercado Pago: ${error.message}`);
}

// Canjea el "code" del callback y guarda la conexión.
export async function conectarConCodigo(code: string) {
  const token = await pedirToken({ grant_type: "authorization_code", code, redirect_uri: urlCallbackOAuth() });
  await guardarToken(token, true);
}

// Token con el que se cobra. Prioridad:
// 1. MP_ACCESS_TOKEN si está definido: pensado para desarrollo local con
//    credenciales de PRUEBA, así en local nunca se cobra con la cuenta real.
//    En producción hay que BORRARLO de Vercel para que se use la conexión.
// 2. La cuenta conectada por OAuth (renovando el token si está por vencer).
export async function obtenerAccessTokenMP(): Promise<string | null> {
  const tokenFijo = process.env.MP_ACCESS_TOKEN;
  if (tokenFijo && !tokenFijo.includes("[SENSITIVE]")) return tokenFijo;

  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) return null;

  const { data: conexion, error } = await supabaseAdmin
    .from("mercadopago_conexion")
    .select("access_token, refresh_token, expira_en")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("No pudimos leer la conexión con Mercado Pago:", error.message);
    return null;
  }
  if (!conexion) {
    console.error("Mercado Pago no está conectado: generá el link desde el panel (Configuración > Pagos).");
    return null;
  }

  const faltaPoco = new Date(conexion.expira_en).getTime() - Date.now() < RENOVAR_ANTES_MS;
  if (!faltaPoco) return conexion.access_token;

  try {
    const nuevo = await pedirToken({ grant_type: "refresh_token", refresh_token: conexion.refresh_token });
    await guardarToken(nuevo, false);
    return nuevo.access_token;
  } catch (err) {
    console.error("No pudimos renovar el token de Mercado Pago:", err);
    // Si todavía no venció, seguimos cobrando con el actual y se reintenta en el próximo cobro.
    return new Date(conexion.expira_en).getTime() > Date.now() ? conexion.access_token : null;
  }
}

export type EstadoConexionMP = {
  appConfigurada: boolean;
  usaTokenFijo: boolean;
  conectada: boolean;
  cuenta: string | null;
  mpUserId: string | null;
  conectadoEn: string | null;
  expiraEn: string | null;
};

// Estado para mostrar en el panel. Nunca devuelve tokens.
export async function leerEstadoConexion(): Promise<EstadoConexionMP> {
  const tokenFijo = process.env.MP_ACCESS_TOKEN;
  const base: EstadoConexionMP = {
    appConfigurada: credencialesApp() !== null,
    usaTokenFijo: Boolean(tokenFijo && !tokenFijo.includes("[SENSITIVE]")),
    conectada: false,
    cuenta: null,
    mpUserId: null,
    conectadoEn: null,
    expiraEn: null,
  };

  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) return base;

  const { data } = await supabaseAdmin
    .from("mercadopago_conexion")
    .select("mp_user_id, mp_nickname, mp_email, conectado_en, expira_en")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return base;
  return {
    ...base,
    conectada: true,
    cuenta: data.mp_email || data.mp_nickname || null,
    mpUserId: data.mp_user_id,
    conectadoEn: data.conectado_en,
    expiraEn: data.expira_en,
  };
}

export async function borrarConexion() {
  const supabaseAdmin = crearClienteSupabaseAdmin();
  if (!supabaseAdmin) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  const { error } = await supabaseAdmin.from("mercadopago_conexion").delete().eq("id", 1);
  if (error) throw new Error(error.message);
}
