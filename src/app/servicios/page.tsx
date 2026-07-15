import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiciosGrid from "@/components/ServiciosGrid";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Servicio } from "@/lib/servicios";

const FAQS = [
  {
    pregunta: "¿Cómo es el proceso una vez que contrato un servicio?",
    respuesta:
      "Después de coordinar por WhatsApp, te enviamos un resumen del alcance y los tiempos de entrega. Trabajamos en etapas y te vamos mostrando avances antes de la entrega final.",
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta:
      "Transferencia bancaria, Mercado Pago y, para clientes del exterior, transferencia en dólares. Coordinamos el medio más cómodo para vos al confirmar el servicio.",
  },
  {
    pregunta: "¿Por qué puedo ver los precios en pesos y en dólares?",
    respuesta:
      "Trabajamos tanto con clientes de Argentina como del exterior. El botón de moneda te deja ver el precio en la que te resulte más clara, pero el valor final se coordina según tu ubicación.",
  },
  {
    pregunta: "¿Puedo pedir ajustes después de la entrega?",
    respuesta:
      "Sí, cada servicio incluye una ronda de ajustes sin costo adicional dentro de los primeros días posteriores a la entrega, para asegurarnos de que quede tal como lo necesitás.",
  },
  {
    pregunta: "¿Trabajan con clientes de otros países?",
    respuesta:
      "Sí, gran parte de nuestros clientes están fuera de Argentina. Todo el proceso se puede coordinar de forma remota, por WhatsApp, videollamada y email.",
  },
];

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
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            Servicios de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              Agencia
            </span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Potenciamos negocios digitales con estrategia, diseño y ejecución. Elegí el servicio que tu marca
            necesita para crecer.
          </p>
        </div>

        <ServiciosGrid servicios={servicios} />
      </section>

      {/* Preguntas Frecuentes */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Preguntas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              Frecuentes
            </span>
          </h2>
          <p className="text-neutral-400 text-lg">Todo lo que necesitás saber antes de contratar un servicio.</p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300"
            >
              <summary className="flex justify-between items-center gap-4 font-bold cursor-pointer list-none p-6 text-lg text-white">
                {faq.pregunta}
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-1">
                {faq.respuesta}
              </div>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
