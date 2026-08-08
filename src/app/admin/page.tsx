import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientesConResumen, getProyectosResumen, getConversaciones, getFacturacionMensual } from "@/lib/dashboard-queries";
import AdminShell, { type InitialAdminData } from "@/components/dashboard/AdminShell";
import type { Recurso } from "@/components/dashboard/sections/RecursosSection";
import "./admin.css";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    clientes,
    proyectos,
    conversaciones,
    facturacionMensual,
    { data: servicios },
    { data: cupones },
    { data: blogs },
    { data: recursosData },
    { data: perfil },
  ] = await Promise.all([
    getClientesConResumen(supabase),
    getProyectosResumen(supabase),
    getConversaciones(supabase),
    getFacturacionMensual(supabase),
    supabase.from("servicios").select("*").order("created_at", { ascending: false }),
    supabase.from("cupones").select("*").order("creado_en", { ascending: false }),
    supabase.from("blogs").select("*").order("creado_en", { ascending: false }),
    supabase.from("recursos").select("*, recursos_descargas(count)").order("creado_en", { ascending: false }),
    supabase.from("usuarios").select("nombre, email, rol").eq("id", user!.id).maybeSingle(),
  ]);

  const recursos: Recurso[] = (
    (recursosData as unknown as (Recurso & { recursos_descargas?: { count: number }[] })[]) || []
  ).map((r) => ({
    ...r,
    descargas: r.recursos_descargas?.[0]?.count ?? 0,
  }));

  const initial: InitialAdminData = {
    clientes,
    proyectos,
    conversaciones,
    servicios: servicios || [],
    cupones: cupones || [],
    blogs: blogs || [],
    recursos,
    facturacionMensual,
  };

  const usuario = {
    nombre: perfil?.nombre || perfil?.email || "Admin",
    rol: perfil?.rol || "admin",
  };

  return <AdminShell initial={initial} usuario={usuario} />;
}
