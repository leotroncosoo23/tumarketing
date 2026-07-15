import AdminSidebar from "@/components/dashboard/AdminSidebar";
import ServiciosTab from "@/components/dashboard/ServiciosTab";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Servicio } from "@/lib/servicios";

export default async function AdminServiciosPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No pudimos cargar los servicios: " + error.message);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      <AdminSidebar activeId="servicios" />

      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <ServiciosTab servicios={(data as Servicio[]) || []} />
      </main>
    </div>
  );
}
