"use client";

import { createContext, useContext, useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Home,
  TrendingUp,
  Code2,
  MessageCircle,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Users,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUsuarioSession } from "@/lib/useUsuarioSession";
import { iniciales } from "@/lib/iniciales";
import type { PerfilUsuario } from "@/lib/usuarios";

type UsuarioPortalContextValue = {
  perfil: PerfilUsuario;
  usuario: User | null;
  mensajesSinLeer: number;
};

const UsuarioPortalContext = createContext<UsuarioPortalContextValue | null>(null);

// Todas las páginas del portal (Dashboard, Mensajes, Reportes, Facturación,
// Configuración) leen el perfil de acá en vez de llamar a useUsuarioSession
// de nuevo — evita repetir la verificación de sesión y el redirect en cada una.
export function useUsuarioPortal() {
  const contexto = useContext(UsuarioPortalContext);
  if (!contexto) throw new Error("useUsuarioPortal debe usarse dentro del layout de /usuarios");
  return contexto;
}

type ItemNav = {
  href: string;
  label: string;
  Icon: LucideIcon;
  activo: (pathname: string, tab: string | null) => boolean;
};

// "Marketing" y "Programación" son en realidad la página de Dashboard con un
// filtro (?tab=) aplicado — igual que en el diseño, donde click en esos dos
// ítems te deja en el mismo Dashboard pero con la categoría de servicio
// seleccionada. Por eso "Dashboard" queda activo en simultáneo con cualquiera
// de los dos.
const NAV_ITEMS: ItemNav[] = [
  { href: "/usuarios", label: "Dashboard", Icon: Home, activo: (p) => p === "/usuarios" },
  { href: "/usuarios?tab=marketing", label: "Marketing", Icon: TrendingUp, activo: (p, t) => p === "/usuarios" && t === "marketing" },
  { href: "/usuarios?tab=programacion", label: "Programación", Icon: Code2, activo: (p, t) => p === "/usuarios" && t === "programacion" },
  { href: "/usuarios/mensajes", label: "Mensajes", Icon: MessageCircle, activo: (p) => p.startsWith("/usuarios/mensajes") },
  { href: "/usuarios/reportes", label: "Reportes", Icon: BarChart3, activo: (p) => p.startsWith("/usuarios/reportes") },
  { href: "/usuarios/facturacion", label: "Facturación", Icon: CreditCard, activo: (p) => p.startsWith("/usuarios/facturacion") },
  { href: "/usuarios/configuracion", label: "Configuración", Icon: Settings, activo: (p) => p.startsWith("/usuarios/configuracion") },
];

function PortalLayoutInterno({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabActual = searchParams.get("tab");
  const { perfil, usuario, cargando } = useUsuarioSession();

  const [config, setConfig] = useState<{ whatsapp_numero: string; whatsapp_comunidad_url: string; discord_url: string } | null>(null);
  const [mensajesSinLeer, setMensajesSinLeer] = useState(0);
  const idsServiciosRef = useRef<string[]>([]);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [colapsado, setColapsado] = useState(false);

  const contarMensajesSinLeer = async () => {
    const ids = idsServiciosRef.current;
    if (ids.length === 0) {
      setMensajesSinLeer(0);
      return;
    }
    const { count } = await supabase
      .from("mensajes_proyecto")
      .select("id", { count: "exact", head: true })
      .eq("autor_rol", "admin")
      .eq("leido", false)
      .in("servicio_contratado_id", ids);
    setMensajesSinLeer(count || 0);
  };

  useEffect(() => {
    const canal = supabase
      .channel("mensajes-proyecto-sidebar-usuario")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, contarMensajesSinLeer)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mensajes_proyecto" }, contarMensajesSinLeer)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  useEffect(() => {
    if (!perfil) return;

    const fetchIdsServicios = async () => {
      const { data } = await supabase.from("servicios_contratados").select("id").eq("usuario_id", perfil.id);
      idsServiciosRef.current = (data || []).map((sc) => sc.id);
      await contarMensajesSinLeer();
    };
    fetchIdsServicios();

    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracion")
        .select("whatsapp_numero, whatsapp_comunidad_url, discord_url")
        .eq("id", 1)
        .single();
      setConfig(data || null);
    };
    fetchConfig();
  }, [perfil]);

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }
  if (!perfil) return null;

  const whatsappConsultaLimpio = (config?.whatsapp_numero || "").replace(/\D/g, "");
  const linkConsulta = whatsappConsultaLimpio
    ? `https://wa.me/${whatsappConsultaLimpio}?text=${encodeURIComponent("Hola! Tengo una consulta sobre mi servicio 🙋")}`
    : null;
  const linkAsesoria = whatsappConsultaLimpio
    ? `https://wa.me/${whatsappConsultaLimpio}?text=${encodeURIComponent("Hola! Quiero agendar una asesoría con el equipo 🗓️")}`
    : null;

  const avatarUrl = usuario?.user_metadata?.avatar_url as string | undefined;
  const nombreMostrado = perfil.nombre || perfil.email;

  return (
    <UsuarioPortalContext.Provider value={{ perfil, usuario, mensajesSinLeer }}>
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex overflow-x-hidden">
        {menuAbierto && (
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMenuAbierto(false)} />
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 ${
            menuAbierto ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative ${colapsado ? "md:w-20" : "md:w-64"} w-64 p-4`}
        >
          <div>
            <div className={`flex items-center mb-6 px-1 pt-1 ${colapsado ? "justify-center" : "justify-between"}`}>
              <Link href="/" className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-[#ccff00] text-black flex items-center justify-center font-black text-xs shrink-0">
                  TM
                </span>
                {!colapsado && (
                  <span className="font-black text-sm tracking-wide uppercase text-white truncate">Tu Marketing.</span>
                )}
              </Link>
              {!colapsado && (
                <button onClick={() => setMenuAbierto(false)} className="md:hidden text-neutral-500 hover:text-white p-1 shrink-0">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setColapsado(!colapsado)}
              className="hidden md:flex items-center justify-center w-9 h-9 mx-auto mb-5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label={colapsado ? "Expandir menú" : "Colapsar menú"}
            >
              {colapsado ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const activo = item.activo(pathname, tabActual);
                const Icono = item.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuAbierto(false)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                      activo ? "bg-[#ccff00] text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <span className="relative shrink-0">
                      <Icono className="w-5 h-5" />
                      {item.href === "/usuarios/mensajes" && mensajesSinLeer > 0 && (
                        <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-black text-[#ccff00] text-[9px] font-black flex items-center justify-center">
                          {mensajesSinLeer > 9 ? "9+" : mensajesSinLeer}
                        </span>
                      )}
                    </span>
                    {!colapsado && <span className="text-sm">{item.label}</span>}
                  </Link>
                );
              })}

              {linkAsesoria && (
                <a
                  href={linkAsesoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                >
                  <Calendar className="w-5 h-5 shrink-0" />
                  {!colapsado && <span className="font-medium text-sm">Agendar Asesoría</span>}
                </a>
              )}

              <div className="border-t border-neutral-800 my-3" />

              {linkConsulta && (
                <a
                  href={linkConsulta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  {!colapsado && <span className="font-medium text-sm">Soporte</span>}
                </a>
              )}

              {config?.whatsapp_comunidad_url && (
                <a
                  href={config.whatsapp_comunidad_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                >
                  <Users className="w-5 h-5 shrink-0" />
                  {!colapsado && <span className="font-medium text-sm">Grupo WhatsApp</span>}
                </a>
              )}

              {config?.discord_url && (
                <a
                  href={config.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                >
                  <Gamepad2 className="w-5 h-5 shrink-0" />
                  {!colapsado && <span className="font-medium text-sm">Discord</span>}
                </a>
              )}
            </nav>
          </div>

          <button
            onClick={handleCerrarSesion}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!colapsado && <span className="font-medium text-sm">Cerrar sesión</span>}
          </button>
        </aside>

        {/* CONTENIDO */}
        <div className="flex-grow flex flex-col min-w-0">
          <header className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-neutral-900 sticky top-0 bg-neutral-950/95 backdrop-blur z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuAbierto(true)} className="md:hidden text-white p-1 -ml-1">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg md:text-xl font-black">Panel de cliente</h1>
            </div>

            <div className="flex items-center gap-5">
              <Link href="/usuarios/facturacion" className="hidden sm:block text-sm font-semibold text-neutral-300 hover:text-[#ccff00] transition-colors">
                Facturación
              </Link>
              {linkConsulta ? (
                <a href={linkConsulta} target="_blank" rel="noopener noreferrer" className="hidden sm:block text-sm font-semibold text-neutral-300 hover:text-[#ccff00] transition-colors">
                  Soporte
                </a>
              ) : (
                <Link href="/usuarios/mensajes" className="hidden sm:block text-sm font-semibold text-neutral-300 hover:text-[#ccff00] transition-colors">
                  Soporte
                </Link>
              )}

            <div className="relative group py-2">
              <button className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-xs font-bold text-[#ccff00] overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    iniciales(nombreMostrado)
                  )}
                </span>
                <svg className="w-4 h-4 text-neutral-500 group-hover:rotate-180 transition-transform hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-0 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden z-10">
                <span className="px-4 py-3 text-xs text-neutral-500 truncate border-b border-neutral-800">{perfil.email}</span>
                <button onClick={handleCerrarSesion} className="px-4 py-3 text-left hover:bg-neutral-800 hover:text-red-400 transition-colors text-sm">
                  Cerrar sesión
                </button>
              </div>
            </div>
            </div>
          </header>

          <main className="flex-grow p-5 md:p-10">{children}</main>
        </div>
      </div>
    </UsuarioPortalContext.Provider>
  );
}

// useSearchParams exige un límite de Suspense alrededor suyo en el App Router.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-neutral-950" />}>
      <PortalLayoutInterno>{children}</PortalLayoutInterno>
    </Suspense>
  );
}
