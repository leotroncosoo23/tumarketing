"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Servicio } from "@/lib/servicios";
import ServiciosGrid from "@/components/ServiciosGrid";
import FadeInScroll from "@/components/FadeInScroll";

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
    <section id="packs" className="max-w-7xl mx-auto px-6 py-16 md:py-24 scroll-mt-20">
        <FadeInScroll className="text-center max-w-2xl mx-auto mb-4">
          <span className="inline-flex items-center gap-2 text-[#D4EE26] font-bold tracking-widest uppercase mb-4 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4EE26] animate-pulse" />
            Qué hacemos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Elegí tu plan y arrancá a crecer
          </h2>
          <p className="text-neutral-400 text-lg">
            Combinamos marketing y programación en packs diseñados para cada etapa de tu negocio.
          </p>
        </FadeInScroll>

        <FadeInScroll delay={0.1} className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar servicio (ej: Meta Ads, Landing Page...)"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-12 pr-5 py-3.5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4EE26]/60 focus:border-[#D4EE26]/60 transition-all duration-300"
          />
        </FadeInScroll>

        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-lg">No encontramos servicios que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <ServiciosGrid servicios={serviciosFiltrados} />
        )}
    </section>
  );
}
