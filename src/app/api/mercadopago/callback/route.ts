import { NextRequest, NextResponse } from "next/server";
import { conectarConCodigo, estadoEsValido } from "@/lib/mercadopago-oauth";

// Mercado Pago vuelve acá después de que la dueña de la cuenta autoriza.
// Quien llega no tiene sesión en el sitio (es la persona que cobra, no el admin):
// lo que protege esta ruta es el "state" firmado y con vencimiento del link.

function pagina(titulo: string, mensaje: string, ok: boolean, status = 200) {
  const color = ok ? "#ccff00" : "#ff6b6b";
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo} · Tu Marketing</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:16px">
<div style="max-width:420px;text-align:center">
<div style="font-size:48px;color:${color}">${ok ? "✓" : "!"}</div>
<h1 style="font-size:24px;margin:12px 0">${titulo}</h1>
<p style="color:#a3a3a3;line-height:1.5">${mensaje}</p>
</div></body></html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const estado = params.get("state");

  if (params.get("error") || !code) {
    return pagina("No se conectó", "La autorización fue cancelada o Mercado Pago no la completó. Podés volver a abrir el link para intentarlo de nuevo.", false, 400);
  }

  if (!estadoEsValido(estado)) {
    return pagina("Link vencido", "Este link de conexión ya no es válido (dura 48 horas). Pedí uno nuevo.", false, 400);
  }

  try {
    await conectarConCodigo(code);
    return pagina("¡Listo! Mercado Pago conectado", "Ya podés cerrar esta pestaña. Los cobros del sitio van a entrar directo en tu cuenta.", true);
  } catch (error) {
    console.error("Error al conectar Mercado Pago por OAuth:", error);
    return pagina("No se pudo conectar", "Hubo un problema al guardar la conexión. Avisale a quien te pasó el link.", false, 500);
  }
}
