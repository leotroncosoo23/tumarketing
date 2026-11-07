// Utilidades de formato del inbox de mensajes del panel.

const UN_DIA = 86400000;

function inicioDelDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function diasAtras(iso: string) {
  return Math.round((inicioDelDia(new Date()) - inicioDelDia(new Date(iso))) / UN_DIA);
}

export function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

// Para la lista: "14:32" (hoy), "Ayer", "lun" (esta semana) o "03/11/26".
export function fechaLista(iso: string) {
  const dias = diasAtras(iso);
  if (dias <= 0) return hora(iso);
  if (dias === 1) return "Ayer";
  if (dias < 7) return new Date(iso).toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// Separador de día dentro del chat.
export function fechaSeparador(iso: string) {
  const dias = diasAtras(iso);
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  const d = new Date(iso);
  const opciones: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };
  if (d.getFullYear() !== new Date().getFullYear()) opciones.year = "numeric";
  return d.toLocaleDateString("es-AR", opciones);
}

export function mismoDia(a: string, b: string) {
  return inicioDelDia(new Date(a)) === inicioDelDia(new Date(b));
}

export function iniciales(nombre: string) {
  const base = nombre.includes("@") ? nombre.split("@")[0] : nombre;
  return (
    base
      .split(/[\s._-]+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

// Color estable por cliente (mismo nombre → mismo color), en tonos que
// combinan con el tema oscuro del panel.
export function colorAvatar(nombre: string) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
  const tono = hash % 360;
  return { background: `hsl(${tono} 45% 20%)`, color: `hsl(${tono} 85% 72%)` };
}

export const RESPUESTAS_RAPIDAS = [
  "¡Hola! ¿Cómo estás? 😊",
  "Ya lo estamos revisando, te aviso en breve.",
  "¡Listo! Ya quedó subido, fijate y contame qué te parece.",
  "¿Nos podés enviar el material (fotos, logo, textos) por acá?",
  "Perfecto, lo agendamos y te confirmamos la fecha.",
  "¡Gracias! Cualquier cosa nos escribís por acá.",
];
