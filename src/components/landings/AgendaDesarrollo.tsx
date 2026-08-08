import { Code2 } from "lucide-react";
import AgendaConCalendario from "./AgendaConCalendario";

// Cierre de las 3 landings de software (paginas-web, apps, ecommerce): a
// diferencia de las landings de marketing, acá solo hay un camino posible
// (Desarrollo Web y Apps), así que en vez de la tarjeta + link externo se
// muestra el calendario de Cal.com embebido directo en la página.
export default function AgendaDesarrollo() {
  return (
    <AgendaConCalendario
      acento="cyan"
      icono={Code2}
      badge="Consultoría técnica gratuita de 15 minutos"
      titulo="¿Listo para llevar tu proyecto de Desarrollo Web y Apps al siguiente nivel?"
      descripcion="Elegí el horario que más te acomode. Sin formularios ni esperas: agendás acá mismo y nos vemos por videollamada."
      calLink="leotroncosoo-kiwwvu/discovery-call-desarrollo-y-web"
      namespace="discovery-call-desarrollo-y-web"
    />
  );
}
