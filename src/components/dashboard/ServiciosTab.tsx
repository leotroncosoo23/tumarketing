"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Servicio } from "@/lib/servicios";
import { eliminarServicio } from "@/lib/servicios-actions";

type ServiciosTabProps = {
  servicios: Servicio[];
};

export default function ServiciosTab({ servicios }: ServiciosTabProps) {
  const router = useRouter();
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const handleEliminar = async (servicio: Servicio) => {
    if (!confirm(`¿Estás seguro de que querés borrar "${servicio.titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setBorrandoId(servicio.id);
    const resultado = await eliminarServicio(servicio.id);

    if (resultado?.error) {
      alert(resultado.error);
      setBorrandoId(null);
      return;
    }

    router.refresh();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">Gestión de Servicios</h1>
          <p className="text-neutral-400 text-sm">Administrá los servicios profesionales que ofrece la agencia.</p>
        </div>
        <Link
          href="/admin/servicios/nuevo"
          className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          ➕ Nuevo Servicio
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
            Servicios Publicados ({servicios.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-neutral-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">Título del Servicio</th>
                <th className="px-5 py-3 font-bold">Categoría</th>
                <th className="px-5 py-3 font-bold">Precio ARS</th>
                <th className="px-5 py-3 font-bold">Precio USD</th>
                <th className="px-5 py-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-neutral-400">
                    Todavía no hay servicios cargados.
                  </td>
                </tr>
              ) : (
                servicios.map((servicio) => (
                  <tr key={servicio.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{servicio.titulo}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(servicio.categorias ?? []).map((c) => (
                          <span
                            key={c}
                            className="text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-xs whitespace-nowrap"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#ccff00] font-bold whitespace-nowrap">
                      ${Number(servicio.precio_ars || 0).toLocaleString("es-AR")}
                    </td>
                    <td className="px-5 py-4 text-[#ccff00] font-bold whitespace-nowrap">
                      U$D {Number(servicio.precio_usd || 0).toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/servicios/${servicio.id}/editar`}
                          className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-lg"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleEliminar(servicio)}
                          disabled={borrandoId === servicio.id}
                          className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg disabled:opacity-50"
                        >
                          {borrandoId === servicio.id ? "Borrando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
