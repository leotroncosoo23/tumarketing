import {
  Video,
  Scissors,
  Image as ImageIcon,
  PenLine,
  CalendarClock,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  ShieldCheck,
  Zap,
  MessageCircle,
  Search,
  LayoutGrid,
  Rocket,
} from "lucide-react";

// Set curado de íconos para "Lo que ganás" en la página de cada servicio.
// El admin elige de esta lista (no puede pegar SVG/código libre), así el
// campo queda seguro y consistente visualmente en toda la web pública.
export const ICONOS_BENEFICIO = {
  video: { label: "Video", Icono: Video },
  tijeras: { label: "Edición", Icono: Scissors },
  imagen: { label: "Imagen", Icono: ImageIcon },
  texto: { label: "Copy / Texto", Icono: PenLine },
  calendario: { label: "Calendario", Icono: CalendarClock },
  celular: { label: "Móvil", Icono: Smartphone },
  objetivo: { label: "Objetivo", Icono: Target },
  crecimiento: { label: "Crecimiento", Icono: TrendingUp },
  personas: { label: "Personas", Icono: Users },
  seguridad: { label: "Seguridad", Icono: ShieldCheck },
  rapidez: { label: "Rapidez", Icono: Zap },
  mensaje: { label: "Mensaje", Icono: MessageCircle },
  busqueda: { label: "Búsqueda", Icono: Search },
  diseno: { label: "Diseño", Icono: LayoutGrid },
  lanzamiento: { label: "Lanzamiento", Icono: Rocket },
} as const;

export type IconoBeneficioKey = keyof typeof ICONOS_BENEFICIO;

export function iconoBeneficio(key: string) {
  return (ICONOS_BENEFICIO as Record<string, { label: string; Icono: typeof Video }>)[key]?.Icono || Zap;
}
