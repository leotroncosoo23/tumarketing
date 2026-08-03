import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Patrón oficial de Supabase para Next.js App Router: sin esto, el token de
// acceso puede vencer mientras el usuario está afuera del sitio (ej: pagando
// en Mercado Pago) y nada lo refresca antes de que vuelva, dejándolo
// "deslogueado" aunque su sesión debería seguir siendo válida.
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
        },
      },
    }
  );

  // No sacar esta línea: es la que dispara el refresh del token contra
  // Supabase Auth y persiste la sesión renovada en las cookies de respuesta.
  await supabase.auth.getUser();

  return respuesta;
}
