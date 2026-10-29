import { permanentRedirect } from "next/navigation";

// Los packs con precio (carrito + Mercado Pago/PayPal) ya no se ofrecen en el
// sitio: todo arranca con la asesoría 1:1. Los links viejos a un pack
// (/servicios/<id>, incluidos los mails de notificación) llevan a /servicios.
export default function ServicioDetallePage() {
  permanentRedirect("/servicios");
}
