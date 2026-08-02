"use client";

import { useMemo, useState } from "react";
import { Search, Bell } from "lucide-react";
import type { InitialAdminData, SectionId, UsuarioActual } from "./AdminShell";

type Resultado = { key: string; label: string; sub: string; section: SectionId };

function buscar(initial: InitialAdminData, query: string): Resultado[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const clientes: Resultado[] = initial.clientes
    .filter((c) => (c.nombre || c.email).toLowerCase().includes(q))
    .slice(0, 3)
    .map((c) => ({ key: `cliente-${c.id}`, label: c.nombre || c.email, sub: "Cliente", section: "clientes" }));

  const proyectos: Resultado[] = initial.proyectos
    .filter((p) => p.servicioTitulo.toLowerCase().includes(q) || p.clienteNombre.toLowerCase().includes(q))
    .slice(0, 3)
    .map((p) => ({ key: `proyecto-${p.id}`, label: p.servicioTitulo, sub: p.clienteNombre, section: "proyectos" }));

  const posts: Resultado[] = initial.blogs
    .filter((b) => b.titulo.toLowerCase().includes(q))
    .slice(0, 3)
    .map((b) => ({ key: `post-${b.id}`, label: b.titulo, sub: "Blog", section: "blog" }));

  return [...clientes, ...proyectos, ...posts].slice(0, 6);
}

export function TopBar({
  usuario,
  initial,
  mensajesSinLeer,
  onSelectSection,
}: {
  usuario: UsuarioActual;
  initial: InitialAdminData;
  mensajesSinLeer: number;
  onSelectSection: (id: SectionId) => void;
}) {
  const [query, setQuery] = useState("");
  const resultados = useMemo(() => buscar(initial, query), [initial, query]);

  const iniciales =
    usuario.nombre
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  return (
    <div className="flex shrink-0 items-center gap-[var(--space-4)]">
      <div className="relative hidden w-[280px] md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente, proyecto, post..."
          className="h-11 w-full rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
        />
        {resultados.length > 0 && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[var(--radius-m)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xl">
            {resultados.map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  onSelectSection(r.section);
                  setQuery("");
                }}
                className="flex w-full flex-col px-4 py-2 text-left hover:bg-[var(--surface-card-hover)]"
              >
                <span className="truncate text-sm font-semibold text-[var(--text-primary)]">{r.label}</span>
                <span className="truncate text-xs text-[var(--text-tertiary)]">{r.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onSelectSection("mensajes")}
        aria-label="Notificaciones"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <Bell className="h-[18px] w-[18px]" />
        {mensajesSinLeer > 0 && <span className="absolute right-[9px] top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />}
      </button>

      <div className="flex shrink-0 items-center gap-[10px] rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--surface-card)] py-[6px] pr-[14px] pl-[6px]">
        <div className="tm-display flex h-8 w-8 items-center justify-center rounded-full bg-[var(--black-5)] text-[13px] font-bold text-[var(--accent)]">
          {iniciales}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">{usuario.nombre}</span>
          <span className="text-[11px] capitalize text-[var(--text-tertiary)]">{usuario.rol}</span>
        </div>
      </div>
    </div>
  );
}
