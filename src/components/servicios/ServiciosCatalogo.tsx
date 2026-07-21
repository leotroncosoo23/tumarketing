"use client";

import { useMemo, useState } from "react";
import type { Servicio } from "@/lib/servicios";
import ServiciosHero from "@/components/servicios/ServiciosHero";
import ServiciosGrid from "@/components/ServiciosGrid";

type ServiciosCatalogoProps = {
  servicios: Servicio[];
};

export default function ServiciosCatalogo({ servicios }: ServiciosCatalogoProps) {
  const [busqueda, setBusqueda] = useState("");

  const serviciosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return servicios;

    return servicios.filter(
      (servicio) =>
        servicio.titulo?.toLowerCase().includes(termino) ||
        servicio.descripcion_corta?.toLowerCase().includes(termino)
    );
  }, [servicios, busqueda]);

  return (
    <>
      <ServiciosHero busqueda={busqueda} onBusquedaChange={setBusqueda} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-lg">No encontramos servicios que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <ServiciosGrid servicios={serviciosFiltrados} />
        )}
      </section>
    </>
  );
}
