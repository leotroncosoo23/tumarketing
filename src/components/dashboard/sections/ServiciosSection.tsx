"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Card, Button, Input, Textarea, Select, Badge, StatCard } from "@/components/dashboard/ui";
import { crearServicio, actualizarServicio, eliminarServicio } from "@/lib/servicios-actions";
import {
  CATEGORIAS_SERVICIOS,
  MODULOS_SERVICIO,
  type Servicio,
  type NuevoServicioPayload,
  type EstadoServicio,
} from "@/lib/servicios";

const VACIO: NuevoServicioPayload = {
  titulo: "",
  categorias: [],
  estado: "Borrador",
  descripcion_corta: "",
  descripcion_detallada: "",
  tiempo_entrega: "",
  precio_ars: 0,
  precio_usd: 0,
  miniatura_url: "",
  caracteristicas: [],
  destacado: false,
  modulo: "otro",
};

function servicioADraft(s: Servicio): NuevoServicioPayload {
  return {
    titulo: s.titulo,
    categorias: s.categorias,
    estado: s.estado,
    descripcion_corta: s.descripcion_corta,
    descripcion_detallada: s.descripcion_detallada,
    tiempo_entrega: s.tiempo_entrega,
    precio_ars: s.precio_ars,
    precio_usd: s.precio_usd,
    miniatura_url: s.miniatura_url,
    caracteristicas: s.caracteristicas,
    destacado: s.destacado,
    modulo: s.modulo,
  };
}

export default function ServiciosSection({ initial }: { initial: Servicio[] }) {
  const router = useRouter();
  const [servicios, setServicios] = useState<Servicio[]>(initial);
  const [filtro, setFiltro] = useState<"todos" | EstadoServicio>("todos");
  const [vista, setVista] = useState<"lista" | "editor">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NuevoServicioPayload>(VACIO);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtrados = servicios.filter((s) => filtro === "todos" || s.estado === filtro);

  const abrirNuevo = () => {
    setEditandoId(null);
    setDraft(VACIO);
    setVista("editor");
  };

  const abrirEdicion = (s: Servicio) => {
    setEditandoId(s.id);
    setDraft(servicioADraft(s));
    setVista("editor");
  };

  const guardar = () => {
    setError(null);
    startTransition(async () => {
      const resultado = editandoId ? await actualizarServicio(editandoId, draft) : await crearServicio(draft);
      if (resultado?.error) {
        setError(resultado.error);
        return;
      }
      setVista("lista");
      router.refresh();
    });
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar este servicio? Deja de mostrarse en el sitio público.")) return;
    startTransition(async () => {
      const resultado = await eliminarServicio(id);
      if (resultado?.error) {
        alert(resultado.error);
        return;
      }
      setServicios((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    });
  };

  const toggleCategoria = (cat: string) => {
    setDraft((d) => ({
      ...d,
      categorias: d.categorias.includes(cat) ? d.categorias.filter((c) => c !== cat) : [...d.categorias, cat],
    }));
  };

  if (vista === "editor") {
    return (
      <div>
        <button
          onClick={() => setVista("lista")}
          className="mb-5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Volver al listado
        </button>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card className="flex flex-col gap-4">
            <Input
              label="Nombre del servicio"
              value={draft.titulo}
              onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
            />
            <Textarea
              label="Descripción corta"
              rows={2}
              value={draft.descripcion_corta}
              onChange={(e) => setDraft({ ...draft, descripcion_corta: e.target.value })}
            />
            <Textarea
              label="Descripción detallada"
              rows={5}
              value={draft.descripcion_detallada}
              onChange={(e) => setDraft({ ...draft, descripcion_detallada: e.target.value })}
            />
            <Textarea
              label="Características (una por línea)"
              rows={5}
              value={draft.caracteristicas.join("\n")}
              onChange={(e) => setDraft({ ...draft, caracteristicas: e.target.value.split("\n").filter(Boolean) })}
            />
            <div>
              <span className="mb-2 block text-[var(--fs-body-s)] font-medium text-[var(--text-secondary)]">
                Categorías
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_SERVICIOS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategoria(cat)}
                    className={`rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      draft.categorias.includes(cat)
                        ? "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "border-[var(--border-subtle)] text-[var(--text-tertiary)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-4">
              <Select
                label="Módulo del portal"
                value={draft.modulo}
                onChange={(e) => setDraft({ ...draft, modulo: e.target.value as NuevoServicioPayload["modulo"] })}
              >
                {MODULOS_SERVICIO.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.etiqueta}
                  </option>
                ))}
              </Select>
              <Input
                label="Tiempo de entrega"
                value={draft.tiempo_entrega}
                onChange={(e) => setDraft({ ...draft, tiempo_entrega: e.target.value })}
                placeholder="Ej: 7 días hábiles"
              />
              <Input
                label="Precio ARS"
                type="number"
                value={draft.precio_ars}
                onChange={(e) => setDraft({ ...draft, precio_ars: Number(e.target.value) })}
              />
              <Input
                label="Precio USD"
                type="number"
                value={draft.precio_usd}
                onChange={(e) => setDraft({ ...draft, precio_usd: Number(e.target.value) })}
              />
              <Input
                label="Imagen (URL)"
                value={draft.miniatura_url}
                onChange={(e) => setDraft({ ...draft, miniatura_url: e.target.value })}
              />
              <Select
                label="Estado"
                value={draft.estado}
                onChange={(e) => setDraft({ ...draft, estado: e.target.value as EstadoServicio })}
              >
                <option value="Borrador">Borrador</option>
                <option value="Activo">Activo</option>
              </Select>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={draft.destacado}
                  onChange={(e) => setDraft({ ...draft, destacado: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Destacado en el sitio
              </label>
            </Card>
            {error && <p className="text-sm text-[var(--signal-error)]">{error}</p>}
            <Button onClick={guardar} disabled={pending || !draft.titulo.trim()}>
              {pending ? "Guardando..." : "Guardar servicio"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const publicados = servicios.filter((s) => s.estado === "Activo").length;
  const enBorrador = servicios.filter((s) => s.estado === "Borrador").length;
  const categorias = new Set(servicios.flatMap((s) => s.categorias)).size;

  const ETIQUETA_FILTRO: Record<"todos" | EstadoServicio, string> = {
    todos: "Todos",
    Activo: "Publicado",
    Borrador: "Borrador",
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="tm-display text-2xl font-bold text-[var(--text-primary)]">Servicios</h1>
          <p className="text-[var(--text-secondary)]">Los packs y servicios que se muestran en el sitio público.</p>
        </div>
      </div>

      <div className="mb-[28px] grid grid-cols-2 gap-[var(--space-5)] lg:grid-cols-4">
        <StatCard label="Publicados" value={publicados} />
        <StatCard label="En borrador" value={enBorrador} />
        <StatCard label="Categorías" value={categorias} />
        <StatCard label="Total en el sitio" value={servicios.length} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-[10px]">
          {(["todos", "Activo", "Borrador"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-[16px] py-[8px] [font-size:13px] [font-weight:600] transition-colors ${
                filtro === f ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--black-3)] text-[var(--text-secondary)]"
              }`}
            >
              {ETIQUETA_FILTRO[f]}
            </button>
          ))}
        </div>
        <Button onClick={abrirNuevo} className="!text-[var(--black-1)]">
          + Nuevo servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtrados.map((s) => (
          <Card key={s.id}>
            <div className="mb-[10px] flex items-start justify-between gap-2">
              <div>
                <span className="uppercase text-[var(--text-tertiary)] [font-size:12px] tracking-[var(--ls-eyebrow)]">
                  {s.categorias[0] || "Servicio"}
                </span>
                <p className="tm-display mt-[2px] font-bold text-[var(--text-primary)] [font-size:17px]">{s.titulo}</p>
              </div>
              <Badge tone={s.estado === "Activo" ? "lime" : "gray"}>
                {s.estado === "Activo" ? "Publicado" : "Borrador"}
              </Badge>
            </div>
            <p className="mb-3 text-[var(--text-secondary)] [font-size:13px] leading-[var(--lh-body)]">
              {s.descripcion_corta}
            </p>
            {s.caracteristicas.length > 0 && (
              <div className="mb-[14px] text-[var(--text-tertiary)] [font-size:12px]">
                {s.caracteristicas.join(" · ")}
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
              <span className="tm-display font-bold text-[var(--accent)] [font-size:15px]">
                ${s.precio_ars.toLocaleString("es-AR")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirEdicion(s)}
                  aria-label="Editar servicio"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-3)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-[14px] w-[14px]" />
                </button>
                <button
                  onClick={() => eliminar(s.id)}
                  aria-label="Eliminar servicio"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-3)] text-[var(--text-secondary)] transition-colors hover:text-[var(--signal-error)]"
                >
                  <Trash2 className="h-[14px] w-[14px]" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <p className="col-span-2 py-10 text-center text-[var(--text-tertiary)]">No hay servicios con este filtro.</p>
        )}
      </div>
    </div>
  );
}
