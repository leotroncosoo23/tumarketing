import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Protege todo lo que esté bajo /admin: sin sesión -> /login,
// cuenta desactivada -> /login, logueado pero no admin -> /alumnos.
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

  if (perfil.rol !== "admin") {
    redirect("/alumnos");
  }

  return <>{children}</>;
}
