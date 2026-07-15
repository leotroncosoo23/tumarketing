import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AREAS = [
  { icono: "🎯", titulo: "Estrategia" },
  { icono: "🎨", titulo: "Branding" },
  { icono: "💻", titulo: "Diseño Web" },
  { icono: "✍️", titulo: "Contenido" },
  { icono: "📢", titulo: "Publicidad" },
  { icono: "🎬", titulo: "Edición" },
];

// Resultados reales de clientes, tomados de nuestras historias destacadas de Instagram (@tumarketingar).
// Las imágenes van en /public/casos-exito/ — ver instrucciones de nombres de archivo.
const CASOS_EXITO = [
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

const SKILLS = [
  {
    icono: "💻",
    titulo: "Desarrollo Web de Alta Velocidad",
    subtitulo: "React / Next.js",
    descripcion: "Sitios rápidos, escalables y pensados para convertir visitas en clientes, no solo para verse bien.",
  },
  {
    icono: "📈",
    titulo: "Growth Marketing y Redes Sociales",
    subtitulo: "Estrategia + Contenido + Pauta",
    descripcion: "Contenido y campañas que convierten seguidores en resultados medibles, no solo en likes.",
  },
  {
    icono: "🤖",
    titulo: "Automatización de Procesos y Bases de Datos",
    subtitulo: "Sistemas y flujos de trabajo",
    descripcion: "Ordenamos tu negocio por detrás de escena: menos tareas manuales, más tiempo para crecer.",
  },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ccff00]/10 blur-[130px] rounded-full pointer-events-none" />

        <span className="relative inline-flex items-center gap-2 text-[#ccff00] font-bold tracking-widest uppercase mb-6 text-sm">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          Agencia de Crecimiento
        </span>

        <h1 className="relative text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.05]">
          No somos una agencia de redes.
          <br />
          Somos una agencia de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
            crecimiento
          </span>
          . 📈
        </h1>

        <p className="relative text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Somos una agencia de marketing y comunicación estratégica. Desarrollamos marcas desde su identidad
          hasta su posicionamiento digital: construimos desde la base — identidad, narrativa, presencia digital
          y sistema de conversión — para que tu negocio deje de improvisar y empiece a operar con dirección.
        </p>
      </section>

      {/* Misión / Cómo trabajamos */}
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-24">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm mb-4">Nuestra Misión</h2>
              <p className="text-white text-xl md:text-2xl font-bold leading-snug">
                No trabajamos para "mantener redes". Trabajamos para profesionalizar negocios, escalar su
                presencia y convertir visibilidad en resultados reales.
              </p>
            </div>
            <div>
              <h2 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm mb-4">Cómo trabajamos</h2>
              <p className="text-neutral-300 text-lg leading-relaxed">
                Diseñamos estrategias integrales que combinan contenido, publicidad, producción audiovisual y
                sistemas de crecimiento. Cada acción responde a un objetivo claro — nada se hace porque sí.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Éxito / Resultados */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-[#ccff00] font-bold tracking-widest uppercase mb-4 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            Casos de Éxito
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Resultados,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              no promesas
            </span>
          </h2>
          <p className="text-neutral-400 text-lg">Números reales de clientes reales. Nada de vanity metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASOS_EXITO.map((caso) => (
            <div
              key={caso.id}
              className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-neutral-800">
                <img src={caso.imagen} alt={caso.etiqueta} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/5 to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-3xl md:text-4xl font-black text-[#ccff00] mb-2 tracking-tight">{caso.numero}</p>
                <p className="text-white font-bold text-sm mb-3">{caso.etiqueta}</p>
                <p className="text-neutral-400 text-sm leading-relaxed">{caso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestras Skills */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Nuestro{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              Arsenal
            </span>
          </h2>
          <p className="text-neutral-400 text-lg">No hacemos "posteos" ni "páginas web": construimos ecosistemas digitales rentables.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILLS.map((skill) => (
            <div
              key={skill.titulo}
              className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{skill.icono}</span>
              <h3 className="text-lg font-bold text-white mb-1 leading-snug">{skill.titulo}</h3>
              <p className="text-[#ccff00] text-xs font-bold uppercase tracking-wider mb-3">{skill.subtitulo}</p>
              <p className="text-neutral-400 text-sm leading-relaxed">{skill.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Todo lo que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              hacemos
            </span>{" "}
            por tu marca
          </h2>
          <p className="text-neutral-400 text-lg">
            Seis áreas que cumplen una función dentro de algo más grande: tu crecimiento.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {AREAS.map((area) => (
            <div
              key={area.titulo}
              className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 text-center hover:border-[#ccff00]/50 hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{area.icono}</span>
              <h3 className="text-lg font-bold text-white">{area.titulo}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Frase de cierre */}
      <section className="max-w-3xl mx-auto px-6 pb-16 md:pb-24 text-center">
        <p className="text-2xl md:text-3xl font-black leading-snug">
          Porque el marketing no es estética.
          <br />
          Es <span className="text-[#ccff00]">decisión</span>.
          <br />
          Y nosotros decidimos crecer en serio.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20 md:pb-28 text-center">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ccff00]/10 blur-[100px] rounded-full pointer-events-none" />

          <h2 className="relative text-3xl md:text-4xl font-black mb-4">¿Listo para potenciar tu marca?</h2>
          <p className="relative text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            Trabajamos con marcas que quieren verse profesionales, pero sobre todo, funcionar como empresas
            reales. Conocé nuestros servicios o contanos qué necesitás.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/servicios"
              className="bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#b8e600] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(204,255,0,0.2)] w-full sm:w-auto"
            >
              Ver nuestros Servicios
            </Link>
            <Link
              href="/#contacto"
              className="px-8 py-4 rounded-full font-bold text-lg text-white border border-neutral-700 hover:bg-neutral-900 transition-colors w-full sm:w-auto"
            >
              Contactanos
            </Link>
          </div>

          <a
            href="https://www.instagram.com/tumarketingar/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block mt-8 text-neutral-500 hover:text-[#ccff00] text-sm font-medium transition-colors"
          >
            Seguinos en Instagram @tumarketingar →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
