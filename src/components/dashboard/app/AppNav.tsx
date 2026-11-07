"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LayoutGrid, LogOut, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GRUPOS, SECCIONES, TABS_CELULAR } from "./secciones";
import type { SectionId } from "../AdminShell";

type NavProps = {
  activa: SectionId;
  masAbierto: boolean;
  mensajesSinLeer: number;
  onIr: (id: SectionId) => void;
  onAbrirMas: () => void;
  onAbrirBuscar: () => void;
};

function Badge({ n, className = "" }: { n: number; className?: string }) {
  if (n <= 0) return null;
  return (
    <span
      className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold leading-none text-[var(--accent-contrast)] ${className}`}
    >
      {n > 9 ? "9+" : n}
    </span>
  );
}

// ─── Menú lateral (compu) ──────────────────────────────────────────────────
// Agrupado por áreas y colapsable a solo íconos.
export function AppSidebar({ activa, mensajesSinLeer, onIr }: NavProps) {
  const router = useRouter();
  const [colapsado, setColapsado] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    setSaliendo(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-page)] py-5 transition-[width] duration-200 md:flex ${
        colapsado ? "w-[76px] px-3" : "w-[248px] px-4"
      }`}
    >
      <div className={`mb-6 flex items-center ${colapsado ? "justify-center" : "justify-between px-2"}`}>
        {!colapsado && (
          <Link href="/" className="tm-display text-lg font-bold text-[var(--text-primary)]">
            Tu<span className="text-[var(--accent)]">Marketing</span>
          </Link>
        )}
        <button
          onClick={() => setColapsado((v) => !v)}
          aria-label={colapsado ? "Expandir menú" : "Colapsar menú"}
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-s)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--black-4)] hover:text-[var(--text-primary)]"
        >
          {colapsado ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <nav className="tm-sin-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo} className="flex flex-col gap-0.5">
            {colapsado ? (
              <span className="mx-auto mb-1 h-px w-6 bg-[var(--border-subtle)]" />
            ) : (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{grupo.titulo}</p>
            )}
            {grupo.ids.map((id) => {
              const s = SECCIONES[id];
              const Icono = s.icon;
              const activo = activa === id;
              const badge = id === "mensajes" ? mensajesSinLeer : 0;
              return (
                <button
                  key={id}
                  onClick={() => onIr(id)}
                  title={colapsado ? s.label : undefined}
                  className={`relative flex items-center gap-3 rounded-[var(--radius-m)] px-3 py-[10px] text-left text-[14px] transition-colors ${
                    colapsado ? "justify-center" : ""
                  } ${
                    activo
                      ? "bg-[var(--accent)] font-bold text-[var(--accent-contrast)]"
                      : "font-medium text-[var(--text-secondary)] hover:bg-[var(--black-4)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icono className="h-[18px] w-[18px] shrink-0" />
                  {!colapsado && <span className="flex-1">{s.label}</span>}
                  {colapsado ? (
                    badge > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  ) : (
                    <Badge n={badge} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        onClick={salir}
        disabled={saliendo}
        title={colapsado ? "Salir" : undefined}
        className={`mt-3 flex items-center gap-3 border-t border-[var(--border-subtle)] px-3 pt-4 text-[14px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--signal-error)] disabled:opacity-50 ${
          colapsado ? "justify-center" : ""
        }`}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!colapsado && <span>{saliendo ? "Cerrando sesión..." : "Salir"}</span>}
      </button>
    </aside>
  );
}

// ─── Barra superior (celular) ──────────────────────────────────────────────
export function AppHeader({ activa, onAbrirBuscar }: NavProps) {
  const enInicio = activa === "dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface-page)]/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:hidden">
      <div className="flex h-[56px] items-center justify-between gap-3 px-4">
        {enInicio ? (
          <span className="tm-display text-[20px] font-bold text-[var(--text-primary)]">
            Tu<span className="text-[var(--accent)]">Marketing</span>
          </span>
        ) : (
          <button onClick={() => window.history.back()} className="-ml-1.5 flex min-w-0 items-center gap-1" aria-label="Volver">
            <ChevronLeft className="h-6 w-6 shrink-0 text-[var(--text-secondary)]" />
            <span className="tm-display truncate text-[18px] font-bold text-[var(--text-primary)]">{SECCIONES[activa].label}</span>
          </button>
        )}
        <button
          onClick={onAbrirBuscar}
          aria-label="Buscar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--black-3)] text-[var(--text-primary)] active:scale-95"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

// ─── Barra inferior (celular) ──────────────────────────────────────────────
function Boton({ activo, label, onClick, children }: { activo: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-current={activo ? "page" : undefined}
      className="relative flex flex-1 flex-col items-center justify-center gap-1 pt-1 transition-transform active:scale-95"
    >
      <span
        className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
          activo ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-secondary)]"
        }`}
      >
        {children}
      </span>
      <span className={`text-[11px] leading-none ${activo ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>{label}</span>
    </button>
  );
}

export function AppTabBar({ activa, masAbierto, mensajesSinLeer, onIr, onAbrirMas }: NavProps) {
  const enMas = masAbierto || !TABS_CELULAR.includes(activa);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--surface-page)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex h-[64px] items-stretch px-1">
        {TABS_CELULAR.map((id) => {
          const s = SECCIONES[id];
          const Icono = s.icon;
          const activo = !masAbierto && activa === id;
          return (
            <Boton key={id} activo={activo} label={s.label} onClick={() => onIr(id)}>
              <span className="relative">
                <Icono className="h-[21px] w-[21px]" strokeWidth={activo ? 2.4 : 2} />
                {id === "mensajes" && <Badge n={mensajesSinLeer} className="absolute -right-3 -top-2 border-2 border-[var(--surface-page)]" />}
              </span>
            </Boton>
          );
        })}
        <Boton activo={enMas} label={enMas && !masAbierto ? SECCIONES[activa].label : "Más"} onClick={onAbrirMas}>
          <LayoutGrid className="h-[21px] w-[21px]" strokeWidth={enMas ? 2.4 : 2} />
        </Boton>
      </div>
    </nav>
  );
}
