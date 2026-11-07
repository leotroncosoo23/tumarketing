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
