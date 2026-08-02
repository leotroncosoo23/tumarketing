type Tone = "lime" | "gray" | "red";

const TONE_STYLES: Record<Tone, string> = {
  lime: "bg-[var(--accent)] text-[var(--accent-contrast)]",
  gray: "bg-[var(--black-5)] text-[var(--text-primary)]",
  red: "bg-transparent text-[var(--signal-error)] border border-[var(--signal-error)]",
};

// Mapeo por defecto de los estados más comunes de la app a un "tono". Para un
// estado que no esté acá, pasá `tone` explícito.
const ESTADO_TONO: Record<string, Tone> = {
  activo: "lime",
  Activo: "lime",
  Publicado: "lime",
  Pagada: "lime",
  pagada: "lime",
  aprobado: "lime",
  Aprobado: "lime",
  Lanzamiento: "lime",

  pausado: "gray",
  Pausado: "gray",
  Borrador: "gray",
  Pendiente: "gray",
  pendiente: "gray",
  "Esperando información": "gray",
  Diseño: "gray",
  Desarrollo: "gray",
  Revisión: "gray",
  Programado: "gray",

  riesgo: "red",
  Riesgo: "red",
  Vencida: "red",
  vencida: "red",
  Suspendido: "red",
  suspendido: "red",
};

export function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const resolved = tone ?? (typeof children === "string" ? ESTADO_TONO[children] : undefined) ?? "gray";
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-[var(--radius-pill)] px-[12px] py-[5px] font-semibold uppercase tracking-[var(--ls-eyebrow)] [font-size:11px] ${TONE_STYLES[resolved]}`}
    >
      {children}
    </span>
  );
}
