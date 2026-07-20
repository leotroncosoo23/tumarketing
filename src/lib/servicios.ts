export const CATEGORIAS_SERVICIOS = [
  "Marketing Digital",
  "Software",
  "Página Web",
  "eCommerce",
  "Apps y Sistemas",
  "Community Manager",
  "Publicidad",
  "Creación de Contenido",
] as const;

export type EstadoServicio = "Activo" | "Borrador";

// Decide qué panel extra ve el cliente en el portal de alumnos para este
// servicio (ver ModuloProyecto.tsx). "otro" no muestra ninguna sección extra.
export const MODULOS_SERVICIO = [
  { valor: "otro", etiqueta: "Ninguno" },
  { valor: "web", etiqueta: "Soluciones Web (Diseño/eCommerce)" },
  { valor: "social", etiqueta: "Redes Sociales (Community Manager)" },
  { valor: "ads", etiqueta: "Ads / Innovación (IA)" },
  { valor: "branding", etiqueta: "Branding (Diseño de Marca)" },
] as const;

export type ModuloServicio = (typeof MODULOS_SERVICIO)[number]["valor"];

// Forma exacta de la tabla "servicios" en Supabase (sin id/created_at, que los pone la base).
export type NuevoServicioPayload = {
  titulo: string;
  categorias: string[];
  estado: EstadoServicio;
  descripcion_corta: string;
  descripcion_detallada: string;
  tiempo_entrega: string;
  precio_ars: number;
  precio_usd: number;
  miniatura_url: string;
  caracteristicas: string[];
  destacado: boolean;
  modulo: ModuloServicio;
};

export type Servicio = NuevoServicioPayload & {
  id: string;
  created_at: string;
};
