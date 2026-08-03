import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContratarServicioButton from "@/components/ContratarServicioButton";
import DespuesDeComprar from "@/components/servicios/DespuesDeComprar";
import { iconoBeneficio } from "@/lib/beneficioIconos";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Servicio } from "@/lib/servicios";

export default async function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: servicioData }, { data: config }] = await Promise.all([
    supabase.from("servicios").select("*").eq("id", id).ilike("estado", "activo").maybeSingle(),
    supabase.from("configuracion").select("whatsapp_numero").eq("id", 1).maybeSingle(),
  ]);

  const servicio = servicioData as Servicio | null;
  const whatsappLimpio = (config?.whatsapp_numero || "").replace(/\D/g, "");

  if (!servicio) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">No encontramos este servicio</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
          >
            ← Volver a Servicios
          </Link>
        </div>
      </main>
    );
  }

  const caracteristicas = Array.isArray(servicio.caracteristicas) ? servicio.caracteristicas : [];
  const beneficios = Array.isArray(servicio.beneficios) ? servicio.beneficios : [];
  const esMensual = servicio.tipo_pago === "mensual";

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white font-sans pt-28">
      {/* Ojo: acá NO va overflow-x-hidden — cualquier overflow (hidden/auto/scroll)
          en un ancestro del sidebar rompe position:sticky en todos los navegadores.
          Los círculos de fondo ya se clippean solos con el overflow-hidden del div
          de abajo, así que no hace falta repetirlo acá arriba. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4EE26]/10 blur-[160px] rounded-full" />
        <div className="absolute top-[60%] -right-40 w-[550px] h-[550px] bg-[#D4EE26]/[0.06] blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
        <Link
          href="/servicios"
          className="text-neutral-400 hover:text-white mb-10 flex items-center gap-2 text-sm font-bold transition-colors w-fit"
        >
          ← Volver a Servicios
        </Link>

        {/* El encabezado va DENTRO de la columna izquierda del grid (no a todo
            el ancho arriba) para que la caja de precio arranque a la misma
            altura que el título, visible desde el primer vistazo, en vez de
            quedar varias pantallas más abajo esperando a que se scrollee
            todo el bloque de arriba. La columna sigue teniendo de sobra
            para respirar en monitores grandes (1fr de hasta 1600px). */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-x-16 gap-y-12 items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {servicio.categorias?.map((c) => (
                <span
                  key={c}
                  className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                >
                  {c}
                </span>
              ))}
              {servicio.destacado && (
                <span className="bg-gradient-to-r from-[#ccff00] to-lime-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  ⭐ Destacado
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-[0.95] tracking-tight">
              {servicio.titulo}
            </h1>

            {servicio.tagline && (
              <p className="text-[#ccff00] font-black text-xl md:text-2xl mb-6">{servicio.tagline}</p>
            )}

            {servicio.descripcion_detallada && (
              <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap mb-14">
                {servicio.descripcion_detallada}
              </p>
            )}

            {beneficios.length > 0 && (
              <div className="mb-14">
                <h2 className="text-3xl font-black mb-7">Lo que ganás</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {beneficios.map((beneficio, indice) => {
                    const Icono = iconoBeneficio(beneficio.icono);
                    return (
                      <div
                        key={indice}
                        className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 hover:border-[#ccff00]/30 hover:-translate-y-1 transition-all duration-300"
                      >
                        <Icono className="w-6 h-6 text-[#ccff00] mb-4" strokeWidth={1.75} />
                        <h3 className="font-bold text-white mb-2 leading-snug">{beneficio.titulo}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">{beneficio.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {caracteristicas.length > 0 && (
              <div className="mb-14">
                <h2 className="text-3xl font-black mb-7">Qué incluye</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {caracteristicas.map((item, indice) => (
                    <li
                      key={indice}
                      className="flex items-start gap-3 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-5 h-5 shrink-0 text-[#ccff00] mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span className="text-neutral-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* "Después de comprar" y el cierre con WhatsApp viven ACÁ adentro
                (columna izquierda del grid) a propósito: el sticky del precio
                solo puede despegarse mientras dure la fila del grid, y si esta
                columna terminara justo con "Qué incluye" (corto en servicios
                sin beneficios cargados aún), el precio nunca tendría margen
                para notarse pegado. Metiendo más contenido acá, el sticky
                siempre tiene recorrido real sin importar cuántos beneficios
                o características tenga cada servicio en particular. */}
            <DespuesDeComprar />

            <div className="mt-14 pt-10 border-t border-neutral-900 text-center">
              <p className="text-neutral-400 mb-4">¿Todavía tenés dudas antes de decidir?</p>
              {whatsappLimpio ? (
                <a
                  href={`https://wa.me/${whatsappLimpio}?text=${encodeURIComponent(
                    `¡Hola! Tengo una duda sobre "${servicio.titulo}" antes de contratarlo 🙋`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 text-white px-6 py-3 rounded-full font-bold transition-colors"
                >
                  💬 Hablanos por WhatsApp
                </a>
              ) : (
                <Link
                  href="/#contacto"
                  className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 text-white px-6 py-3 rounded-full font-bold transition-colors"
                >
                  💬 Contactanos
                </Link>
              )}
            </div>
          </div>

          {/* Panel de precio: sticky para que acompañe mientras se lee el
              contenido de la izquierda, pero sin quedar "flotando" sobre el
              header fijo (top-28 deja el espacio del Navbar). */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <p className="text-white font-black text-4xl">
                    ${Number(servicio.precio_ars || 0).toLocaleString("es-AR")}
                  </p>
                  <span className="text-neutral-500 text-xs">ARS · {esMensual ? "por mes" : "pago único"}</span>
                </div>

                <ContratarServicioButton servicio={servicio} />

                <p className="text-neutral-500 text-xs text-center mt-3">
                  🔒 Pago 100% seguro · {esMensual ? "cancelás cuando quieras" : "entrega garantizada"}
                </p>

                <div className="border-t border-neutral-800 mt-6 pt-6 space-y-3 text-sm">
                  {(servicio.categorias?.length ?? 0) > 0 && (
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Categoría</span>
                      <span className="text-white font-bold text-right">{servicio.categorias.join(", ")}</span>
                    </div>
                  )}
                  {servicio.tiempo_entrega && (
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Entrega</span>
                      <span className="text-white font-bold">{servicio.tiempo_entrega}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-neutral-800 bg-neutral-900/40 px-6 py-4">
                <p className="text-neutral-500 text-xs text-center leading-relaxed">
                  Cupos limitados por mes para garantizar calidad de entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
