"use client";

import { useMemo, useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { Sheet } from "./Sheet";
import { SECCIONES } from "./secciones";
import type { InitialAdminData, SectionId } from "../AdminShell";

type Resultado = { key: string; label: string; sub: string; section: SectionId; tipo: "seccion" | "persona" | "item" };

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function buscar(initial: InitialAdminData, query: string): Resultado[] {
  const q = normalizar(query.trim());
  if (q.length < 2) return [];
  const coincide = (s: string | null | undefined) => normalizar(s || "").includes(q);

  const secciones: Resultado[] = Object.values(SECCIONES)
    .filter((s) => coincide(s.label) || coincide(s.descripcion))
    .map((s) => ({ key: `s-${s.id}`, label: s.label, sub: s.descripcion, section: s.id, tipo: "seccion" }));

  const clientes: Resultado[] = initial.clientes
    .filter((c) => coincide(c.nombre) || coincide(c.email))
    .slice(0, 5)
    .map((c) => ({ key: `c-${c.id}`, label: c.nombre || c.email, sub: `Cliente · ${c.plan || c.email}`, section: "clientes", tipo: "persona" }));

  const proyectos: Resultado[] = initial.proyectos
    .filter((p) => coincide(p.servicioTitulo) || coincide(p.clienteNombre))
    .slice(0, 5)
    .map((p) => ({ key: `p-${p.id}`, label: p.servicioTitulo, sub: `Proyecto · ${p.clienteNombre}`, section: "proyectos", tipo: "item" }));

  const servicios: Resultado[] = initial.servicios
    .filter((s) => coincide(s.titulo))
    .slice(0, 3)
    .map((s) => ({ key: `sv-${s.id}`, label: s.titulo, sub: "Servicio", section: "servicios", tipo: "item" }));

  const posts: Resultado[] = initial.blogs
    .filter((b) => coincide(b.titulo))
    .slice(0, 3)
    .map((b) => ({ key: `b-${b.id}`, label: b.titulo, sub: `Blog · ${b.estado}`, section: "blog", tipo: "item" }));

  return [...secciones, ...clientes, ...proyectos, ...servicios, ...posts].slice(0, 14);
}

const ATAJOS: SectionId[] = ["clientes", "proyectos", "mensajes", "blog", "facturacion", "calendario"];

export function BuscarSheet({
  abierto,
  onCerrar,
  initial,
  onIr,
}: {
  abierto: boolean;
  onCerrar: () => void;
  initial: InitialAdminData;
  onIr: (id: SectionId) => void;
}) {
  const [query, setQuery] = useState("");
  const resultados = useMemo(() => buscar(initial, query), [initial, query]);

  const ir = (id: SectionId) => {
    onIr(id);
    setQuery("");
    onCerrar();
  };

  return (
    <Sheet abierto={abierto} onCerrar={onCerrar} titulo="Buscar">
      <div className="px-5 pb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Clientes, proyectos, posts, secciones…"
            className="h-11 w-full rounded-[12px] bg-[var(--black-4)] pl-10 pr-10 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-1 focus:ring-[var(--border-focus)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Borrar búsqueda"
              className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gray-4)] text-[var(--black-1)]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)]">
        {query.trim().length < 2 ? (
          <div className="px-5 pt-4">
            <p className="mb-3 text-[15px] font-bold text-[var(--text-primary)]">Accesos rápidos</p>
            <div className="flex flex-col">
              {ATAJOS.map((id) => {
                const s = SECCIONES[id];
                const Icono = s.icon;
                return (
                  <button
                    key={id}
                    onClick={() => ir(id)}
                    className="-mx-2 flex items-center gap-3 rounded-[12px] px-2 py-2.5 text-left transition-colors hover:bg-[var(--black-3)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)]">
                      <Icono className="h-5 w-5 text-[var(--text-primary)]" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] font-semibold text-[var(--text-primary)]">{s.label}</span>
                      <span className="block text-[13px] text-[var(--text-tertiary)]">{s.descripcion}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : resultados.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-[var(--text-tertiary)]">Sin resultados para “{query}”.</p>
        ) : (
          <div className="flex flex-col px-3 pt-2">
            {resultados.map((r) => {
              const Icono = SECCIONES[r.section].icon;
              return (
                <button
                  key={r.key}
                  onClick={() => ir(r.section)}
                  className="flex items-center gap-3 rounded-[12px] px-2 py-2 text-left transition-colors hover:bg-[var(--black-3)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--black-4)]">
                    <Icono className="h-[18px] w-[18px] text-[var(--text-primary)]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-[var(--text-primary)]">{r.label}</span>
                    <span className="block truncate text-[13px] text-[var(--text-tertiary)]">{r.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Sheet>
  );
}
