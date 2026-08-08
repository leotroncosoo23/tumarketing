import { Megaphone } from "lucide-react";
import AgendaConCalendario from "./AgendaConCalendario";

// Cierre de las 3 landings de marketing/redes (publicidad, creacion-edicion,
// community-manager): mismo criterio que AgendaDesarrollo pero con el
// calendario y el copy de la sesión estratégica de Marketing y Redes.
export default function AgendaRedes() {
  return (
    <AgendaConCalendario
      acento="fuchsia"
      icono={Megaphone}
      badge="Consultoría estratégica gratuita de 15 minutos"
      titulo="¿Listo para que tus redes trabajen para tu negocio?"
      descripcion="Elegí el horario que más te acomode. Sin formularios ni esperas: agendás acá mismo y nos vemos por videollamada."
      calLink="natasha-hqosbf/15min"
      namespace="natasha-15min"
    />
  );
}
