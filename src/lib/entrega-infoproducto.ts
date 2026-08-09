import { Resend } from "resend";

// Mismo criterio que notificar-suscriptores.ts: remitente configurable, con
// el sandbox de Resend como fallback si todavía no se cargó la variable.
const REMITENTE = process.env.RESEND_REMITENTE || "TuMarketing <onboarding@resend.dev>";
const LINK_DRIVE = "https://drive.google.com/drive/folders/1Clbg_2hb6s6cqQdqWBHGour_dYyzbspv?usp=sharing";

type ResultadoEnvio = { ok: true } | { ok: false; error: string };

function armarHtmlEntrega(nombre: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ccff00 0%, #b8e600 100%); padding: 24px; border-radius: 10px; text-align: center;">
        <h1 style="color: black; margin: 0; font-size: 22px;">🎉 ¡Gracias por tu compra, ${nombre}!</h1>
      </div>

      <div style="background: #f5f5f5; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Tu pago de <strong>"De Creador/a a Dueño/a"</strong> ya se acreditó y tu acceso está listo. Todo el
          sistema (6 módulos) + los 4 bonos te están esperando en la carpeta de Google Drive.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${LINK_DRIVE}"
            style="display: inline-block; background: #ccff00; color: black; padding: 16px 36px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;"
          >
            Acceder al Pack
          </a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Guardá este email: es tu acceso permanente. Si el link no te funciona o tenés cualquier problema,
          respondé este mismo correo o escribinos por WhatsApp y lo resolvemos al instante.
        </p>
      </div>

      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
        © ${new Date().getFullYear()} TuMarketing. Todos los derechos reservados.
      </p>
    </div>
  `;
}

// Entrega del infoproducto por email: se llama tanto desde el webhook de
// PayPal (fuente de verdad real, server-to-server) como desde la página de
// "gracias" (atajo de UX para que no dependa de que el webhook llegue, algo
// que en local ni siquiera es posible porque PayPal no puede pegarle a
// localhost). El llamador es responsable de la idempotencia (no invocar esto
// dos veces para la misma venta).
export async function enviarAccesoInfoproducto(destino: { email: string; nombre: string }): Promise<ResultadoEnvio> {
  if (!process.env.RESEND_API_KEY) {
    console.error("Falta RESEND_API_KEY: no se pudo enviar el acceso a", destino.email);
    return { ok: false, error: "Falta RESEND_API_KEY en el servidor." };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: REMITENTE,
      to: destino.email,
      subject: '🎉 Tu acceso a "De Creador/a a Dueño/a" ya está listo',
      html: armarHtmlEntrega(destino.nombre || "de nuevo"),
    });

    if (error) {
      console.error(`Resend rechazó el envío del acceso a ${destino.email}:`, error);
      return { ok: false, error: error.message || "Resend rechazó el envío." };
    }
    return { ok: true };
  } catch (error) {
    console.error(`Error de red al enviar el acceso a ${destino.email}:`, error);
    return { ok: false, error: error instanceof Error ? error.message : "Error desconocido." };
  }
}
