"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AdminTabId =
  | "resumen"
  | "cursos"
  | "servicios"
  | "blog"
  | "recursos"
  | "alumnos"
  | "beneficios"
  | "testimonios"
  | "configuracion"
  | "email";

type NavItem = { id: AdminTabId; label: string; href?: string };

const NAV_ITEMS: NavItem[] = [
  { id: "resumen", label: "📊 Resumen General" },
  { id: "cursos", label: "🎓 Gestionar Cursos" },
  { id: "servicios", label: "🛠️ Gestionar Servicios", href: "/admin/servicios" },
  { id: "blog", label: "📝 CMS del Blog" },
  { id: "recursos", label: "📂 Guías y Recursos" },
  { id: "alumnos", label: "👥 Alumnos" },
  { id: "beneficios", label: "🎁 Beneficios y Promos" },
  { id: "testimonios", label: "💬 Testimonios" },
  { id: "configuracion", label: "⚙️ Configuración" },
  { id: "email", label: "📨 Email Marketing" },
];

type AdminSidebarProps = {
  activeId: AdminTabId;
  // Si se pasa, los ítems sin "href" propio cambian de pestaña en vez de
  // navegar (uso dentro de /admin/dashboard, que maneja todo por estado).
  // Si no se pasa, todos los ítems son links reales y los que no tienen
  // "href" propio apuntan de vuelta a /admin/dashboard (uso en rutas
  // independientes como /admin/servicios).
  onSelectTab?: (id: AdminTabId) => void;
};

export default function AdminSidebar({ activeId, onSelectTab }: AdminSidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [mensajesSinLeer, setMensajesSinLeer] = useState(0);

  useEffect(() => {
    const contarSinLeer = async () => {
      const { count } = await supabase
        .from("mensajes_proyecto")
        .select("id", { count: "exact", head: true })
        .eq("autor_rol", "cliente")
        .eq("leido", false);
      setMensajesSinLeer(count || 0);
    };
    contarSinLeer();

    // Recalcula ante cualquier mensaje nuevo o cualquier marcado como leído
    // (desde acá o desde AlumnosTab, que vive aparte) para que el número
    // del sidebar nunca quede desactualizado.
    const canal = supabase
      .channel("mensajes-proyecto-sidebar-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const handleCerrarSesion = async () => {
    setCerrandoSesion(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <>
      {/* --- CABECERA MÓVIL --- */}
      <div className="md:hidden flex items-center justify-between bg-neutral-900 border-b border-neutral-800 p-4 z-40 sticky top-0">
        <div className="text-xl font-bold tracking-tighter">Tu<span className="text-[#ccff00]">Marketing</span></div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- BARRA LATERAL (ESQUELETO FIJO) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-6 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300`}>
        <div>
          <div className="mb-10 hidden md:block">
            <Link href="/" className="text-2xl font-bold tracking-tighter">Tu<span className="text-[#ccff00]">Marketing</span></Link>
            <span className="block text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">Control Panel v1.0</span>
          </div>
          <nav className="space-y-2 mt-4 md:mt-0">
            {NAV_ITEMS.map((item) => {
              const activo = activeId === item.id;
              const claseComun = `relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activo
                  ? "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`;
              const badge = item.id === "alumnos" && mensajesSinLeer > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                  {mensajesSinLeer > 9 ? "9+" : mensajesSinLeer}
                </span>
              );

              // Ítem con ruta propia (Servicios), o cualquier ítem cuando esta
              // instancia no maneja pestañas (estamos en una página aparte).
              if (item.href || !onSelectTab) {
                return (
                  <Link
                    key={item.id}
                    href={item.href || "/admin/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={claseComun}
                  >
                    {item.label}
                    {badge}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={claseComun}
                >
                  {item.label}
                  {badge}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-800">
          <button
            onClick={handleCerrarSesion}
            disabled={cerrandoSesion}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-400/40 rounded-xl py-2.5 transition-colors disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 12H9m9 0-3-3m3 3-3 3"
              />
            </svg>
            {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
}
