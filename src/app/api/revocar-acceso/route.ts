import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." },
        { status: 500 }
      );
    }

    // Este cliente usa la service_role key: SOLO puede usarse acá (servidor),
    // nunca en un componente "use client". Se crea recién al entrar la request
    // para que la ausencia de la variable no rompa el build de todo el sitio.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { usuarioId, activar } = await req.json();

    if (!usuarioId || typeof activar !== "boolean") {
      return NextResponse.json(
        { error: "Faltan datos: usuarioId y activar (true/false) son requeridos." },
        { status: 400 }
      );
    }

    // 1. Actualizamos el perfil: esto bloquea el acceso al CONTENIDO del curso
    const { error: errorPerfil } = await supabaseAdmin
      .from("usuarios")
      .update({ activo: activar })
      .eq("id", usuarioId);

    if (errorPerfil) {
      return NextResponse.json({ error: errorPerfil.message }, { status: 500 });
    }

    // 2. Bloqueamos/desbloqueamos el LOGIN real en Supabase Auth
    const { error: errorAuth } = await supabaseAdmin.auth.admin.updateUserById(
      usuarioId,
      { ban_duration: activar ? "none" : "876000h" } // "none" desbanea, ~100 años = baneo indefinido
    );

    if (errorAuth) {
      return NextResponse.json({ error: errorAuth.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error inesperado en el servidor.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}