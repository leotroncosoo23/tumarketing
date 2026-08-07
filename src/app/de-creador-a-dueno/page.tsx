import type { Metadata } from "next";
import Image from "next/image";
import { Space_Grotesk, Inter } from "next/font/google";
import { CheckCircle2, CircleAlert, ArrowRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Accordion, type AccordionItem } from "@/components/dashboard/ui";
import ContadorLanzamiento from "./ContadorLanzamiento";
import "@/app/admin/admin.css";

const fontDisplay = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "De Creador/a a Dueño/a — tumarketing",
  description: "Dejá de improvisar en redes. El sistema simple para ordenar tu contenido y empezar a vender desde hoy.",
};

const DOLORES = [
  "Publicás todos los días… y no tenés idea de si sirve de algo",
  "Tenés mil ideas dando vueltas en la cabeza, y ninguna ordenada",
  "Creás contenido sin parar, pero las ventas no aparecen",
  "Te paraliza tener que vender por DM o WhatsApp",
];

const BENEFICIOS = [
  "Saber exactamente qué publicar y por qué — se terminó el improvisar",
  "Tener tu contenido y tus historias ordenados en un solo lugar",
  "Crear desde estrategia, no desde la ansiedad del momento",
  "Construir confianza real con tu audiencia, publicación tras publicación",
  "Transformar cada contenido en mensajes… y esos mensajes en ventas",
  "Cerrar por DM o WhatsApp sin sentir que estás rogando",
];

const MODULOS = [
  {
    titulo: "Estrategia de contenido clara y accionable",
    descripcion: "Vas a saber qué publicar, para qué y con qué objetivo — sin depender de tendencias ni copiar a nadie.",
  },
  {
    titulo: "Sistema de historias que atrae, conecta y vende",
    descripcion: "Secuencias listas para generar confianza, tumbar objeciones y llevar a la venta sin sonar invasivo.",
  },
  {
    titulo: "Estructura de contenido estratégico y viral",
    descripcion: "La combinación exacta de alcance, conexión y ventas, incluso si hoy sentís que nadie te responde.",
  },
  {
    titulo: "Calendario de contenido ordenado y ejecutable",
    descripcion: "Vas a saber exactamente qué publicar cada día, sin perder ni un minuto más pensando qué hacer.",
  },
  {
    titulo: "Guía de mentalidad y organización de dueño de negocio",
    descripcion: "Dejá de actuar como creador improvisado y empezá a tomar decisiones como quien construye un negocio.",
  },
  {
    titulo: "Optimización de perfil orientada a clientes",
    descripcion: "Qué mostrar, qué decir y cómo presentarte para que quien entre entienda al toque qué vendés y por qué elegirte a vos.",
  },
];

const BONOS = [
  {
    numero: "01",
    titulo: "Guía de métricas",
    descripcion: "Dejá de publicar a ciegas: aprendé a leer tus números y saber exactamente qué está funcionando.",
    imagen: "/promptlistos.webp",
  },
  {
    numero: "02",
    titulo: "Optimización de perfil nivel PRO",
    descripcion: "Todo lo que necesitás para que, apenas alguien entre a tu perfil, quiera comprarte.",
    imagen: "/optimizacion-de-perfil.webp",
  },
  {
    numero: "03",
    titulo: "Cierre de ventas por mensaje",
    descripcion: "La próxima vez que te escriban, vas a saber exactamente qué responder para cerrar la venta.",
    imagen: "/cerrar-ventas.webp",
  },
  {
    numero: "04",
    titulo: 'Ebook "Pensar como dueño/a de Negocio"',
    descripcion: "Una mirada más profunda sobre mentalidad, decisiones y estructura para escalar y empezar a delegar.",
    imagen: "/pensa-como-dueño.webp",
  },
];

const ES_PARA_VOS = [
  "Emprendés o vendés productos o servicios",
  "Querés orden, claridad y resultados — no otro curso más en la lista",
  "Querés usar tus redes para vender, no solo para mostrar",
];

const FAQ: AccordionItem[] = [
  {
    q: "¿Necesito experiencia en marketing?",
    a: "Cero. El sistema está pensado para que lo apliques aunque nunca hayas estudiado marketing: seguís los pasos, usás las plantillas ya armadas, y avanzás.",
  },
  {
    q: "¿Sirve para cualquier rubro?",
    a: "Sí. Funciona para cualquier negocio que venda productos o servicios y quiera usar sus redes para vender de verdad, no solo para mostrar.",
  },
  {
    q: "¿Cuánto tiempo tengo que dedicarle?",
    a: "El que vos quieras. Podés avanzar a tu ritmo: en pocas horas ya vas a tener tu contenido ordenado.",
  },
  {
    q: "¿Es teoría o práctica?",
    a: "100% práctico. Vas a implementar cada módulo con tus propios datos desde el primer día — nada de clases teóricas que nunca aplicás.",
  },
  {
    q: "¿Cómo accedo al material?",
    a: "Apenas se acredita tu compra te llega el acceso, para que arranques cuando quieras, sin esperas.",
  },
  {
    q: "¿Tiene garantía?",
    a: "Sí. Tenés 7 días de garantía real: si sentís que no es para vos, te devolvemos el dinero sin preguntas.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold uppercase text-[var(--accent)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
      {children}
    </span>
  );
}

// Línea fina con el degradé lima ya definido en el Design System: marca cada
// quiebre de sección de forma prolija, en vez de que un bloque de color
// termine seco contra el siguiente.
function Divisor() {
  return <div className="h-[2px] w-full bg-[image:var(--grad-lime-sheen)] opacity-40" />;
}

export default async function DeCreadorADuenoPage() {
  const supabase = await createSupabaseServerClient();
  const { data: config } = await supabase.from("configuracion").select("whatsapp_numero").eq("id", 1).maybeSingle();
  const whatsappLimpio = (config?.whatsapp_numero || "").replace(/\D/g, "");
  const linkCompra = whatsappLimpio
    ? `https://wa.me/${whatsappLimpio}?text=${encodeURIComponent(
        "¡Hola! Quiero comprar \"De Creador/a a Dueño/a\" al precio de lanzamiento 🚀"
      )}`
    : "/servicios";

  const BotonComprar = ({ texto = "Quiero mi acceso ahora", className = "" }: { texto?: string; className?: string }) => (
    <a
      href={linkCompra}
      target="_blank"
      rel="noopener noreferrer"
      className={`tm-display inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[32px] py-[18px] text-[var(--fs-body-l)] font-bold tracking-[var(--ls-tight)] text-[var(--accent-contrast)] shadow-[var(--glow-lime)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] ${className}`}
    >
      {texto}
      <ArrowRight className="h-5 w-5" />
    </a>
  );

  return (
    <main className={`tm-admin-theme ${fontDisplay.variable} ${fontBody.variable}`}>
      {/* HERO — --black-0, el más oscuro y dramático de los dos tonos */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-10)] text-center">
        <div className="mx-auto max-w-[var(--container-max)]">
          <Eyebrow>Sistema simple · Sin fórmulas mágicas</Eyebrow>
          <h1 className="tm-display mx-auto mt-[var(--space-4)] max-w-3xl font-bold leading-[var(--lh-tight)] text-[var(--text-primary)] [font-size:var(--fs-display-l)]">
            De Creador<span className="text-[var(--accent)]">/a</span> a Dueño<span className="text-[var(--accent)]">/a</span>
          </h1>
          <p className="mx-auto mt-[var(--space-5)] max-w-2xl text-[var(--text-secondary)] [font-size:var(--fs-body-l)] leading-[var(--lh-body)]">
            Dejá de improvisar en redes. El sistema simple para ordenar tu contenido y empezar a vender desde hoy — sin
            depender de la inspiración.
          </p>
          <p className="mt-[var(--space-6)] font-bold text-[var(--accent)] [font-size:var(--fs-body-s)] uppercase tracking-[var(--ls-eyebrow)]">
            🔥 Precio especial de lanzamiento — por tiempo limitado
          </p>
          <div className="mt-[var(--space-4)]">
            <BotonComprar />
          </div>

          <div className="relative mx-auto mt-[var(--space-8)] w-full max-w-lg">
            <div className="absolute inset-0 scale-90 rounded-[var(--radius-l)] bg-[var(--accent)] opacity-20 blur-[60px]" />
            <Image
              src="/+15prompts.webp"
              alt="Todo lo que incluye el sistema: planillas, ebooks y +15 prompts listos para usar"
              width={500}
              height={500}
              className="relative mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      <Divisor />

      {/* PUNTOS DE DOLOR — --black-3, bien diferenciado del negro puro del Hero */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            ¿Te suena conocido?
          </h2>
          <div className="mt-[var(--space-7)] flex flex-col gap-[var(--space-3)] text-left">
            {DOLORES.map((item) => (
              <div
                key={item}
                className="flex items-start gap-[var(--space-3)] rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-4)]"
              >
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gray-3)]" />
                <p className="text-[var(--text-secondary)] [font-size:var(--fs-body-m)]">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-[var(--space-7)] font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-m)]">
            No tenés un problema de esfuerzo.
            <br />
            Tenés un problema de <span className="text-[var(--accent)]">estructura</span>.
          </p>
        </div>
      </section>

      <Divisor />

      {/* BENEFICIOS — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            Esto es lo que cambia con el sistema:
          </h2>
          <div className="mt-[var(--space-7)] grid grid-cols-1 gap-[var(--space-3)] text-left sm:grid-cols-2">
            {BENEFICIOS.map((item) => (
              <div key={item} className="flex items-start gap-[var(--space-3)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <p className="text-[var(--text-primary)] [font-size:var(--fs-body-m)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divisor />

      {/* ENTREGABLES — --black-3 */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
              ¿Qué incluye?
            </h2>
            <p className="mt-[var(--space-3)] text-[var(--text-secondary)] [font-size:var(--fs-body-m)] leading-[var(--lh-body)]">
              Un sistema completo para dejar de improvisar y empezar a usar tu contenido como lo que es: una
              herramienta real de ventas.
            </p>
          </div>

          <div className="mt-[var(--space-7)] grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map((modulo) => (
              <div
                key={modulo.titulo}
                className="flex flex-col gap-[var(--space-3)] rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)] shadow-[var(--shadow-card)]"
              >
                <h3 className="tm-display font-bold leading-[var(--lh-heading)] text-[var(--text-primary)] [font-size:var(--fs-heading-s)]">
                  {modulo.titulo}
                </h3>
                <p className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)] leading-[var(--lh-body)]">
                  {modulo.descripcion}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-[var(--space-7)] max-w-2xl rounded-[var(--radius-m)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-[var(--space-5)] text-center">
            <p className="font-bold text-[var(--text-primary)] [font-size:var(--fs-body-m)]">
              ¿No sabés usar IA? No hace falta. Todo el sistema ya viene armado para funcionar cargando tus propios
              datos.
            </p>
            <p className="mt-1 text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
              Nada de teoría: es ejecutar rápido, con orden y sin perder tiempo.
            </p>
          </div>
        </div>
      </section>

      <Divisor />

      {/* BONOS — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="text-center">
            <Eyebrow>Bonos exclusivos por tiempo limitado</Eyebrow>
            <h2 className="tm-display mt-[var(--space-3)] font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
              Y esto también es tuyo hoy
            </h2>
          </div>
          <div className="mt-[var(--space-7)] grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
            {BONOS.map((bono) => (
              <div
                key={bono.numero}
                className="relative overflow-hidden rounded-[var(--radius-l)] border border-[var(--accent)]/30 bg-[var(--surface-card)] shadow-[var(--shadow-card)]"
              >
                <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-[var(--black-3)]">
                  <span className="tm-display absolute left-3 top-3 z-10 font-bold text-[var(--black-5)] [font-size:4rem] leading-none select-none">
                    {bono.numero}
                  </span>
                  <Image
                    src={bono.imagen}
                    alt={bono.titulo}
                    width={260}
                    height={260}
                    className="relative z-[1] h-full w-auto object-contain p-[var(--space-4)]"
                  />
                </div>
                <div className="p-[var(--space-6)]">
                  <span className="font-bold uppercase text-[var(--accent)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
                    Bono {bono.numero}
                  </span>
                  <h3 className="tm-display mt-[var(--space-2)] font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-s)]">
                    {bono.titulo}
                  </h3>
                  <p className="mt-[var(--space-2)] text-[var(--text-secondary)] [font-size:var(--fs-body-s)] leading-[var(--lh-body)]">
                    {bono.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divisor />

      {/* OFERTA / CIERRE — --black-3, con un halo lima detrás del precio para
          que sea el punto de mayor peso visual de toda la página. */}
      <section className="relative overflow-hidden bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-10)]">
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.12] blur-[100px]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2">
            <div className="rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)]">
              <h3 className="tm-display font-bold text-[var(--accent)] [font-size:var(--fs-heading-s)]">
                Este sistema es para vos si:
              </h3>
              <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
                {ES_PARA_VOS.map((item) => (
                  <div key={item} className="flex items-start gap-[var(--space-2)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                    <p className="text-[var(--text-primary)] [font-size:var(--fs-body-s)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-[var(--space-6)]">
              <h3 className="tm-display font-bold text-[var(--text-secondary)] [font-size:var(--fs-heading-s)]">
                No es para vos si:
              </h3>
              <p className="mt-[var(--space-4)] text-[var(--text-tertiary)] [font-size:var(--fs-body-s)] leading-[var(--lh-body)]">
                Buscás una fórmula mágica sin mover un dedo, o no pensás ejecutar nada de lo que aprendas.
              </p>
            </div>
          </div>

          <div className="mt-[var(--space-9)] text-center">
            <p className="font-bold uppercase text-[var(--text-primary)] [font-size:var(--fs-heading-s)]">
              Todo el sistema + los 4 bonos, en un solo pago.
            </p>
            <p className="mt-[var(--space-5)] text-[var(--text-tertiary)] [font-size:var(--fs-body-m)] line-through decoration-2">
              Precio regular: USD 27
            </p>
            <p className="tm-display mt-[var(--space-2)] font-bold text-[var(--accent)] [font-size:var(--fs-display-xl)] leading-[var(--lh-tight)]">
              USD 16
            </p>
            <p className="font-bold uppercase text-[var(--text-secondary)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
              Precio de lanzamiento — hoy
            </p>
          </div>

          <div className="mt-[var(--space-7)]">
            <ContadorLanzamiento />
            <p className="mt-[var(--space-4)] text-center text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
              Accedé ahora al precio de lanzamiento.
              <br />
              Después de esto, el valor aumenta — sin excepciones.
            </p>
          </div>

          <div className="mt-[var(--space-7)] flex justify-center">
            <BotonComprar texto="Sí, quiero empezar hoy" />
          </div>
        </div>
      </section>

      <Divisor />

      {/* FOOTER — garantía + FAQ, --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-[var(--space-3)] rounded-[var(--radius-l)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-[var(--space-6)] text-center">
            <Image src="/7-dias-garantia.jpg" alt="Sello de garantía de 7 días" width={96} height={96} className="rounded-full" />
            <h3 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-m)]">
              Probalo 7 días. Sin riesgo.
            </h3>
            <p className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)] leading-[var(--lh-body)]">
              Si sentís que no es para vos, te devolvemos cada peso hasta 7 días después de la compra. Sin preguntas,
              sin peros.
            </p>
          </div>

          <div className="mt-[var(--space-9)]">
            <h3 className="tm-display text-center font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-l)]">
              Preguntas frecuentes
            </h3>
            <div className="mt-[var(--space-5)]">
              <Accordion items={FAQ} />
            </div>
          </div>

          <p className="mt-[var(--space-9)] text-center text-[var(--text-tertiary)] [font-size:12px]">
            © {new Date().getFullYear()} tumarketing. Todos los derechos reservados.
          </p>
        </div>
      </section>
    </main>
  );
}
