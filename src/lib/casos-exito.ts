// Métricas y casos de éxito REALES de la agencia (mismos datos mostrados en la
// home, /servicios y /links). Única fuente de verdad: no inventar cifras nuevas acá.
// Foto real, métrica real y descripción real por caso — no son citas textuales
// atribuidas a un cliente puntual, por eso no se presentan como testimonios en
// primera persona.
export const METRICAS_GLOBALES = [
  { valor: "+15", etiqueta: "marcas acompañadas" },
  { valor: "+50M", etiqueta: "de views generadas" },
  { valor: "+50K", etiqueta: "seguidores orgánicos" },
  { valor: "+500", etiqueta: "clics orgánicos en 1 día" },
] as const;

export type CasoExitoId = "calzado" | "camping";

export const CASOS_EXITO: {
  id: CasoExitoId;
  imagen: string;
  numero: string;
  etiqueta: string;
  descripcion: string;
}[] = [
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
