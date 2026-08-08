"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Tag,
  MessageSquare,
  Newspaper,
  Gift,
  BarChart3,
  Receipt,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SectionId } from "./AdminShell";

type NavItem = { id: SectionId; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { id: "clientes", label: "Clientes", icon: <Users className="h-[18px] w-[18px]" /> },
  { id: "proyectos", label: "Proyectos", icon: <Briefcase className="h-[18px] w-[18px]" /> },
  { id: "servicios", label: "Servicios", icon: <Wrench className="h-[18px] w-[18px]" /> },
  { id: "promociones", label: "Promociones", icon: <Tag className="h-[18px] w-[18px]" /> },
  { id: "mensajes", label: "Mensajes", icon: <MessageSquare className="h-[18px] w-[18px]" /> },
  { id: "blog", label: "Blog", icon: <Newspaper className="h-[18px] w-[18px]" /> },
  { id: "recursos", label: "Recursos", icon: <Gift className="h-[18px] w-[18px]" /> },
  { id: "reportes", label: "Reportes", icon: <BarChart3 className="h-[18px] w-[18px]" /> },
  { id: "facturacion", label: "Facturación", icon: <Receipt className="h-[18px] w-[18px]" /> },
  { id: "calendario", label: "Calendario", icon: <CalendarDays className="h-[18px] w-[18px]" /> },
  { id: "configuracion", label: "Configuración", icon: <Settings className="h-[18px] w-[18px]" /> },
];

export function AdminSidebarV2({
  activeId,
  onSelect,
  mensajesSinLeer,
}: {
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
  mensajesSinLeer: number;
}) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const handleCerrarSesion = async () => {
    setCerrandoSesion(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-page)] p-4 md:hidden">
        <Link href="/" className="tm-display text-lg font-bold text-[var(--text-primary)]">
          Tu<span className="text-[var(--accent)]">Marketing</span>
        </Link>
        <button onClick={() => setMenuAbierto((v) => !v)} className="text-[var(--text-primary)]">
          {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col justify-between overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--surface-page)] px-[14px] py-[20px] transition-[width] duration-[180ms] ease-out md:relative md:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        } ${colapsado ? "md:w-[76px]" : ""}`}
      >
        <div className="flex flex-col gap-[var(--space-6)]">
          <div className="hidden items-center gap-[10px] px-[4px] py-[4px] md:flex">
            <Link href="/" className={`shrink-0 ${colapsado ? "md:hidden" : ""}`}>
              <span className="tm-display text-lg font-bold text-[var(--text-primary)]">
                Tu<span className="text-[var(--accent)]">Marketing</span>
              </span>
            </Link>
          </div>

          <button
            onClick={() => setColapsado((v) => !v)}
            aria-label="Colapsar menú"
            className="hidden h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-3)] text-[var(--text-secondary)] md:flex"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const activo = activeId === item.id;
              const noLeidos = item.id === "mensajes" && mensajesSinLeer > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setMenuAbierto(false);
                  }}
                  className={`flex items-center gap-[12px] rounded-[var(--radius-m)] px-[14px] py-[11px] text-left [font-size:14px] transition-colors ${
                    activo
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)] [font-weight:700]"
                      : "bg-transparent text-[var(--text-secondary)] [font-weight:500] hover:bg-[var(--black-4)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.icon}
                  <span className={`flex-1 ${colapsado ? "md:hidden" : ""}`}>{item.label}</span>
                  {noLeidos && (
                    <span
                      className={`ml-auto rounded-[var(--radius-pill)] bg-[var(--accent)] px-[7px] py-[2px] [font-size:11px] [font-weight:700] text-[var(--accent-contrast)] ${
                        colapsado ? "md:hidden" : ""
                      }`}
                    >
                      {mensajesSinLeer > 9 ? "9+" : mensajesSinLeer}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleCerrarSesion}
          disabled={cerrandoSesion}
          className="flex items-center gap-[10px] border-t border-[var(--border-subtle)] px-[10px] py-[12px] [font-size:14px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--signal-error)] disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={colapsado ? "md:hidden" : ""}>{cerrandoSesion ? "Cerrando sesión..." : "Salir"}</span>
        </button>
      </aside>
    </>
  );
}
