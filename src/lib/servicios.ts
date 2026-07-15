export const CATEGORIAS_SERVICIOS = [
  "Desarrollo Web",
  "Marketing Digital",
  "Redes Sociales",
  "Diseño Gráfico",
  "Consultoría",
  "Otro",
] as const;

export type EstadoServicio = "Activo" | "Borrador";

// Forma exacta de la tabla "servicios" en Supabase (sin id/created_at, que los pone la base).
export type NuevoServicioPayload = {
  titulo: string;
  categoria: string;
  estado: EstadoServicio;
  descripcion_corta: string;
  descripcion_detallada: string;
  tiempo_entrega: string;
  precio_ars: number;
  precio_usd: number;
  miniatura_url: string;
  caracteristicas: string[];
  destacado: boolean;
};

export type Servicio = NuevoServicioPayload & {
  id: string;
  created_at: string;
};
