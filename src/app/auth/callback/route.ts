import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Canjea el "code" que manda Google (PKCE) por una sesión. Va server-side
// (Route Handler) a propósito: si esto fuera un componente cliente con
// useEffect, el StrictMode de React lo dispara dos veces en desarrollo y el
// código (de un solo uso) ya estaría consumido en el segundo intento.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const destinoSiguiente = next && next.startsWith("/") ? next : null;

  // Si el propio Google/Supabase ya volvió con un error (ej. bad_oauth_state),
  // no llega ni "code" — mostramos ese motivo en vez de rebotar en silencio.
  const errorProveedor = searchParams.get("error_description") || searchParams.get("error");
  if (!code) {
    const razon = errorProveedor ? `&razon=${encodeURIComponent(errorProveedor)}` : "";
    return NextResponse.redirect(`${origin}/login?error=oauth_sin_code${razon}`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth_exchange&razon=${encodeURIComponent(error.message)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=oauth_sin_user`);
  }

  const { data: perfil, error: errorPerfil } = await supabase
    .from("usuarios")
    .select("rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (errorPerfil) {
    return NextResponse.redirect(`${origin}/login?error=oauth_perfil&razon=${encodeURIComponent(errorPerfil.message)}`);
  }

  if (!perfil) {
    // Primera vez que entra: todavía no aceptó los términos, no tiene cuenta creada.
    return NextResponse.redirect(`${origin}/auth/bienvenida`);
  }

  if (!perfil.activo) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?revocado=1`);
  }

  return NextResponse.redirect(
    `${origin}${destinoSiguiente || (perfil.rol === "admin" || perfil.rol === "editor" ? "/admin" : "/usuarios")}`
  );
}
