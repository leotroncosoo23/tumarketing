import Link from "next/link";
import { Users, Target, PenTool, Code2, ArrowRight } from "lucide-react";
import FadeInScroll from "@/components/FadeInScroll";

type ServicioDestacado = {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  href: string;
};

const SERVICIOS: ServicioDestacado[] = [
  {
    icono: <Users className="w-6 h-6" />,
    titulo: "Gestión Integral de Redes",
    descripcion: "Convertimos tu perfil en una máquina de generar confianza y ventas, sin que tengas que ocuparte de publicar todos los días.",
    href: "/servicios",
  },
  {
    icono: <Target className="w-6 h-6" />,
    titulo: "Publicidad Digital",
    descripcion: "Encontramos a tus clientes ideales antes que tu competencia y convertimos cada peso invertido en resultados medibles.",
    href: "/servicios",
  },
  {
    icono: <PenTool className="w-6 h-6" />,
    titulo: "Creación de Contenido",
    descripcion: "Piezas visuales que detienen el scroll y comunican por qué tu marca es la mejor opción, no solo que existe.",
    href: "/servicios",
  },
  {
    icono: <Code2 className="w-6 h-6" />,
    titulo: "Desarrollo Web",
    descripcion: "Un sitio que vende mientras dormís: rápido, profesional y diseñado para convertir visitas en clientes.",
    href: "/desarrollo-software#soluciones",
  },
];

export default function NuestrosServicios() {
  return (
    <section id="servicios" className="max-w-7xl mx-auto px-6 py-24">
      <FadeInScroll y={30} className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
          El impulso que tu marca{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
            necesita
          </span>
        </h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          Estrategias a medida que convierten seguidores en clientes reales.
        </p>
      </FadeInScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICIOS.map((servicio, i) => (
          <FadeInScroll key={servicio.titulo} y={30} delay={0.2 + i * 0.15}>
            <article className="h-full flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-2xl p-7 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/40 hover:border-[#ccff00]/50 transition-all duration-300 ease-in-out">
              <div className="w-12 h-12 rounded-full bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center mb-5">
                {servicio.icono}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-snug">{servicio.titulo}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">{servicio.descripcion}</p>
              <Link
                href={servicio.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-[#ccff00] transition-colors w-fit"
              >
                Saber más <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          </FadeInScroll>
        ))}
      </div>
    </section>
  );
}
