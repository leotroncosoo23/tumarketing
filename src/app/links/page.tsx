import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, TrendingUp } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { SERVICIOS_LANDING } from "@/lib/servicios-landing";
import { METRICAS_GLOBALES } from "@/lib/casos-exito";
import { PRECIO_LANZAMIENTO, PRECIO_LANZAMIENTO_ARS_TEXTO, VALOR_TOTAL } from "@/app/de-creador-a-dueno/precios";
import ContadorAnimado from "@/components/agencia/ContadorAnimado";

export const metadata: Metadata = {
  title: "tumarketing — Todos nuestros links",
  description: "Servicios, oferta y recursos gratuitos de TuMarketing.",
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

// Recursos gratuitos: los que tienen "archivo" se descargan directo desde /public;
// el resto es un lead magnet cargado desde el panel de admin (pide email).
const RECURSOS: { emoji: string; titulo: string; descripcion: string; link: string; archivo?: boolean }[] = [
  {
    emoji: "🎬",
    titulo: "20 Guiones Virales",
    descripcion: "Estructuras probadas para grabar reels que enganchan desde el segundo 1.",
    link: "/recursos/20-estructuras-de-guiones-virales",
  },
  {
    emoji: "📘",
    titulo: "Guía: Tu negocio en digital",
    descripcion: "Autodiagnóstico de 12 preguntas y plan de 30 días para saber por dónde empezar.",
    link: "/recursos/guia-tu-negocio-en-digital.pdf",
    archivo: true,
  },
];

function TituloGrupo({ numero, color, children }: { numero: number; color: string; children: React.ReactNode }) {
  return (
    <p style={{ color }} className="mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em]">
      <span
        style={{ background: color, boxShadow: `0 0 16px -2px ${color}` }}
        className="grid h-6 w-6 place-items-center rounded-full text-xs font-black text-black"
      >
        {numero}
      </span>
      {children}
    </p>
  );
}

// Link in bio de Instagram. Orden pedido: 1) Servicios 2) Oferta 3) Recursos gratuitos.
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
    whatsappLimpio ? `https://wa.me/${whatsappLimpio}?text=${encodeURIComponent(mensaje)}` : "/#agendar";

  const redes = [
    { href: "/newsletter", label: "Email", icono: <Mail className="h-4 w-4" />, externo: false },
    config?.tiktok_url && { href: config.tiktok_url, label: "TikTok", icono: <IconoTikTok className="h-4 w-4" />, externo: true },
    config?.instagram_url && { href: config.instagram_url, label: "Instagram", icono: <IconoInstagram className="h-4 w-4" />, externo: true },
    config?.youtube_url && { href: config.youtube_url, label: "YouTube", icono: <IconoYoutube className="h-4 w-4" />, externo: true },
  ].filter(Boolean) as { href: string; label: string; icono: React.ReactNode; externo: boolean }[];

  return (
    <main className="relative isolate flex min-h-screen justify-center overflow-hidden bg-black px-4 py-10 font-sans text-white sm:py-14">
      {/* Brillos de fondo en los colores de la marca y de cada servicio */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(520px_340px_at_50%_-80px,rgba(204,255,0,0.18),transparent_70%),radial-gradient(420px_360px_at_0%_38%,rgba(255,79,216,0.14),transparent_70%),radial-gradient(420px_360px_at_100%_48%,rgba(169,112,255,0.14),transparent_70%),radial-gradient(460px_360px_at_50%_100%,rgba(59,157,255,0.14),transparent_70%)]" />

      <div className="w-full max-w-md">
        {/* Perfil */}
        <div className="mb-2 flex flex-col items-center text-center">
          <Image
            src="/logo-mark.jpg"
            alt="tumarketing"
            width={92}
            height={92}
            className="mb-4 rounded-full border-2 border-[#ccff00] object-cover shadow-[0_0_0_6px_rgba(204,255,0,0.08),0_0_44px_-6px_#ccff00]"
          />
          <h1 className="text-2xl font-black tracking-tight">
            Tu<span className="text-[#ccff00]">Marketing</span>
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400">Hacemos que tu marca se vea, se escuche y venda.</p>

          <div className="mt-4 flex items-center gap-3">
            {redes.map((r) => (
              <a
                key={r.label}
                href={r.href}
                aria-label={r.label}
                {...(r.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#ccff00]/40 hover:text-[#ccff00]"
              >
                {r.icono}
              </a>
            ))}
          </div>

          <div className="mt-5 grid w-full grid-cols-4 gap-2">
            {METRICAS_GLOBALES.map((m) => (
              <div key={m.etiqueta} className="rounded-2xl border border-neutral-900 bg-neutral-950/70 px-1 py-2.5 text-center">
                <ContadorAnimado valor={m.valor} className="block text-lg font-black text-[#ccff00]" />
                <span className="mt-0.5 block text-[10.5px] leading-tight text-neutral-500">{m.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 1. SERVICIOS */}
        <div className="mt-8">
          <TituloGrupo numero={1} color="#ff4fd8">
            Nuestros servicios
          </TituloGrupo>
          <div className="grid gap-2.5">
            {SERVICIOS_LANDING.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={s.href}
                  style={{ "--acc": s.acento } as React.CSSProperties}
                  className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--acc)_40%,transparent)] bg-[linear-gradient(100deg,color-mix(in_srgb,var(--acc)_16%,#0d0d14),#0d0d14_70%)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--acc)] hover:shadow-[0_12px_34px_-16px_var(--acc)] after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-[linear-gradient(90deg,transparent,var(--acc),transparent)] after:bg-[length:200%_100%] after:animate-[tm-shimmer_3.2s_linear_infinite]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--acc)_45%,transparent)] bg-[color-mix(in_srgb,var(--acc)_18%,transparent)] text-[var(--acc)] shadow-[0_0_22px_-8px_var(--acc)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <small className="block text-[10.5px] font-black uppercase tracking-widest text-[var(--acc)]">{s.categoria}</small>
                    <b className="block font-bold">{s.nombre}</b>
                    <span className="block text-[13px] leading-snug text-neutral-400">{s.corto}</span>
                    {s.prueba && (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[var(--acc)]">
                        <TrendingUp className="h-3.5 w-3.5" /> {s.prueba.numero} · {s.prueba.etiqueta}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[var(--acc)] transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
            <Link
              href="/#agendar"
              className="rounded-2xl border border-dashed border-neutral-700 p-4 text-center text-sm font-semibold transition-all hover:border-[#ccff00] hover:shadow-[0_10px_30px_-16px_#ccff00]"
            >
              ¿No sabés cuál elegir? <b className="text-[#ccff00]">Agendá 15 min gratis →</b>
            </Link>
          </div>
        </div>

        {/* 2. OFERTA — borde de luz girando (la tarjeta no se anima, ver globals.css) */}
        <div className="mt-8">
          <TituloGrupo numero={2} color="#ccff00">
            Oferta
          </TituloGrupo>
          <div className="tm-glow-border rounded-3xl">
            <div className="rounded-3xl bg-[#0a0a0a] bg-[radial-gradient(420px_circle_at_50%_0%,rgba(204,255,0,0.14),transparent_70%)] px-6 py-7 text-center">
              <span className="mb-3.5 inline-block rounded-full bg-[#ccff00] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-black">
                🔥 Precio de lanzamiento
              </span>
              <h2 className="text-2xl font-black">De Creador/a a Dueño/a</h2>
              <p className="mt-2.5 text-[15px] text-neutral-400">
                El sistema completo + 4 bonos para transformar tu contenido en un activo que vende solo.
              </p>
              <p className="mt-3 flex items-baseline justify-center gap-2.5">
                <span className="text-lg font-bold text-neutral-500 line-through">USD {VALOR_TOTAL}</span>
                <span className="text-4xl font-black text-[#ccff00]">USD {PRECIO_LANZAMIENTO}</span>
              </p>
              <p className="mb-5 mt-1 text-sm text-neutral-300">o ${PRECIO_LANZAMIENTO_ARS_TEXTO} ARS con Mercado Pago</p>
              <Link
                href="/de-creador-a-dueno"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] py-4 text-lg font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(204,255,0,0.7)]"
              >
                Quiero el sistema <ArrowRight className="h-5 w-5" />
              </Link>
              <small className="mt-3 block text-xs text-neutral-500">Pago único · Sin mensualidades · Acceso inmediato</small>
            </div>
          </div>
        </div>

        {/* 3. RECURSOS GRATUITOS */}
        <div className="mt-8">
          <TituloGrupo numero={3} color="#3b9dff">
            Recursos gratuitos
          </TituloGrupo>
          <div className="grid gap-2.5">
            {RECURSOS.map((r) => {
              const claseTarjeta =
                "flex items-center gap-3.5 rounded-2xl border border-neutral-800 bg-neutral-950/85 p-4 transition-all hover:-translate-y-0.5 hover:border-[#3b9dff] hover:shadow-[0_10px_30px_-16px_#3b9dff]";
              const contenido = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#3b9dff]/35 bg-[#3b9dff]/15 text-xl">{r.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <b className="block font-bold">{r.titulo}</b>
                    <span className="block text-[13px] leading-snug text-neutral-400">{r.descripcion}</span>
                  </span>
                  <span className="shrink-0 rounded-lg bg-[#ccff00] px-3 py-1.5 text-xs font-black text-black">Gratis</span>
                </>
              );
              // Los PDF se abren en una pestaña nueva: el navegador de Instagram no siempre respeta "download".
              return r.archivo ? (
                <a key={r.titulo} href={r.link} target="_blank" rel="noopener noreferrer" className={claseTarjeta}>
                  {contenido}
                </a>
              ) : (
                <Link key={r.titulo} href={r.link} className={claseTarjeta}>
                  {contenido}
                </Link>
              );
            })}
          </div>
        </div>

        <a
          href={linkWhatsapp("¡Hola! Quiero trabajar con ustedes 🚀")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-700 py-4 font-bold transition-colors hover:border-white"
        >
          💬 Hablemos por WhatsApp
        </a>
        <Link
          href="/#portfolio"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-700 py-4 font-bold transition-colors hover:border-[#ccff00]"
        >
          Ver nuestros resultados reales ↗
        </Link>

        <p className="mt-8 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} tumarketing. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
