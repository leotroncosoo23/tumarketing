import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "tumarketing — Todos nuestros links",
  description: "Agencia de Marketing Digital. Potenciamos tu negocio.",
};

// Esta versión de lucide-react sacó los íconos de marca (Instagram, YouTube,
// TikTok) por temas de trademark — se dibujan a mano acá, con el mismo estilo
// de trazo (stroke, no fill) que "Mail" para que la fila quede pareja.
function IconoTikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.13-1.36V15.4a4.6 4.6 0 1 1-3.98-4.55v2.4a2.2 2.2 0 1 0 1.58 2.11V2h2.4a4.28 4.28 0 0 0 3.13 4.13v-.3Z" />
    </svg>
  );
}

function IconoInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconoYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default async function LinksPage() {
  const supabase = await createSupabaseServerClient();
  const { data: config } = await supabase
    .from("configuracion")
    .select("whatsapp_numero, instagram_url, tiktok_url, youtube_url")
    .eq("id", 1)
    .maybeSingle();

  const whatsappLimpio = (config?.whatsapp_numero || "").replace(/\D/g, "");

  // Cada link de WhatsApp lleva un mensaje distinto ya escrito según de dónde
  // vino el clic, para que el equipo sepa de entrada qué le interesó al lead
  // sin tener que preguntar — arranca la conversación más cerca de la venta.
  const linkWhatsapp = (mensaje: string) =>
    whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${encodeURIComponent(mensaje)}` : "/servicios#contacto";

  const leadMagnets = [
    {
      emoji: "🎬",
      titulo: "20 Guiones Virales",
      descripcion: "Estructuras probadas para grabar reels que enganchan desde el segundo 1.",
      link: "/recursos/20-estructuras-de-guiones-virales",
    },
    {
      emoji: "📘",
      titulo: "Mini Kit de Contenido Estratégico",
      descripcion: "La base para crear contenido que atrae clientes y prepara la venta.",
      link: "/recursos/mini-kit-de-contenido-estrat-gico",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans flex justify-center px-4 py-10 sm:py-16">
      {/* Halo de fondo: la misma atmósfera lima que ya usamos en /servicios,
          para que esta página se sienta parte del mismo sitio y no un
          template genérico de link-in-bio pegado con cinta. */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4EE26]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#D4EE26]/[0.08] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Perfil */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-[#ccff00] blur-xl opacity-30" />
            <Image
              src="/logo-mark.jpg"
              alt="tumarketing"
              width={88}
              height={88}
              className="relative rounded-full border-2 border-[#ccff00]/40 object-cover"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight">tumarketing</h1>
          <p className="text-neutral-400 text-sm mt-1.5 max-w-xs">
            Agencia de Marketing Digital. Potenciamos tu negocio 🚀
          </p>

          <div className="flex items-center gap-3 mt-5">
            <a
              href="/newsletter"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            {config?.tiktok_url && (
              <a
                href={config.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors"
              >
                <IconoTikTok className="w-4 h-4" />
              </a>
            )}
            {config?.instagram_url && (
              <a
                href={config.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors"
              >
                <IconoInstagram className="w-4 h-4" />
              </a>
            )}
            {config?.youtube_url && (
              <a
                href={config.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#ccff00] hover:border-[#ccff00]/40 transition-colors"
              >
                <IconoYoutube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Oferta principal */}
        <Link
          href="/de-creador-a-dueno"
          className="group block bg-[#ccff00] text-black rounded-2xl p-5 mb-4 shadow-[0_0_30px_rgba(204,255,0,0.25)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] hover:-translate-y-0.5 transition-all"
        >
          <p className="text-xs font-black uppercase tracking-wide mb-1">🔥 Oferta por tiempo limitado</p>
          <p className="text-lg font-black leading-snug">40% OFF — De creador/a a Dueño/a</p>
          <p className="text-sm font-bold flex items-center gap-1.5 mt-1">
            Acceso inmediato
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        {/* Lead magnets */}
        <div className="mb-2 mt-8">
          <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]">Recursos gratis</p>
          <h2 className="text-lg font-black">Llevate esto sin costo</h2>
        </div>
        <div className="flex flex-col gap-3 mb-8">
          {leadMagnets.map((item) => (
            <div
              key={item.titulo}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 hover:border-[#ccff00]/30 transition-colors"
            >
              <span className="w-12 h-12 shrink-0 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-2xl">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm leading-snug">{item.titulo}</p>
                <p className="text-neutral-500 text-xs mt-0.5 leading-snug">{item.descripcion}</p>
              </div>
              <Link
                href={item.link}
                className="shrink-0 bg-[#ccff00] text-black text-xs font-black px-3.5 py-2 rounded-lg hover:bg-[#b8e600] transition-colors whitespace-nowrap"
              >
                Gratis
              </Link>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <a
          href={linkWhatsapp("¡Hola! Quiero trabajar con ustedes 🚀")}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-black text-base py-4 rounded-2xl hover:bg-neutral-200 transition-colors mb-3"
        >
          💬 Hablemos por WhatsApp
        </a>

        {/* Web oficial */}
        <Link
          href="/servicios"
          className="w-full flex items-center justify-center gap-2 border-2 border-[#ccff00] text-[#ccff00] font-black text-base py-4 rounded-2xl hover:bg-[#ccff00]/10 transition-colors"
        >
          Descubrí nuestros servicios Premium
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-center text-neutral-600 text-xs mt-8">
          © {new Date().getFullYear()} tumarketing. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
