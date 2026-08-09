import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { CheckCircle2, CircleAlert, ArrowRight, X, Check } from "lucide-react";
import { Accordion, type AccordionItem } from "@/components/dashboard/ui";
import ContadorLanzamiento from "./ContadorLanzamiento";
import { VALOR_SISTEMA, BONOS, VALOR_TOTAL, PRECIO_LANZAMIENTO, PRECIO_REGULAR } from "./precios";
import "@/app/admin/admin.css";

const fontDisplay = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "De Creador/a a Dueño/a — tumarketing",
  description: "Dejá de improvisar en redes. El sistema simple para ordenar tu contenido y empezar a vender desde hoy.",
};

// PASO 1 (Problema): plano, sin agitar todavía — solo nombrar el dolor tal
// como lo vive la persona antes de tener el sistema.
const PROBLEMA = [
  "Publicás todos los días, pero no sabés si eso te está acercando a una venta o solo llenando el feed",
  "Cada vez que te sentás a crear contenido, arrancás de cero: sin guion, sin estructura, sin saber qué decir",
  "Tenés ideas dando vueltas en la cabeza, pero nunca las convertís en algo publicable",
  "Cuando alguien te escribe por DM interesado, no sabés cómo cerrar sin sonar desesperado",
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

const COMPARATIVA = [
  {
    criterio: "Estructura clara",
    tutoriales: false,
    copiar: false,
    agencia: true,
    sistema: true,
  },
  {
    criterio: "Pensado para vender (no solo para mostrar)",
    tutoriales: false,
    copiar: false,
    agencia: true,
    sistema: true,
  },
  {
    criterio: "Lo aplicás vos mismo/a, a tu ritmo",
    tutoriales: true,
    copiar: true,
    agencia: false,
    sistema: true,
  },
  {
    criterio: "Pago único, sin mensualidades",
    tutoriales: true,
    copiar: true,
    agencia: false,
    sistema: true,
  },
];

const ES_PARA_VOS = [
  "Emprendés o vendés productos o servicios",
  "Querés orden, claridad y resultados — no otro curso más en la lista",
  "Querés usar tus redes para vender, no solo para mostrar",
];

const NO_ES_PARA_VOS = [
  "Buscás una fórmula mágica sin ejecutar nada",
  "Ya tenés un sistema de contenido que te está funcionando",
  "No vendés nada todavía y solo querés \"aprender por curiosidad\"",
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
    q: "¿Y si compro y no tengo tiempo de arrancar ahora?",
    a: "El acceso es de por vida: podés arrancar cuando quieras, a tu ritmo. La única razón para comprar hoy es el precio de lanzamiento, no una fecha límite de acceso.",
  },
  {
    q: "¿Cómo accedo al material?",
    a: "Apenas se acredita tu compra te llega el acceso, para que arranques cuando quieras, sin esperas.",
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

const LINK_CHECKOUT = "/de-creador-a-dueno/checkout";

// Vive afuera de la página a propósito: declarar un componente DENTRO del
// cuerpo de otro componente hace que React lo trate como un tipo nuevo en
// cada render (pierde estado, y con reactCompiler activado directamente
// tira error). "[font-size:...]" en vez de "text-[...]" para el tamaño de
// fuente, porque ambos comparten el prefijo "text-" y competían con
// "text-[var(--accent-contrast)]" (el color) — el texto del botón se veía
// casi invisible sobre el fondo lima.
function BotonComprar({ texto = "Quiero mi acceso ahora", className = "" }: { texto?: string; className?: string }) {
  return (
    <Link
      href={LINK_CHECKOUT}
      className={`tm-display inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[32px] py-[18px] [font-size:var(--fs-body-l)] font-bold tracking-[var(--ls-tight)] text-[var(--accent-contrast)] shadow-[var(--glow-lime)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] ${className}`}
    >
      {texto}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}

export default function DeCreadorADuenoPage() {
  return (
    <main className={`tm-admin-theme ${fontDisplay.variable} ${fontBody.variable}`}>
      {/* 1. HERO — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-10)] text-center">
        <div className="mx-auto max-w-[var(--container-max)]">
          <Eyebrow>Para creadores que ya facturan pero sienten que están al techo</Eyebrow>
          <h1 className="tm-display mx-auto mt-[var(--space-4)] max-w-3xl font-bold leading-[var(--lh-tight)] text-[var(--text-primary)] [font-size:var(--fs-display-l)]">
            Dejá de ser el motor de tu negocio.
            <br />
            Empezá a ser el <span className="text-[var(--accent)]">dueño/a</span>.
          </h1>
          <p className="mx-auto mt-[var(--space-5)] max-w-2xl text-[var(--text-secondary)] [font-size:var(--fs-body-l)] leading-[var(--lh-body)]">
            El sistema para transformar tu contenido en un activo que vende solo — mientras vos dejás de improvisar
            cada publicación y empezás a tomar decisiones de dueño/a, no de creador/a.
          </p>
          <p className="mt-[var(--space-6)] font-bold text-[var(--accent)] [font-size:var(--fs-body-s)] uppercase tracking-[var(--ls-eyebrow)]">
            🔥 Precio de lanzamiento — sube en cuanto termine la cuenta
          </p>
          <div className="mt-[var(--space-4)] flex justify-center">
            <ContadorLanzamiento />
          </div>
          <div className="mt-[var(--space-6)]">
            <BotonComprar texto="Quiero mi sistema ahora" />
          </div>

          <div className="relative mx-auto mt-[var(--space-8)] w-full max-w-lg">
            <div className="absolute inset-0 scale-90 rounded-[var(--radius-l)] bg-[var(--accent)] opacity-20 blur-[60px]" />
            <Image
              src="/+15prompts.png"
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

      {/* 2. PROBLEMA — --black-3 */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            ¿Esto te suena conocido?
          </h2>
          <div className="mt-[var(--space-7)] flex flex-col gap-[var(--space-3)] text-left">
            {PROBLEMA.map((item) => (
              <div
                key={item}
                className="flex items-start gap-[var(--space-3)] rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-4)]"
              >
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gray-3)]" />
                <p className="text-[var(--text-secondary)] [font-size:var(--fs-body-m)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divisor />

      {/* 3. AGITACIÓN — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            Esto no es falta de esfuerzo.
            <br />
            Es que estás construyendo sin planos.
          </h2>
          <p className="mt-[var(--space-6)] text-[var(--text-secondary)] [font-size:var(--fs-body-l)] leading-[var(--lh-body)]">
            Cada día que pasa publicando sin sistema es un día más compitiendo contra vos mismo/a: contra el
            creador/a de ayer que tampoco sabía qué decir. Mientras tanto, tu competencia — la que sí tiene un
            sistema — está construyendo confianza con tu audiencia mientras vos seguís improvisando. No es que no
            tengas potencial. Es que estás gastando tu energía en el lugar equivocado: en producir más contenido, en
            vez de producir el contenido correcto.
          </p>
          <p className="mt-[var(--space-7)] font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-m)] leading-[var(--lh-heading)]">
            No necesitás publicar más.
            <br />
            Necesitás un sistema que te diga <span className="text-[var(--accent)]">qué</span> publicar,{" "}
            <span className="text-[var(--accent)]">por qué</span>, y cómo convertir eso en ventas.
          </p>
        </div>
      </section>

      <Divisor />

      {/* 4. BENEFICIOS (solución, primer vistazo) — --black-3 */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
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

      {/* 5. MÉTODO / ENTREGABLES — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Por qué esto funciona cuando lo demás no</Eyebrow>
            <h2 className="tm-display mt-[var(--space-3)] font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
              ¿Qué incluye?
            </h2>
            <p className="mt-[var(--space-3)] text-[var(--text-secondary)] [font-size:var(--fs-body-m)] leading-[var(--lh-body)]">
              La mayoría de los sistemas de contenido te enseñan a publicar más. Este te enseña a publicar con un
              objetivo de negocio detrás de cada pieza — desde la estrategia hasta el cierre de la venta.
            </p>
          </div>

          <div className="mt-[var(--space-7)] grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map((modulo, i) => (
              <div
                key={modulo.titulo}
                className="relative flex flex-col gap-[var(--space-3)] overflow-hidden rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)] shadow-[var(--shadow-card)]"
              >
                <span className="tm-display absolute -right-1 -top-3 font-bold text-[var(--black-4)] [font-size:3.5rem] leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="tm-display relative font-bold leading-[var(--lh-heading)] text-[var(--text-primary)] [font-size:var(--fs-heading-s)]">
                  {modulo.titulo}
                </h3>
                <p className="relative text-[var(--text-secondary)] [font-size:var(--fs-body-s)] leading-[var(--lh-body)]">
                  {modulo.descripcion}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-[var(--space-7)] max-w-2xl rounded-[var(--radius-m)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-[var(--space-5)] text-center">
            <p className="font-bold text-[var(--text-primary)] [font-size:var(--fs-body-m)]">
              Esto no es un PDF más para guardar y no abrir nunca. Es un sistema que ejecutás con tus propios datos,
              esta misma semana.
            </p>
            <p className="mt-1 text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
              Todo el sistema ya viene armado para funcionar con IA cargando tus propios datos.
            </p>
          </div>
        </div>
      </section>

      <Divisor />

      {/* 6. COMPARATIVA — --black-3 */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
              ¿Por qué esto y no otra cosa?
            </h2>
          </div>

          <div className="mt-[var(--space-7)] overflow-x-auto">
            <table className="mx-auto w-full max-w-3xl border-separate border-spacing-y-[var(--space-2)]">
              <thead>
                <tr className="text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
                  <th className="px-[var(--space-3)] py-[var(--space-2)] text-left font-medium">&nbsp;</th>
                  <th className="px-[var(--space-3)] py-[var(--space-2)] text-center font-medium">Tutoriales gratis</th>
                  <th className="px-[var(--space-3)] py-[var(--space-2)] text-center font-medium">Copiar a otros</th>
                  <th className="px-[var(--space-3)] py-[var(--space-2)] text-center font-medium">Agencia</th>
                  <th className="rounded-t-[var(--radius-m)] bg-[var(--accent)]/10 px-[var(--space-3)] py-[var(--space-2)] text-center font-bold text-[var(--accent)]">
                    Este sistema
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA.map((fila) => (
                  <tr key={fila.criterio} className="[font-size:var(--fs-body-s)]">
                    <td className="rounded-l-[var(--radius-m)] bg-[var(--surface-card)] px-[var(--space-3)] py-[var(--space-4)] text-left font-medium text-[var(--text-primary)]">
                      {fila.criterio}
                    </td>
                    <td className="bg-[var(--surface-card)] px-[var(--space-3)] py-[var(--space-4)] text-center">
                      {fila.tutoriales ? (
                        <Check className="mx-auto h-4 w-4 text-[var(--text-tertiary)]" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-[var(--signal-error)]/70" />
                      )}
                    </td>
                    <td className="bg-[var(--surface-card)] px-[var(--space-3)] py-[var(--space-4)] text-center">
                      {fila.copiar ? (
                        <Check className="mx-auto h-4 w-4 text-[var(--text-tertiary)]" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-[var(--signal-error)]/70" />
                      )}
                    </td>
                    <td className="bg-[var(--surface-card)] px-[var(--space-3)] py-[var(--space-4)] text-center">
                      {fila.agencia ? (
                        <Check className="mx-auto h-4 w-4 text-[var(--text-tertiary)]" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-[var(--signal-error)]/70" />
                      )}
                    </td>
                    <td className="rounded-r-[var(--radius-m)] bg-[var(--accent)]/10 px-[var(--space-3)] py-[var(--space-4)] text-center">
                      <Check className="mx-auto h-5 w-5 text-[var(--accent)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Divisor />

      {/* 7. BONOS — --black-0 */}
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
                <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[var(--black-3)]">
                  <span className="tm-display absolute left-3 top-3 z-10 font-bold text-[var(--black-5)] [font-size:4rem] leading-none select-none">
                    {bono.numero}
                  </span>
                  <span className="absolute right-3 top-3 z-10 rounded-[var(--radius-pill)] bg-[var(--black-0)]/80 px-[var(--space-3)] py-1 font-bold text-[var(--accent)] [font-size:12px]">
                    Valor: ${bono.valor} USD
                  </span>
                  <Image
                    src={bono.imagen}
                    alt={bono.titulo}
                    width={340}
                    height={340}
                    className="relative z-[1] h-full w-auto object-contain p-[var(--space-2)]"
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

      {/* 8. ES PARA VOS / NO ES PARA VOS — --black-3 */}
      <section className="bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-3xl">
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
              <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
                {NO_ES_PARA_VOS.map((item) => (
                  <div key={item} className="flex items-start gap-[var(--space-2)]">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-tertiary)]" />
                    <p className="text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divisor />

      {/* 10. OFERTA / CIERRE — --black-3, con un halo lima detrás del precio
          para que sea el punto de mayor peso visual de toda la página. */}
      <section className="relative overflow-hidden bg-[var(--black-3)] px-[var(--container-pad)] py-[var(--space-10)]">
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.12] blur-[100px]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Eyebrow>Todo lo que recibís hoy</Eyebrow>
          <h2 className="tm-display mt-[var(--space-3)] font-bold text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            Todo el sistema + los 4 bonos, en un solo pago.
          </h2>

          <div className="mt-[var(--space-7)] flex flex-col gap-[var(--space-2)] rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)] text-left">
            <div className="flex items-center justify-between [font-size:var(--fs-body-m)]">
              <span className="text-[var(--text-secondary)]">Sistema completo (6 módulos)</span>
              <span className="font-bold text-[var(--text-primary)]">${VALOR_SISTEMA} USD</span>
            </div>
            {BONOS.map((bono) => (
              <div key={bono.numero} className="flex items-center justify-between [font-size:var(--fs-body-m)]">
                <span className="text-[var(--text-secondary)]">
                  Bono {bono.numero} — {bono.titulo}
                </span>
                <span className="font-bold text-[var(--text-primary)]">${bono.valor} USD</span>
              </div>
            ))}
            <div className="mt-[var(--space-3)] flex items-center justify-between border-t border-[var(--border-subtle)] pt-[var(--space-3)] [font-size:var(--fs-body-m)]">
              <span className="font-bold text-[var(--text-primary)]">Valor total</span>
              <span className="font-bold text-[var(--text-tertiary)] line-through decoration-2">${VALOR_TOTAL} USD</span>
            </div>
          </div>

          <div className="mt-[var(--space-9)]">
            <p className="font-bold uppercase text-[var(--text-secondary)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
              Precio de lanzamiento — hoy
            </p>
            <p className="tm-display mt-[var(--space-2)] font-bold text-[var(--accent)] [font-size:var(--fs-display-xl)] leading-[var(--lh-tight)]">
              USD {PRECIO_LANZAMIENTO}
            </p>
          </div>

          <div className="mt-[var(--space-7)]">
            <ContadorLanzamiento />
            <p className="mt-[var(--space-4)] text-center text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
              Accedé ahora al precio de lanzamiento.
              <br />
              Después de esto, el precio vuelve a ${PRECIO_REGULAR} y no hay vuelta atrás.
            </p>
          </div>

          <div className="mt-[var(--space-7)] flex justify-center">
            <BotonComprar texto="Sí, quiero mi sistema al precio de lanzamiento" />
          </div>
          <p className="mt-[var(--space-4)] text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
            Pago único · Sin mensualidades · Acceso inmediato
          </p>
        </div>
      </section>

      <Divisor />

      {/* 11. FAQ + footer — --black-0 */}
      <section className="bg-[var(--black-0)] px-[var(--container-pad)] py-[var(--space-9)]">
        <div className="mx-auto max-w-2xl">
          <h3 className="tm-display text-center font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-l)]">
            Preguntas frecuentes
          </h3>
          <div className="mt-[var(--space-5)]">
            <Accordion items={FAQ} />
          </div>

          <p className="mt-[var(--space-9)] text-center text-[var(--text-tertiary)] [font-size:12px]">
            © {new Date().getFullYear()} tumarketing. Todos los derechos reservados.
          </p>
        </div>
      </section>

      {/* Espaciador: sin esto, la barra fixed de abajo tapa las últimas
          líneas del footer (FAQ/copyright) en vez de flotar sobre contenido
          que ya tenía lugar de sobra. */}
      <div className="h-24" />

      {/* Barra de precio sticky: acompaña toda la landing, no solo la
          sección de oferta — así siempre hay un "Comprar ahora" a mano sin
          tener que volver a scrollear hasta el cierre. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--black-0)]/95 px-[var(--container-pad)] py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-bold uppercase text-[var(--accent)] [font-size:10px] tracking-[var(--ls-eyebrow)]">
              Últimos cupos al precio de lanzamiento
            </p>
            <p className="truncate text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">
              <span className="font-bold text-[var(--text-primary)]">De Creador/a a Dueño/a</span> ·{" "}
              <span className="font-bold text-[var(--accent)]">USD {PRECIO_LANZAMIENTO}</span>
            </p>
          </div>
          <Link
            href={LINK_CHECKOUT}
            className="tm-display inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[24px] py-[12px] [font-size:var(--fs-body-s)] font-bold text-[var(--accent-contrast)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--accent-hover)]"
          >
            Comprar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
