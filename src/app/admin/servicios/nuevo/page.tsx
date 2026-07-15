import Link from "next/link";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import ServicioForm from "@/components/dashboard/ServicioForm";
import { crearServicio } from "@/lib/servicios-actions";

export default function NuevoServicioPage() {
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
          <h1 className="text-3xl font-black">Nuevo Servicio</h1>
          <p className="text-neutral-400 text-sm">Completá la ficha para publicar un nuevo servicio profesional.</p>
        </div>

        <ServicioForm onGuardar={crearServicio} />
      </main>
    </div>
  );
}
