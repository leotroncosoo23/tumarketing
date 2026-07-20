import {
  MonitorSmartphone,
  ShoppingCart,
  Workflow,
  MessagesSquare,
  Megaphone,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import type { Acento } from "@/components/landings/accents";

export type ServicioNavItem = {
  titulo: string;
  href: string;
  descripcion: string;
  icon: LucideIcon;
};

export type SectorServicios = {
  sector: string;
  acento: Acento;
  items: ServicioNavItem[];
};

// Fuente única de las 6 landings de servicios: alimenta el mega-menu del
// Navbar (desktop y mobile). Agregar un servicio nuevo acá alcanza para que
// aparezca en el menú.
export const SERVICIOS_NAV: SectorServicios[] = [
  {
    sector: "Software",
    acento: "cyan",
    items: [
      {
        titulo: "Páginas Web",
        href: "/servicios/paginas-web",
        descripcion: "Sitios rápidos y a medida",
        icon: MonitorSmartphone,
      },
      {
        titulo: "eCommerce",
        href: "/servicios/ecommerce",
        descripcion: "Tiendas online que venden 24/7",
        icon: ShoppingCart,
      },
      {
        titulo: "Apps y Sistemas",
        href: "/servicios/apps",
        descripcion: "Software a medida para tu negocio",
        icon: Workflow,
      },
    ],
  },
  {
    sector: "Redes Sociales",
    acento: "fuchsia",
    items: [
      {
        titulo: "Community Manager",
        href: "/servicios/community-manager",
        descripcion: "Gestión profesional de tus redes",
        icon: MessagesSquare,
      },
      {
        titulo: "Publicidad",
        href: "/servicios/publicidad",
        descripcion: "Meta Ads que venden",
        icon: Megaphone,
      },
      {
        titulo: "Creación y Edición",
        href: "/servicios/creacion-edicion",
        descripcion: "Contenido que detiene el scroll",
        icon: Clapperboard,
      },
    ],
  },
];
