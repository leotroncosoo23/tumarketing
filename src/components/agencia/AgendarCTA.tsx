import CalendarioInline from "@/components/landings/CalendarioInline";
import FadeInScroll from "@/components/FadeInScroll";
import { CAL_LINK } from "@/lib/servicios-landing";

type AgendarCTAProps = {
  eyebrow: string;
  titulo: string;
  destacado: string;
  descripcion: string;
  /** Único por página: Cal.com guarda cada calendario embebido por namespace. */
  namespace: string;
  /** Color del destacado y del brillo (landings); por defecto el lima de marca. */
  acento?: string;
};

const CHECKS = ["Gratis", "15 minutos", "Propuesta personalizada", "Sin compromiso"];

// Cierre de cada página: tarjeta con borde de luz giratorio y el calendario de
// Cal.com embebido adentro (se agenda sin salir del sitio). Todos los botones
// "Agendá / Quiero esto" de la página bajan a #agendar.
export default function AgendarCTA({ eyebrow, titulo, destacado, descripcion, namespace, acento = "#ccff00" }: AgendarCTAProps) {
  return (
    <section id="agendar" className="isolate mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6 md:py-28">
      {/* La tarjeta no se anima (ver .tm-glow-border en globals.css); se anima su contenido */}
      <div
        style={{ "--acc": acento } as React.CSSProperties}
        className="tm-glow-border rounded-[30px] bg-[#0a0a0a] bg-[radial-gradient(600px_circle_at_50%_0%,color-mix(in_srgb,var(--acc)_16%,transparent),transparent_70%)] px-5 py-12 sm:px-10 md:py-16"
      >
        <FadeInScroll className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--acc)]">
            <span className="h-2 w-2 rounded-full bg-[var(--acc)] shadow-[0_0_12px_var(--acc)]" />
            {eyebrow}
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            {titulo} <span className="text-[var(--acc)]">{destacado}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-400">{descripcion}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {CHECKS.map((c) => (
              <li key={c} className="rounded-full border border-neutral-800 px-3.5 py-1.5 text-sm text-neutral-200">
                ✓ {c}
              </li>
            ))}
          </ul>
        </FadeInScroll>

        <div className="mt-10">
          <CalendarioInline calLink={CAL_LINK} namespace={namespace} />
        </div>
        <p className="mt-5 text-center text-sm text-neutral-500">Cupos limitados por semana · +15 marcas ya crecen con nosotras</p>
      </div>
    </section>
  );
}
