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
  // Verde lima de marca (#D4EE26) — usado en /servicios, la home y demás
  // páginas que llevan el acento principal de la agencia en vez de un color
  // de sector específico.
  lime: {
    text: "text-[#D4EE26]",
    gradientFrom: "from-[#D4EE26]",
    textSoft: "text-[#D4EE26]/80",
    border: "border-[#D4EE26]/40",
    borderSoft: "border-[#D4EE26]/20",
    bg: "bg-[#D4EE26]/10",
    bgHover: "group-hover:bg-[#D4EE26]/20",
    glow: "bg-[#D4EE26]/10",
    dot: "bg-[#D4EE26]",
    heroGlow: "bg-[#D4EE26]/10",
    cardShadow: "hover:shadow-[0_0_40px_rgba(212,238,38,0.25)]",
    cardBorderHover: "hover:border-[#D4EE26]/50",
    badgeBg: "bg-[#D4EE26]",
    ctaShadow: "shadow-[0_0_60px_rgba(212,238,38,0.08)]",
  },
} as const;

export type Acento = keyof typeof ACCENTS;
