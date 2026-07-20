"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CATEGORIAS_SERVICIOS,
  MODULOS_SERVICIO,
  type EstadoServicio,
  type ModuloServicio,
  type NuevoServicioPayload,
  type Servicio,
} from "@/lib/servicios";

type ResultadoAccion = { error?: string };

type ServicioFormProps = {
  // Si viene, el formulario arranca precargado (modo edición).
  servicioInicial?: Servicio;
  onGuardar: (payload: NuevoServicioPayload) => Promise<ResultadoAccion>;
};

export default function ServicioForm({ servicioInicial, onGuardar }: ServicioFormProps) {
  const router = useRouter();
  const esEdicion = !!servicioInicial;

  const [titulo, setTitulo] = useState(servicioInicial?.titulo ?? "");
  const [categorias, setCategorias] = useState<string[]>(servicioInicial?.categorias ?? []);
  const [estado, setEstado] = useState<EstadoServicio>(servicioInicial?.estado ?? "Borrador");
  const [modulo, setModulo] = useState<ModuloServicio>(servicioInicial?.modulo ?? "otro");

  const [descripcionCorta, setDescripcionCorta] = useState(servicioInicial?.descripcion_corta ?? "");
  const [descripcionDetallada, setDescripcionDetallada] = useState(servicioInicial?.descripcion_detallada ?? "");
  const [tiempoEntrega, setTiempoEntrega] = useState(servicioInicial?.tiempo_entrega ?? "");

  const [precioArs, setPrecioArs] = useState(servicioInicial ? String(servicioInicial.precio_ars) : "");
  const [precioUsd, setPrecioUsd] = useState(servicioInicial ? String(servicioInicial.precio_usd) : "");
  const [miniaturaUrl, setMiniaturaUrl] = useState(servicioInicial?.miniatura_url ?? "");

  const [caracteristicas, setCaracteristicas] = useState<string[]>(servicioInicial?.caracteristicas ?? []);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState("");

  const [destacado, setDestacado] = useState(servicioInicial?.destacado ?? false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const agregarCaracteristica = () => {
    const valor = nuevaCaracteristica.trim();
    if (!valor) return;
    setCaracteristicas((prev) => [...prev, valor]);
    setNuevaCaracteristica("");
  };

  const quitarCaracteristica = (indice: number) => {
    setCaracteristicas((prev) => prev.filter((_, i) => i !== indice));
  };

  const toggleCategoria = (categoria: string) => {
    setCategorias((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (categorias.length === 0) {
      setError("Elegí al menos una categoría.");
      return;
    }

    setGuardando(true);

    const resultado = await onGuardar({
      titulo,
      categorias,
      estado,
      descripcion_corta: descripcionCorta,
      descripcion_detallada: descripcionDetallada,
      tiempo_entrega: tiempoEntrega,
      precio_ars: Number(precioArs) || 0,
      precio_usd: Number(precioUsd) || 0,
      miniatura_url: miniaturaUrl,
      caracteristicas,
      destacado,
      modulo,
    });

    // Si se guardó bien, la Server Action ya redirigió a /admin/servicios.
    if (resultado?.error) {
      setError(resultado.error);
      setGuardando(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-8">
        {/* 1. Info Básica */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
            1. Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Título del Servicio</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                placeholder="Ej: Desarrollo Web a Medida"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                Categorías (elegí una o varias)
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_SERVICIOS.map((c) => {
                  const seleccionada = categorias.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategoria(c)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                        seleccionada
                          ? "bg-[#ccff00] text-black border-[#ccff00]"
                          : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoServicio)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              >
                <option value="Borrador">Borrador</option>
                <option value="Activo">Activo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                Módulo en el Portal de Alumnos
              </label>
              <select
                value={modulo}
                onChange={(e) => setModulo(e.target.value as ModuloServicio)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              >
                {MODULOS_SERVICIO.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.etiqueta}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-2">
                Define qué sección extra ve el cliente en su proyecto (accesos web, calendario de posts, métricas, brand kit).
              </p>
            </div>
          </div>
        </section>

        {/* 2. Detalles y Ventas */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
            2. Detalles y Ventas
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Descripción Corta</label>
              <textarea
                value={descripcionCorta}
                onChange={(e) => setDescripcionCorta(e.target.value)}
                maxLength={160}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-16 resize-none"
                placeholder="Resumen de una línea para tarjetas y listados"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Descripción Detallada</label>
              <textarea
                value={descripcionDetallada}
                onChange={(e) => setDescripcionDetallada(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-40 resize-none"
                placeholder="Explicá en detalle en qué consiste el servicio..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Tiempo de Entrega</label>
              <input
                type="text"
                value={tiempoEntrega}
                onChange={(e) => setTiempoEntrega(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                placeholder="Ej: 2 a 3 semanas"
              />
            </div>
          </div>
        </section>

        {/* 3. Precios e Imagen */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
            3. Precios e Imagen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Precio en ARS ($)</label>
              <input
                type="number"
                required
                value={precioArs}
                onChange={(e) => setPrecioArs(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                placeholder="Ej: 150000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Precio en USD (U$D)</label>
              <input
                type="number"
                required
                value={precioUsd}
                onChange={(e) => setPrecioUsd(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                placeholder="Ej: 300"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">URL de Miniatura</label>
            <input
              type="text"
              value={miniaturaUrl}
              onChange={(e) => setMiniaturaUrl(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              placeholder="https://..."
            />
          </div>
        </section>

        {/* 4. Características (Entregables) */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#ccff00] border-b border-neutral-800 pb-3 mb-6">
            4. Características (Entregables)
          </h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={nuevaCaracteristica}
              onChange={(e) => setNuevaCaracteristica(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarCaracteristica();
                }
              }}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              placeholder="Ej: Diseño UI/UX"
            />
            <button
              type="button"
              onClick={agregarCaracteristica}
              className="shrink-0 bg-white text-black px-5 rounded-xl font-bold text-sm hover:bg-neutral-200 transition"
            >
              Agregar
            </button>
          </div>

          {caracteristicas.length === 0 ? (
            <p className="text-sm text-neutral-500">Todavía no agregaste ninguna característica.</p>
          ) : (
            <ul className="space-y-2">
              {caracteristicas.map((item, indice) => (
                <li
                  key={`${item}-${indice}`}
                  className="flex items-center justify-between gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5"
                >
                  <span className="text-sm text-neutral-200 break-words">{item}</span>
                  <button
                    type="button"
                    onClick={() => quitarCaracteristica(indice)}
                    className="shrink-0 text-red-500 hover:text-red-400 text-xs font-bold"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 5. Destacado */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#ccff00]">5. Destacado</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Los servicios destacados aparecen primero en la página pública.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDestacado(!destacado)}
              className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${
                destacado ? "bg-[#ccff00]" : "bg-neutral-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  destacado ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Acciones */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50"
          >
            {guardando ? "Guardando..." : esEdicion ? "💾 Actualizar Servicio" : "🚀 Guardar Servicio"}
          </button>
        </div>
      </form>
    </>
  );
}
