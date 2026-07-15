export type TipoArchivoMensaje = "pdf" | "imagen" | "zip";

export type MensajeProyecto = {
  id: string;
  servicio_contratado_id: string;
  autor_id: string;
  autor_rol: "admin" | "cliente";
  texto: string | null;
  archivo_nombre: string | null;
  archivo_tipo: TipoArchivoMensaje | null;
  archivo_path: string | null;
  leido: boolean;
  creado_en: string;
};

export function inferirTipoArchivo(archivo: File): TipoArchivoMensaje {
  if (archivo.type === "application/pdf") return "pdf";
  if (archivo.name.toLowerCase().endsWith(".zip")) return "zip";
  return "imagen";
}
