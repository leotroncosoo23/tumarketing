// Métricas y casos de éxito REALES de la agencia (mismos datos mostrados en la
// home y en /nosotros). Única fuente de verdad: no inventar cifras nuevas acá.
// Foto real, métrica real y descripción real por caso — no son citas textuales
// atribuidas a un cliente puntual, por eso no se presentan como testimonios en
// primera persona.
export const METRICAS_GLOBALES = [
  { valor: "+4M", etiqueta: "views generadas" },
  { valor: "+150", etiqueta: "marcas atendidas" },
  { valor: "360°", etiqueta: "soluciones digitales" },
] as const;

export type CasoExitoId = "alojamiento" | "calzado" | "camping";

export const CASOS_EXITO: {
  id: CasoExitoId;
  imagen: string;
  numero: string;
  etiqueta: string;
  descripcion: string;
}[] = [
  {
    id: "alojamiento",
    imagen: "/casos-exito/caso-1-alojamiento.jpg",
    numero: "+1M",
    etiqueta: "vistas en un solo reel",
    descripcion:
      "2.616 likes, 368 veces compartido y +1.855 seguidores nuevos para un cliente de alojamiento turístico — todo orgánico, sin pauta paga.",
  },
  {
    id: "calzado",
    imagen: "/casos-exito/caso-2-calzado.jpg",
    numero: "+10.000",
    etiqueta: "seguidores en 6 meses",
    descripcion:
      "Una marca de calzado pasó de 500 a más de 10.000 seguidores reales, con una identidad de marca completamente renovada.",
  },
  {
    id: "camping",
    imagen: "/casos-exito/caso-3-camping.jpg",
    numero: "+488%",
    etiqueta: "cuentas alcanzadas",
    descripcion:
      "Un emprendimiento de turismo y camping multiplicó su alcance mes a mes, sumando seguidores y visitas reales a su perfil.",
  },
];
