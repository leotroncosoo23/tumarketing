import Link from "next/link";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import ServicioForm from "@/components/dashboard/ServicioForm";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { actualizarServicio } from "@/lib/servicios-actions";
import type { NuevoServicioPayload, Servicio } from "@/lib/servicios";

export default async function EditarServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.from("servicios").select("*").eq("id", id).maybeSingle();
  const servicio = data as Servicio | null;

  if (!servicio) {
    notFound();
  }

  // Server Action "atada" a este id, definida acá para no tener que pasarlo
  // a mano desde el Client Component.
  async function guardarCambios(payload: NuevoServicioPayload) {
    "use server";
    return actualizarServicio(id, payload);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      <AdminSidebar activeId="servicios" />

      <main className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full overflow-y-auto">
        <div className="mb-8">
          <Link
            href="/admin/servicios"
            className="text-neutral-400 hover:text-white text-sm font-bold flex items-center gap-2 mb-4 transition-colors w-fit"
          >
            ← Volver a Servicios
          </Link>
          <h1 className="text-3xl font-black">Editar Servicio</h1>
          <p className="text-neutral-400 text-sm">Actualizá la ficha de "{servicio.titulo}".</p>
        </div>

        <ServicioForm servicioInicial={servicio} onGuardar={guardarCambios} />
      </main>
    </div>
  );
}
