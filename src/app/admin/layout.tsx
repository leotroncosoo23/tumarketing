import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// El panel se puede instalar en el celular como una app ("Agregar a pantalla de inicio").
export const metadata: Metadata = {
  title: "Panel · Tu Marketing",
  manifest: "/admin.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "TuMarketing", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
  // En Android, el teclado achica la pantalla (como WhatsApp) en vez de tapar el chat.
  interactiveWidget: "resizes-content",
};

// Protege todo lo que esté bajo /admin: sin sesión -> /login,
// cuenta desactivada -> /login, logueado pero no admin -> /usuarios.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("usuarios")
    .select("rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil || !perfil.activo) {
    await supabase.auth.signOut();
    redirect("/login?revocado=1");
  }

  if (perfil.rol !== "admin" && perfil.rol !== "editor") {
    redirect("/usuarios");
  }

  return <>{children}</>;
}
