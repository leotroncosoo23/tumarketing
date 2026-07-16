"use client";

import Link from "next/link";
import { useState } from "react";
import type { Servicio } from "@/lib/servicios";

type Moneda = "ARS" | "USD";

type ServiciosGridProps = {
  servicios: Servicio[];
};

export default function ServiciosGrid({ servicios }: ServiciosGridProps) {
  const [moneda, setMoneda] = useState<Moneda>("ARS");

  return (
    <>
      {/* Selector de moneda */}
      <div className="flex flex-col items-center gap-3 mb-12">
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

      {/* Grilla de servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-lg">Todavía no hay servicios publicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => {
            const caracteristicas = Array.isArray(servicio.caracteristicas) ? servicio.caracteristicas : [];
            const precio = moneda === "ARS" ? servicio.precio_ars : servicio.precio_usd;

            return (
              <div
                key={servicio.id}
                className={`relative bg-neutral-900/40 border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
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

                <div className={`p-6 flex flex-col flex-grow ${servicio.destacado ? "pt-12" : ""}`}>
                  {servicio.categoria && (
                    <span className="self-start bg-[#D4EE26]/10 text-[#D4EE26] border border-[#D4EE26]/30 px-3 py-1 rounded-full text-xs font-bold mb-4">
                      {servicio.categoria}
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">{servicio.titulo}</h3>
                  {servicio.descripcion_corta && (
                    <p className="text-neutral-400 text-sm mb-6">{servicio.descripcion_corta}</p>
                  )}

                  <div className="flex-grow" />

                  {/* Precio (dinámico según la moneda elegida) */}
                  <div className="pt-4 border-t border-neutral-800/50 mb-5">
                    <p className="text-3xl font-black text-white">
                      {moneda === "ARS" ? "$" : "U$D "}
                      {Number(precio || 0).toLocaleString(moneda === "ARS" ? "es-AR" : "en-US")}
                      <span className="text-xs font-normal text-neutral-500 ml-1">{moneda}</span>
                    </p>
                    {servicio.tiempo_entrega && (
                      <p className="text-xs text-neutral-500 mt-1">Entrega: {servicio.tiempo_entrega}</p>
                    )}
                  </div>

                  {/* Características */}
                  {caracteristicas.length > 0 && (
                    <ul className="space-y-2.5 mb-6">
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
                  )}

                  <Link
                    href={`/servicios/${servicio.id}`}
                    className="mt-auto w-full bg-[#D4EE26] text-black px-5 py-3 rounded-xl font-black hover:bg-[#c2dd22] transition-all flex justify-center items-center gap-2"
                  >
                    Contratar <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
