// Pipeline único de estado para "servicios_contratados", compartido entre el
// portal de alumnos y el panel de admin para que no se desincronicen.
//
// El primer valor sigue guardándose como "Esperando información" (no lo
// renombramos) porque de eso depende la lógica de desbloqueo de chat en
// src/app/alumnos/page.tsx (tieneBriefing) — solo cambia cómo se etiqueta
// en pantalla, se muestra como "Briefing".
export const ESTADOS_SERVICIO_CONTRATADO = [
  "Esperando información",
  "Diseño",
  "Desarrollo",
  "Revisión",
  "Lanzamiento",
] as const;

export type EstadoServicioContratado = (typeof ESTADOS_SERVICIO_CONTRATADO)[number];

export const ETIQUETA_ESTADO: Record<EstadoServicioContratado, string> = {
  "Esperando información": "Briefing",
  Diseño: "Diseño",
  Desarrollo: "Desarrollo",
  Revisión: "Revisión",
  Lanzamiento: "Lanzamiento",
};

export const ESTADO_ESTILOS: Record<EstadoServicioContratado, string> = {
  "Esperando información": "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  Diseño: "bg-purple-400/10 text-purple-400 border border-purple-400/30",
  Desarrollo: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
  Revisión: "bg-orange-400/10 text-orange-400 border border-orange-400/30",
  Lanzamiento: "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30",
};
