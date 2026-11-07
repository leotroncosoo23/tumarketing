"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Search, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Sheet } from "./Sheet";
import { GRUPOS, SECCIONES } from "./secciones";
import type { SectionId, UsuarioActual } from "../AdminShell";

// Panel "Más" del celular: todas las secciones en una grilla de íconos,
// agrupadas, más las acciones de cuenta.
export function MasSheet({
  abierto,
  onCerrar,
  usuario,
  activa,
  mensajesSinLeer,
  onIr,
  onBuscar,
  onInstalar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  usuario: UsuarioActual;
  activa: SectionId;
  mensajesSinLeer: number;
  onIr: (id: SectionId) => void;
  onBuscar: () => void;
  onInstalar: (() => void) | null;
}) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    setSaliendo(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Sheet abierto={abierto} onCerrar={onCerrar} titulo="Menú">
      <div className="px-5 pb-4">
        <button
          onClick={onBuscar}
          className="flex h-11 w-full items-center gap-2.5 rounded-[12px] bg-[var(--black-4)] px-3.5 text-left text-[15px] text-[var(--text-tertiary)]"
        >
          <Search className="h-4 w-4" />
          Buscar clientes, proyectos, posts…
        </button>
      </div>

      {GRUPOS.map((grupo) => (
        <section key={grupo.titulo} className="px-5 pb-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{grupo.titulo}</p>
          <div className="grid grid-cols-3 gap-2.5">
            {grupo.ids.map((id) => {
              const s = SECCIONES[id];
              const Icono = s.icon;
              const esActiva = id === activa;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onIr(id);
                    onCerrar();
                  }}
                  className={`relative flex flex-col items-center gap-2 rounded-[16px] border px-2 py-3.5 transition-colors active:scale-[0.97] ${
                    esActiva
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border-subtle)] bg-[var(--black-3)] hover:bg-[var(--black-4)]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${
                      esActiva ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--black-5)] text-[var(--text-primary)]"
                    }`}
                  >
                    <Icono className="h-5 w-5" />
                  </span>
                  <span className="text-center text-[12.5px] font-semibold leading-tight text-[var(--text-primary)]">{s.label}</span>
                  {id === "mensajes" && mensajesSinLeer > 0 && (
                    <span className="absolute right-2 top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-contrast)]">
                      {mensajesSinLeer > 9 ? "9+" : mensajesSinLeer}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mx-5 border-t border-[var(--border-subtle)] pt-3">
        <p className="py-2 text-[13px] text-[var(--text-tertiary)]">
          Sesión iniciada como <span className="font-semibold text-[var(--text-primary)]">{usuario.nombre}</span>{" "}
          <span className="capitalize">({usuario.rol})</span>
        </p>
        {onInstalar && (
          <button onClick={onInstalar} className="flex w-full items-center gap-3 py-3 text-left">
            <Smartphone className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-[15px] font-semibold text-[var(--accent)]">Instalar como app en el celular</span>
          </button>
        )}
        <Link href="/" target="_blank" className="flex w-full items-center gap-3 py-3">
          <ExternalLink className="h-5 w-5 text-[var(--text-secondary)]" />
          <span className="text-[15px] text-[var(--text-primary)]">Ver el sitio</span>
        </Link>
        <button onClick={salir} disabled={saliendo} className="flex w-full items-center gap-3 py-3 text-left disabled:opacity-50">
          <LogOut className="h-5 w-5 text-[var(--signal-error)]" />
          <span className="text-[15px] text-[var(--signal-error)]">{saliendo ? "Cerrando sesión…" : "Cerrar sesión"}</span>
        </button>
      </section>
    </Sheet>
  );
}
