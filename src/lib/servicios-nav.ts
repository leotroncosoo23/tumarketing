import type { LucideIcon } from "lucide-react";
import { servicioPorSlug, type ServicioSlug } from "@/lib/servicios-landing";

export type ServicioNavItem = {
  titulo: string;
  href: string;
  descripcion: string;
  icon: LucideIcon;
  /** Color hex del servicio (rosa CM, violeta Pauta, azul Web). */
  acento: string;
};

export type SectorServicios = {
  sector: string;
  /** Color hex del título del sector. */
  acento: string;
  items: ServicioNavItem[];
};

const item = (slug: ServicioSlug, descripcion: string): ServicioNavItem => {
  const s = servicioPorSlug(slug);
  return { titulo: s.nombre, href: s.href, descripcion, icon: s.icon, acento: s.acento };
};

// Mega-menu del Navbar (desktop y mobile). Los datos de cada servicio salen de
// servicios-landing.ts, así el menú y las landings nunca se desincronizan.
export const SERVICIOS_NAV: SectorServicios[] = [
  {
    sector: "Redes sociales",
    acento: "#ff4fd8",
    items: [
      item("community-manager", "Gestión profesional de tus redes"),
      item("publicidad", "Campañas en Meta y Google que venden"),
    ],
  },
  {
    sector: "Software",
    acento: "#3b9dff",
    items: [item("paginas-web", "Webs, tiendas online, apps y sistemas")],
  },
];
