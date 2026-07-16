import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiciosCatalogo from "@/components/servicios/ServiciosCatalogo";
import ElProceso from "@/components/servicios/ElProceso";
import FAQAcordeon from "@/components/servicios/FAQAcordeon";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Servicio } from "@/lib/servicios";

export default async function ServiciosPage() {
  const supabase = await createSupabaseServerClient();

  // ilike (en vez de eq) para que no importe si "estado" quedó guardado como
  // "Activo", "activo" o "ACTIVO" — comparación case-insensitive.
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .ilike("estado", "activo")
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar servicios:", error.message);
  }

  const servicios = (data as Servicio[]) || [];

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden pt-28">
      {/* Atmósfera de fondo compartida por toda la página: reemplaza los bloques de color
          planos por sección (lo que hacía que se viera "cortada") por un único degradado
          continuo de resplandores flúor que atraviesa todas las secciones. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4EE26]/10 blur-[160px] rounded-full" />
        <div className="absolute top-[55%] -left-40 w-[500px] h-[500px] bg-[#D4EE26]/[0.06] blur-[150px] rounded-full" />
        <div className="absolute top-[85%] -right-40 w-[550px] h-[550px] bg-[#D4EE26]/[0.07] blur-[150px] rounded-full" />
        <div className="absolute top-[130%] left-1/3 w-[500px] h-[500px] bg-[#D4EE26]/[0.05] blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <div className="relative z-10">
        <ServiciosCatalogo servicios={servicios} />

        <ElProceso />

        {/* Preguntas Frecuentes */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Preguntas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4EE26] to-lime-500">
                Frecuentes
              </span>
            </h2>
            <p className="text-neutral-400 text-lg">Todo lo que necesitás saber antes de contratar un servicio.</p>
          </div>

          <FAQAcordeon />
        </section>
      </div>

      <Footer />
    </main>
  );
}
