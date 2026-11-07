import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Tag,
  MessageSquare,
  Newspaper,
  Gift,
  BarChart3,
  Receipt,
  CalendarDays,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { SectionId } from "../AdminShell";

// Única fuente de verdad de las secciones del panel: la usan el menú lateral
// (compu), la barra inferior y el panel "Más" (celular) y el buscador.
export type SeccionInfo = {
  id: SectionId;
  label: string;
  descripcion: string;
  icon: LucideIcon;
};

export const SECCIONES: Record<SectionId, SeccionInfo> = {
  dashboard: { id: "dashboard", label: "Inicio", descripcion: "Resumen de la agencia", icon: LayoutDashboard },
  clientes: { id: "clientes", label: "Clientes", descripcion: "Cuentas y planes", icon: Users },
  proyectos: { id: "proyectos", label: "Proyectos", descripcion: "Servicios en curso", icon: Briefcase },
  mensajes: { id: "mensajes", label: "Mensajes", descripcion: "Chats con clientes", icon: MessageSquare },
  servicios: { id: "servicios", label: "Servicios", descripcion: "Catálogo y precios", icon: Wrench },
  promociones: { id: "promociones", label: "Promociones", descripcion: "Cupones de descuento", icon: Tag },
  blog: { id: "blog", label: "Blog", descripcion: "Posts y SEO", icon: Newspaper },
  recursos: { id: "recursos", label: "Recursos", descripcion: "Guías y descargables", icon: Gift },
  calendario: { id: "calendario", label: "Calendario", descripcion: "Publicaciones programadas", icon: CalendarDays },
  reportes: { id: "reportes", label: "Reportes", descripcion: "Métricas por cliente", icon: BarChart3 },
  facturacion: { id: "facturacion", label: "Facturación", descripcion: "Pagos y facturas", icon: Receipt },
  configuracion: { id: "configuracion", label: "Configuración", descripcion: "Agencia, equipo y pagos", icon: Settings },
};

// Barra inferior del celular: lo de uso diario. El resto vive en "Más".
export const TABS_CELULAR: SectionId[] = ["dashboard", "clientes", "proyectos", "mensajes"];

// Grupos del menú lateral (compu) y del panel "Más" (celular).
export const GRUPOS: { titulo: string; ids: SectionId[] }[] = [
  { titulo: "General", ids: ["dashboard", "mensajes", "calendario"] },
  { titulo: "Agencia", ids: ["clientes", "proyectos", "reportes"] },
  { titulo: "Contenido", ids: ["blog", "recursos"] },
  { titulo: "Ventas", ids: ["servicios", "promociones", "facturacion"] },
  { titulo: "Ajustes", ids: ["configuracion"] },
];

// Secciones que ya traen su propio <h1>: el shell no les agrega otro título.
export const CON_TITULO_PROPIO = new Set<SectionId>(["dashboard", "clientes", "proyectos", "servicios", "recursos"]);
