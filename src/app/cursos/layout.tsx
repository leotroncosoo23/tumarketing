import { redirect } from "next/navigation";
import { CURSOS_HABILITADO } from "@/lib/feature-flags";

// Bloquea /cursos y /cursos/[id] mientras la sección esté deshabilitada,
// incluso si alguien entra directo por la URL. No borra nada: cuando
// CURSOS_HABILITADO vuelva a "true", este layout deja pasar normalmente.
export default function CursosLayout({ children }: { children: React.ReactNode }) {
  if (!CURSOS_HABILITADO) {
    redirect("/");
  }

  return <>{children}</>;
}
