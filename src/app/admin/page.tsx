import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientesConResumen, getProyectosResumen, getConversaciones } from "@/lib/dashboard-queries";
import AdminShell, { type InitialAdminData } from "@/components/dashboard/AdminShell";
import "./admin.css";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [clientes, proyectos, conversaciones, { data: servicios }, { data: cupones }, { data: blogs }, { data: perfil }] =
    await Promise.all([
      getClientesConResumen(supabase),
      getProyectosResumen(supabase),
      getConversaciones(supabase),
      supabase.from("servicios").select("*").order("created_at", { ascending: false }),
      supabase.from("cupones").select("*").order("creado_en", { ascending: false }),
      supabase.from("blogs").select("*").order("creado_en", { ascending: false }),
      supabase.from("usuarios").select("nombre, email, rol").eq("id", user!.id).maybeSingle(),
    ]);

  const initial: InitialAdminData = {
    clientes,
    proyectos,
    conversaciones,
    servicios: servicios || [],
    cupones: cupones || [],
    blogs: blogs || [],
  };

  const usuario = {
    nombre: perfil?.nombre || perfil?.email || "Admin",
    rol: perfil?.rol || "admin",
  };

  return <AdminShell initial={initial} usuario={usuario} />;
}
