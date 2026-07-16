import Image from "next/image";
import { Star } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";

// Mismas métricas reales que ya se muestran en el Hero de la home (src/app/page.tsx).
const METRICAS = [
  { valor: "+4M", etiqueta: "views generadas" },
  { valor: "+150", etiqueta: "marcas atendidas" },
  { valor: "360°", etiqueta: "soluciones digitales" },
];

// Mismos casos de éxito reales que ya se muestran en /nosotros (src/app/nosotros/page.tsx):
// foto real, métrica real y descripción real — no son citas textuales atribuidas a un
// cliente puntual, así que no se presentan como testimonios en primera persona.
const RESULTADOS = [
  {
    id: "alojamiento",
    imagen: "/casos-exito/caso-1-alojamiento.jpg",
    numero: "+1M",
    etiqueta: "vistas en un solo reel",
    descripcion: "2.616 likes, 368 veces compartido y +1.855 seguidores nuevos para un cliente de alojamiento turístico — todo orgánico, sin pauta paga.",
  },
  {
    id: "calzado",
    imagen: "/casos-exito/caso-2-calzado.jpg",
    numero: "+10.000",
    etiqueta: "seguidores en 6 meses",
    descripcion: "Una marca de calzado pasó de 500 a más de 10.000 seguidores reales, con una identidad de marca completamente renovada.",
  },
  {
    id: "camping",
    imagen: "/casos-exito/caso-3-camping.jpg",
    numero: "+488%",
    etiqueta: "cuentas alcanzadas",
    descripcion: "Un emprendimiento de turismo y camping multiplicó su alcance mes a mes, sumando seguidores y visitas reales a su perfil.",
  },
];

export default function AutoridadConfianza() {
  return (
    <section id="resultados" className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
      <FadeInScroll className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 text-[#ccff00] font-bold tracking-widest uppercase mb-4 text-sm">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          Autoridad &amp; Confianza
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
          Resultados que hablan por{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
            nosotros
          </span>
        </h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          Números reales de clientes reales. Nada de vanity metrics.
        </p>
      </FadeInScroll>

      {/* Métricas de impacto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {METRICAS.map((metrica, i) => (
          <FadeInScroll key={metrica.etiqueta} delay={0.1 + i * 0.15}>
            <div className="text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl py-10 px-6">
              <p className="text-5xl md:text-6xl font-black text-[#ccff00] mb-2 tracking-tight">{metrica.valor}</p>
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">{metrica.etiqueta}</p>
            </div>
          </FadeInScroll>
        ))}
      </div>

      {/* Resultados reales, con foto y métrica de cada caso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESULTADOS.map((resultado, i) => (
          <FadeInScroll key={resultado.id} delay={0.1 + i * 0.15}>
            <div className="h-full bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-[#ccff00]/50 transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden bg-neutral-800">
                <Image
                  src={resultado.imagen}
                  alt={resultado.etiqueta}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-0.5 mb-3 text-[#ccff00]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-2xl font-black text-white mb-1 tracking-tight">{resultado.numero}</p>
                <p className="text-[#ccff00] text-xs font-bold uppercase tracking-wider mb-3">{resultado.etiqueta}</p>
                <p className="text-neutral-400 text-sm leading-relaxed flex-grow">{resultado.descripcion}</p>
              </div>
            </div>
          </FadeInScroll>
        ))}
      </div>
    </section>
  );
}
