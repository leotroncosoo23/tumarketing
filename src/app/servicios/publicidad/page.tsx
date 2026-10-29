import type { Metadata } from "next";
import ServicioLanding from "@/components/agencia/ServicioLanding";
import { servicioPorSlug } from "@/lib/servicios-landing";

const servicio = servicioPorSlug("publicidad");

export const metadata: Metadata = {
  title: `${servicio.nombre} | TuMarketing`,
  description: servicio.corto,
};

export default function PublicidadPage() {
  return <ServicioLanding slug="publicidad" />;
}