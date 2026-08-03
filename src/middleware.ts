import { type NextRequest } from "next/server";
import { actualizarSesion } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  return await actualizarSesion(request);
}

export const config = {
  matcher: [
    // Corre en todo menos assets estáticos y de imagen: son los únicos casos
    // donde no hace falta gastar una llamada a Supabase Auth por request.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
