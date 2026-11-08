"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  generarUrlAutorizacion,
  leerEstadoConexion,
  borrarConexion,
  urlCallbackOAuth,
  type EstadoConexionMP,
} from "@/lib/mercadopago-oauth";

// Solo el rol "admin" maneja la cuenta que cobra (los editores no).
// El rol se resuelve siempre del lado del servidor, nunca se confía en el cliente.
async function esAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: perfil } = await supabase.from("usuarios").select("rol").eq("id", user.id).maybeSingle();
  return perfil?.rol === "admin";
}

type Resultado<T> = { ok: true; data: T } | { ok: false; error: string };

export async function obtenerEstadoMercadoPago(): Promise<Resultado<EstadoConexionMP & { urlCallback: string }>> {
  if (!(await esAdmin())) return { ok: false, error: "Solo un admin puede ver esta sección." };
  return { ok: true, data: { ...(await leerEstadoConexion()), urlCallback: urlCallbackOAuth() } };
}

export type CuentaMP = { id: number; nickname: string | null; email: string | null; esPrueba: boolean };

export type DiagnosticoMP = {
  // De quién es el MP_ACCESS_TOKEN cargado en el servidor (o el error de MP).
  tokenFijo: { cargado: boolean; cuenta: CuentaMP | null; error: string | null };
  // Si MP_CLIENT_ID + MP_CLIENT_SECRET son válidos y de qué cuenta es la app.
  app: { cargada: boolean; clientId: string | null; duenio: CuentaMP | null; error: string | null };
  // Con qué token se cobra hoy, en la práctica.
  cobraCon: "token_fijo" | "cuenta_conectada" | "nadie";
};

async function cuentaDeToken(token: string): Promise<{ cuenta: CuentaMP | null; error: string | null }> {
  try {
    const r = await fetch("https://api.mercadopago.com/users/me", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const j = await r.json();
    if (!r.ok) return { cuenta: null, error: j?.message || `Mercado Pago respondió ${r.status}` };
    const email: string | null = j.email ?? null;
    const nickname: string | null = j.nickname ?? null;
    const esPrueba = /testuser/i.test(email || "") || /^TESTUSER/i.test(nickname || "") || String(token).startsWith("TEST-");
    return { cuenta: { id: j.id, nickname, email, esPrueba }, error: null };
  } catch {
    return { cuenta: null, error: "No pudimos consultar a Mercado Pago." };
  }
}

// Verifica contra Mercado Pago las credenciales cargadas en el servidor, sin
// devolver nunca los valores: solo a qué cuenta pertenecen y si funcionan.
export async function diagnosticarMercadoPago(): Promise<Resultado<DiagnosticoMP>> {
  if (!(await esAdmin())) return { ok: false, error: "Solo un admin puede ver esta sección." };

  const tokenEnv = process.env.MP_ACCESS_TOKEN?.trim();
  const tokenCargado = Boolean(tokenEnv && !tokenEnv.includes("[SENSITIVE]"));
  const tokenFijo: DiagnosticoMP["tokenFijo"] = { cargado: tokenCargado, cuenta: null, error: null };
  if (tokenCargado) Object.assign(tokenFijo, await cuentaDeToken(tokenEnv!));

  const clientId = process.env.MP_CLIENT_ID?.trim() || null;
  const clientSecret = process.env.MP_CLIENT_SECRET?.trim() || null;
  const app: DiagnosticoMP["app"] = { cargada: Boolean(clientId && clientSecret), clientId, duenio: null, error: null };
  if (clientId && clientSecret) {
    try {
      const r = await fetch("https://api.mercadopago.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
        cache: "no-store",
      });
      const j = await r.json();
      if (!r.ok || !j.access_token) app.error = j?.message || `Mercado Pago respondió ${r.status}`;
      else {
        const res = await cuentaDeToken(j.access_token);
        app.duenio = res.cuenta;
        app.error = res.error;
      }
    } catch {
      app.error = "No pudimos consultar a Mercado Pago.";
    }
  }

  const conexion = await leerEstadoConexion();
  const cobraCon = tokenCargado ? "token_fijo" : conexion.conectada ? "cuenta_conectada" : "nadie";
  return { ok: true, data: { tokenFijo, app, cobraCon } };
}

export async function generarLinkConexionMercadoPago(): Promise<Resultado<string>> {
  if (!(await esAdmin())) return { ok: false, error: "Solo un admin puede generar el link." };
  const url = generarUrlAutorizacion();
  if (!url) return { ok: false, error: "Faltan MP_CLIENT_ID y MP_CLIENT_SECRET en las variables del servidor." };
  return { ok: true, data: url };
}

export async function desconectarMercadoPago(): Promise<Resultado<null>> {
  if (!(await esAdmin())) return { ok: false, error: "Solo un admin puede desconectar la cuenta." };
  try {
    await borrarConexion();
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "No pudimos desconectar la cuenta." };
  }
}
