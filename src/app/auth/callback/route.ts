import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Canjea el "code" que manda Google (PKCE) por una sesión. Va server-side
// (Route Handler) a propósito: si esto fuera un componente cliente con
// useEffect, el StrictMode de React lo dispara dos veces en desarrollo y el
// código (de un solo uso) ya estaría consumido en el segundo intento.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: perfil, error: errorPerfil } = await supabase
    .from("usuarios")
    .select("rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (errorPerfil) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (!perfil) {
    // Primera vez que entra: todavía no aceptó los términos, no tiene cuenta creada.
    return NextResponse.redirect(`${origin}/auth/bienvenida`);
  }

  if (!perfil.activo) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?revocado=1`);
  }

  return NextResponse.redirect(`${origin}${perfil.rol === "admin" ? "/admin/dashboard" : "/alumnos"}`);
}
