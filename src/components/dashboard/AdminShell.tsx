"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { ClienteResumen, ConversacionResumen, ProyectoResumen, FacturacionMensual } from "@/lib/dashboard-queries";
import type { Servicio } from "@/lib/servicios";
import { TopBar } from "./TopBar";
import { AppHeader, AppSidebar, AppTabBar } from "./app/AppNav";
import { BuscarSheet } from "./app/BuscarSheet";
import { MasSheet } from "./app/MasSheet";
import { CON_TITULO_PROPIO, SECCIONES } from "./app/secciones";
import DashboardSection from "./sections/DashboardSection";
import ClientesSection from "./sections/ClientesSection";
import ProyectosSection from "./sections/ProyectosSection";
import ServiciosSection from "./sections/ServiciosSection";
import PromocionesSection from "./sections/PromocionesSection";
import MensajesSection from "./sections/MensajesSection";
import BlogSection from "./sections/BlogSection";
import RecursosSection, { type Recurso } from "./sections/RecursosSection";
import ReportesSection from "./sections/ReportesSection";
import FacturacionSection from "./sections/FacturacionSection";
import CalendarioSection from "./sections/CalendarioSection";
import ConfiguracionSection from "./sections/ConfiguracionSection";
export type SectionId =
  | "dashboard"
  | "clientes"
  | "proyectos"
  | "servicios"
  | "promociones"
  | "mensajes"
  | "blog"
  | "recursos"
  | "reportes"
  | "facturacion"
  | "calendario"
  | "configuracion";

export type Cupon = {
  id: string;
  codigo: string;
  tipo_descuento: string;
  valor: number;
  limite_usos: number | null;
  usos_actuales: number;
  fecha_vencimiento: string | null;
  activo: boolean;
  creado_en?: string;
};

export type Blog = {
  id: string;
  titulo: string;
  slug: string;
  autor: string | null;
  resumen: string;
  contenido: string;
  imagen_url: string | null;
  categoria: string;
  estado: string;
  creado_en: string;
  vistas?: number | null;
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
  tags?: string | null;
  fecha_programada?: string | null;
};

export type InitialAdminData = {
  clientes: ClienteResumen[];
  proyectos: ProyectoResumen[];
  conversaciones: ConversacionResumen[];
  servicios: Servicio[];
  cupones: Cupon[];
  blogs: Blog[];
  recursos: Recurso[];
  facturacionMensual: FacturacionMensual;
};

export type UsuarioActual = {
  nombre: string;
  rol: string;
};

// Evento que dispara Chrome/Android cuando el panel se puede instalar como app.
type EventoInstalacion = Event & { prompt: () => Promise<void> };

const ESTADO_HISTORIAL = "tmSeccion";

export default function AdminShell({ initial, usuario }: { initial: InitialAdminData; usuario: UsuarioActual }) {
  const [section, setSection] = useState<SectionId>("dashboard");
  const [hoja, setHoja] = useState<"mas" | "buscar" | null>(null);
  const [mensajesSinLeer, setMensajesSinLeer] = useState(0);
  const [eventoInstalar, setEventoInstalar] = useState<EventoInstalacion | null>(null);

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

    const canal = supabase
      .channel("mensajes-proyecto-admin-shell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  // Cada sección queda en el historial del navegador: el botón "atrás" del
  // celular vuelve a la sección anterior en vez de salir del panel.
  useEffect(() => {
    window.history.replaceState({ [ESTADO_HISTORIAL]: "dashboard" }, "", window.location.pathname + window.location.search);

    const alVolver = (e: PopStateEvent) => {
      const anterior = e.state?.[ESTADO_HISTORIAL] as SectionId | undefined;
      setSection(anterior && anterior in SECCIONES ? anterior : "dashboard");
      setHoja(null);
    };
    const alPoderInstalar = (e: Event) => {
      e.preventDefault();
      setEventoInstalar(e as EventoInstalacion);
    };

    window.addEventListener("popstate", alVolver);
    window.addEventListener("beforeinstallprompt", alPoderInstalar);
    return () => {
      window.removeEventListener("popstate", alVolver);
      window.removeEventListener("beforeinstallprompt", alPoderInstalar);
    };
  }, []);

  const irA = useCallback(
    (id: SectionId) => {
      setHoja(null);
      if (id === section) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setSection(id);
      window.history.pushState({ [ESTADO_HISTORIAL]: id }, "", `#${id}`);
      window.scrollTo({ top: 0 });
    },
    [section]
  );

  const cerrarHoja = useCallback(() => setHoja(null), []);

  const instalar = eventoInstalar
    ? async () => {
        await eventoInstalar.prompt();
        setEventoInstalar(null);
        setHoja(null);
      }
    : null;

  const navProps = {
    activa: section,
    masAbierto: hoja === "mas",
    mensajesSinLeer,
    onIr: irA,
    onAbrirMas: () => setHoja((h) => (h === "mas" ? null : "mas")),
    onAbrirBuscar: () => setHoja("buscar"),
  };

  return (
    <div className="tm-admin-theme tm-app flex min-h-screen">
      <AppSidebar {...navProps} />

      <div className="min-w-0 flex-1">
        <AppHeader {...navProps} />

        <main className="w-full px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-5 md:px-[var(--space-7)] md:pb-[var(--space-7)] md:pt-[var(--space-6)]">
          {/* Compu: título de la sección + buscador, notificaciones y usuario */}
          <div className="mb-[var(--space-6)] hidden items-center justify-between gap-4 md:flex">
            {CON_TITULO_PROPIO.has(section) ? (
              <span />
            ) : (
              <h1 className="tm-display text-[1.9rem] font-bold text-[var(--text-primary)]">{SECCIONES[section].label}</h1>
            )}
            <TopBar usuario={usuario} initial={initial} mensajesSinLeer={mensajesSinLeer} onSelectSection={irA} />
          </div>

          <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            {section === "dashboard" && <DashboardSection initial={initial} onSelectSection={irA} />}
            {section === "clientes" && <ClientesSection initial={initial.clientes} onSelectSection={irA} />}
            {section === "proyectos" && <ProyectosSection initial={initial.proyectos} />}
            {section === "servicios" && <ServiciosSection initial={initial.servicios} />}
            {section === "promociones" && <PromocionesSection initial={initial.cupones} />}
            {section === "mensajes" && <MensajesSection />}
            {section === "blog" && <BlogSection initial={initial.blogs} />}
            {section === "recursos" && <RecursosSection initial={initial.recursos} />}
            {section === "reportes" && <ReportesSection clientes={initial.clientes} proyectos={initial.proyectos} />}
            {section === "facturacion" && <FacturacionSection />}
            {section === "calendario" && <CalendarioSection />}
            {section === "configuracion" && <ConfiguracionSection />}
          </motion.div>
        </main>
      </div>

      <AppTabBar {...navProps} />

      <BuscarSheet abierto={hoja === "buscar"} onCerrar={cerrarHoja} initial={initial} onIr={irA} />
      <MasSheet
        abierto={hoja === "mas"}
        onCerrar={cerrarHoja}
        usuario={usuario}
        activa={section}
        mensajesSinLeer={mensajesSinLeer}
        onIr={irA}
        onBuscar={() => setHoja("buscar")}
        onInstalar={instalar}
      />
    </div>
  );
}
