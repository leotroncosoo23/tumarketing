import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const REMITENTE = process.env.RESEND_REMITENTE || "TuMarketing <onboarding@resend.dev>";

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function armarHtml(mensaje: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <div style="white-space: pre-wrap; line-height: 1.6;">${mensaje}</div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { asunto, mensaje } = await req.json();

    if (!asunto?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: "Faltan el asunto o el mensaje." },
        { status: 400 }
      );
    }

    // Traemos solo suscriptores activos (los que se anotaron para recibir novedades)
    const { data: suscriptores, error: errorSuscriptores } = await supabase
      .from("suscriptores")
      .select("email")
      .eq("activo", true);

    if (errorSuscriptores) {
      return NextResponse.json({ error: errorSuscriptores.message }, { status: 500 });
    }

    const destinatarios = (suscriptores || []).filter((s) => !!s.email);

    if (destinatarios.length === 0) {
      return NextResponse.json(
        { error: "No hay suscriptores activos con email para enviar." },
        { status: 400 }
      );
    }

    // Resend permite mandar hasta 100 emails por llamada de batch.
    // Cada uno se manda individualmente (nadie ve el email de los demás).
    const lotes = chunk(destinatarios, 100);
    let enviados = 0;
    const errores: string[] = [];

    for (const lote of lotes) {
      const emails = lote.map((d) => ({
        from: REMITENTE,
        to: d.email as string,
        subject: asunto,
        html: armarHtml(mensaje),
      }));

      const { error: errorEnvio } = await resend.batch.send(emails);

      if (errorEnvio) {
        console.error("Error en lote de envío:", errorEnvio);
        errores.push(errorEnvio.message || JSON.stringify(errorEnvio));
      } else {
        enviados += lote.length;
      }
    }

    // Guardamos el registro del envío para el historial
    await supabase.from("comunicados").insert([
      { asunto, mensaje, cantidad_destinatarios: enviados },
    ]);

    if (errores.length > 0 && enviados === 0) {
      return NextResponse.json(
        { error: `Resend rechazó el envío: ${errores[0]}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      enviados,
      total: destinatarios.length,
      ...(errores.length > 0 && { avisos: errores }),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error inesperado en el servidor." },
      { status: 500 }
    );
  }
}