import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { crearTokenBaja } from "@/lib/unsubscribe-token";

// "blog@tumarketing.com" hardcodeado hacía fallar el envío en silencio: no
// era ni el dominio real (tumarketingar.com) ni uno verificado en Resend.
const REMITENTE = process.env.RESEND_REMITENTE || "TuMarketing <onboarding@resend.dev>";

// Sin NEXTAUTH_URL configurada, caer a localhost está bien en dev pero manda
// links rotos a suscriptores reales si el deploy en Vercel no la tiene
// cargada — por eso el fallback solo es localhost bajo "next dev" (NODE_ENV
// nunca es "development" en un build/deploy real, sea Production o Preview).
export function obtenerUrlBase(): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.tumarketingar.com";
}

export type ParametrosAviso = {
  encabezado: string;
  asunto: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  urlDestino: string;
  textoBoton: string;
};

export type ResultadoAviso =
  | { ok: true; enviados: number; total: number; errores?: string[] }
  | { ok: false; error: string };

function armarHtml(params: ParametrosAviso, email: string): string {
  const urlBase = obtenerUrlBase();
  const urlBaja = `${urlBase}/newsletter/baja?email=${encodeURIComponent(email)}&token=${crearTokenBaja(email)}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ccff00 0%, #b8e600 100%); padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: black; margin: 0;">${params.encabezado}</h1>
      </div>

      <div style="background: #f5f5f5; padding: 30px; border-radius: 10px; margin-top: 20px;">
        ${params.imagenUrl ? `<img src="${params.imagenUrl}" alt="${params.titulo}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />` : ""}

        <h2 style="color: #333; font-size: 24px;">${params.titulo}</h2>

        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          ${params.descripcion || ""}
        </p>

        <a href="${params.urlDestino}" style="display: inline-block; background: #ccff00; color: black; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
          ${params.textoBoton}
        </a>
      </div>

      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
        © ${new Date().getFullYear()} TuMarketing. Todos los derechos reservados.
        <br />
        <a href="${urlBaja}" style="color: #999; text-decoration: underline;">Darme de baja del newsletter</a>
      </p>
    </div>
  `;
}

// Compartido por /api/enviar-notificacion-blog y /api/enviar-notificacion-servicio
// (y cualquier otro aviso a "suscriptores" que se agregue después): arma el
// HTML, manda un email por destinatario (nunca todos juntos en un solo "to")
// y devuelve cuántos salieron bien.
export async function notificarSuscriptores(params: ParametrosAviso): Promise<ResultadoAviso> {
  // "new Resend(undefined)" tira una excepción al construirse, no un error
  // que un try/catch más arriba pueda atajar con elegancia — por eso el
  // chequeo explícito antes de instanciarlo.
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Falta RESEND_API_KEY en el servidor." };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: suscriptores, error: errorSuscriptores } = await supabase
    .from("suscriptores")
    .select("email")
    .eq("activo", true);

  if (errorSuscriptores) {
    return { ok: false, error: "Error al obtener suscriptores: " + errorSuscriptores.message };
  }
  if (!suscriptores || suscriptores.length === 0) {
    return { ok: true, enviados: 0, total: 0 };
  }

  // Un email por destinatario (resend.batch.send, hasta 100 por llamada), no
  // uno solo con todos en "to": así nadie ve la dirección de los demás. Cada
  // uno lleva SU PROPIO link de baja (el token depende del email).
  const batchSize = 100;
  let enviados = 0;
  const detallesError: string[] = [];

  for (let i = 0; i < suscriptores.length; i += batchSize) {
    const batch = suscriptores.slice(i, i + batchSize);
    const emails = batch.map((s) => ({
      from: REMITENTE,
      to: s.email as string,
      subject: params.asunto,
      html: armarHtml(params, s.email as string),
    }));

    try {
      const { error: errorEnvio } = await resend.batch.send(emails);
      if (errorEnvio) {
        console.error("Error enviando emails:", errorEnvio);
        detallesError.push(errorEnvio.message || JSON.stringify(errorEnvio));
      } else {
        enviados += batch.length;
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en lote:", error);
      detallesError.push(mensajeError);
    }
  }

  return { ok: true, enviados, total: suscriptores.length, errores: detallesError.length > 0 ? detallesError : undefined };
}
