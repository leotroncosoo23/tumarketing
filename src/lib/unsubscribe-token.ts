import { createHmac, timingSafeEqual } from "crypto";

// Firma el email con HMAC para que el link de "darse de baja" no se pueda
// falsificar (cualquiera podría escribir ?email=otro@mail.com a mano si no
// hubiera token) ni tampoco requiera guardar un token por suscriptor en la
// base — es determinístico: mismo email siempre da el mismo token.
// Reusa RESEND_API_KEY como secreto de firma en vez de pedir una variable de
// entorno nueva: ya es privada, ya vive en el servidor, y ya es obligatoria
// para que este mismo feature de newsletter funcione en primer lugar.
function secreto(): string {
  return process.env.RESEND_API_KEY || "clave-de-desarrollo-no-usar-en-produccion";
}

export function crearTokenBaja(email: string): string {
  return createHmac("sha256", secreto()).update(email.toLowerCase().trim()).digest("hex");
}

export function verificarTokenBaja(email: string, token: string): boolean {
  const esperado = crearTokenBaja(email);
  const bufEsperado = Buffer.from(esperado);
  const bufRecibido = Buffer.from(token || "");
  if (bufEsperado.length !== bufRecibido.length) return false;
  return timingSafeEqual(bufEsperado, bufRecibido);
}
