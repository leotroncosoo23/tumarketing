"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCurrency, type Moneda } from "@/lib/CurrencyContext";
import type { Servicio } from "@/lib/servicios";

type ServiciosGridProps = {
  servicios: Servicio[];
};

type Orden = "asc" | "desc";

export default function ServiciosGrid({ servicios }: ServiciosGridProps) {
  const { moneda, setMoneda } = useCurrency();
  // Acordeón único: solo un servicio puede estar desplegado a la vez en toda
  // la grilla. Por eso el estado vive acá (no en cada tarjeta) — al abrir uno
  // nuevo, el anterior se cierra solo.
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  // Por defecto ordenado de menor a mayor precio.
  const [orden, setOrden] = useState<Orden>("asc");

  const serviciosOrdenados = [...servicios].sort((a, b) => {
    const precioA = Number((moneda === "ARS" ? a.precio_ars : a.precio_usd) || 0);
    const precioB = Number((moneda === "ARS" ? b.precio_ars : b.precio_usd) || 0);
    return orden === "asc" ? precioA - precioB : precioB - precioA;
  });

  return (
    <>
      {/* Selector de moneda */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <span className="text-neutral-400 text-sm font-bold">Seleccioná tu moneda:</span>
        <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setMoneda("ARS")}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${
              moneda === "ARS" ? "bg-[#D4EE26] text-black shadow-sm" : "text-neutral-400 hover:text-white"
            }`}
          >
            🇦🇷 $ (ARS)
          </button>
          <button
            onClick={() => setMoneda("USD")}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${
              moneda === "USD" ? "bg-[#D4EE26] text-black shadow-sm" : "text-neutral-400 hover:text-white"
            }`}
          >
            🇺🇸 $ (USD)
          </button>
        </div>
      </div>

      {/* Selector de orden por precio */}
      <div className="flex justify-center sm:justify-end mb-8">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-neutral-400 font-bold">Ordenar por:</span>
          <div className="relative">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="appearance-none bg-neutral-900 border border-neutral-800 text-white font-bold text-sm rounded-xl pl-4 pr-9 py-2.5 cursor-pointer hover:border-[#D4EE26]/50 focus:outline-none focus:ring-2 focus:ring-[#D4EE26]/40 transition-colors"
            >
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </label>
      </div>

      {/* Grilla de servicios */}
      {serviciosOrdenados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-lg">Todavía no hay servicios publicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {serviciosOrdenados.map((servicio) => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              moneda={moneda}
              abierto={abiertoId === servicio.id}
              onToggle={() => setAbiertoId((actual) => (actual === servicio.id ? null : servicio.id))}
            />
          ))}
        </div>
      )}
    </>
  );
}

type ServicioCardProps = {
  servicio: Servicio;
  moneda: Moneda;
  abierto: boolean;
  onToggle: () => void;
};

function ServicioCard({ servicio, moneda, abierto, onToggle }: ServicioCardProps) {
  const caracteristicas = Array.isArray(servicio.caracteristicas) ? servicio.caracteristicas : [];
  const precio = moneda === "ARS" ? servicio.precio_ars : servicio.precio_usd;

  return (
    <div
      className={`relative bg-neutral-900/40 border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col ${
        servicio.destacado
          ? "border-[#D4EE26]/60 shadow-[0_0_30px_rgba(212,238,38,0.15)]"
          : "border-neutral-800 hover:border-[#D4EE26]/50 hover:shadow-[0_0_30px_rgba(212,238,38,0.1)]"
      }`}
    >
      {servicio.destacado && (
        <div className="absolute top-4 left-0 z-10 bg-gradient-to-r from-[#D4EE26] to-lime-400 text-black text-xs font-black px-4 py-1.5 rounded-r-full shadow-lg flex items-center gap-1.5">
          ⭐ Destacado
        </div>
      )}

      {/* pt-12 fijo siempre (no solo si es destacado): así el contenido
          arranca a la misma altura en todas las tarjetas de la fila, tenga o
          no la cinta de "Destacado" arriba. */}
      <div className="p-6 pt-12 flex flex-col flex-grow">
        {(servicio.categorias?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {servicio.categorias.map((c) => (
              <span
                key={c}
                className="bg-[#D4EE26]/10 text-[#D4EE26] border border-[#D4EE26]/30 px-3 py-1 rounded-full text-xs font-bold"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-2 leading-snug">{servicio.titulo}</h3>
        {servicio.descripcion_corta && (
          <p className="text-neutral-400 text-sm mb-6">{servicio.descripcion_corta}</p>
        )}

        {/* Zona flexible: todas las tarjetas miden lo mismo estando cerradas,
            sin importar cuántas características tenga cada servicio. */}
        <div className="flex-grow">
          {caracteristicas.length > 0 && (
            <>
              <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1.5 text-sm font-bold text-[#D4EE26] hover:text-lime-300 transition-colors"
              >
                {abierto ? "Ver menos" : "Ver qué incluye"}
                <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${abierto ? "max-h-[600px] mt-4" : "max-h-0"}`}>
                <ul className="space-y-2.5 mb-2">
                  {caracteristicas.map((item, indice) => (
                    <li key={indice} className="flex items-start gap-2.5 text-sm text-neutral-300">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-5 h-5 shrink-0 text-[#D4EE26] mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Precio (dinámico según la moneda elegida) — siempre pegado
            justo arriba del botón, así los tres quedan alineados. */}
        <div className="pt-4 mt-4 border-t border-neutral-800/50 mb-5">
          <p className="text-3xl font-black text-white">
            {moneda === "ARS" ? "$" : "U$D "}
            {Number(precio || 0).toLocaleString(moneda === "ARS" ? "es-AR" : "en-US")}
            <span className="text-xs font-normal text-neutral-500 ml-1">{moneda}</span>
          </p>
          {servicio.tiempo_entrega && (
            <p className="text-xs text-neutral-500 mt-1">Entrega: {servicio.tiempo_entrega}</p>
          )}
        </div>

        <Link
          href={`/servicios/${servicio.id}`}
          className="w-full bg-[#D4EE26] text-black px-5 py-3 rounded-xl font-black hover:bg-[#c2dd22] transition-all flex justify-center items-center gap-2"
        >
          Contratar <span>→</span>
        </Link>
      </div>
    </div>
  );
}
