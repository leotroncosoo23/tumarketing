// Mapa de clases estáticas por acento de color (una por sector de servicio).
// Tailwind purga clases no-literales, por eso no se arman con template strings:
// cada valor completo vive acá como string fijo para que el scan lo detecte.
export const ACCENTS = {
  cyan: {
    text: "text-cyan-400",
    gradientFrom: "from-cyan-400",
    textSoft: "text-cyan-400/80",
    border: "border-cyan-400/40",
    borderSoft: "border-cyan-400/20",
    bg: "bg-cyan-400/10",
    bgHover: "group-hover:bg-cyan-400/20",
    glow: "bg-cyan-400/10",
    dot: "bg-cyan-400",
    heroGlow: "bg-cyan-400/10",
    cardShadow: "hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
    cardBorderHover: "hover:border-cyan-400/50",
    badgeBg: "bg-cyan-400",
    ctaShadow: "shadow-[0_0_60px_rgba(34,211,238,0.08)]",
  },
  fuchsia: {
    text: "text-fuchsia-400",
    gradientFrom: "from-fuchsia-400",
    textSoft: "text-fuchsia-400/80",
    border: "border-fuchsia-400/40",
    borderSoft: "border-fuchsia-400/20",
    bg: "bg-fuchsia-400/10",
    bgHover: "group-hover:bg-fuchsia-400/20",
    glow: "bg-fuchsia-400/10",
    dot: "bg-fuchsia-400",
    heroGlow: "bg-fuchsia-400/10",
    cardShadow: "hover:shadow-[0_0_40px_rgba(232,121,249,0.25)]",
    cardBorderHover: "hover:border-fuchsia-400/50",
    badgeBg: "bg-fuchsia-400",
    ctaShadow: "shadow-[0_0_60px_rgba(232,121,249,0.08)]",
  },
} as const;

export type Acento = keyof typeof ACCENTS;
