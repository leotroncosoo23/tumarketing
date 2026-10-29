import type { Metadata } from "next";
import ServicioLanding from "@/components/agencia/ServicioLanding";
import { servicioPorSlug } from "@/lib/servicios-landing";

const servicio = servicioPorSlug("paginas-web");

export const metadata: Metadata = {
  title: `${servicio.nombre} | TuMarketing`,
  description: servicio.corto,
};

export default function PaginasWebPage() {
  return <ServicioLanding slug="paginas-web" />;
}