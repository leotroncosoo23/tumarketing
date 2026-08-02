"use client";

import { useEffect, useState } from "react";
import { AdminSidebarV2 } from "./AdminSidebarV2";
import { TopBar } from "./TopBar";
import { supabase } from "@/lib/supabase";
import type { ClienteResumen, ConversacionResumen, ProyectoResumen } from "@/lib/dashboard-queries";
import type { Servicio } from "@/lib/servicios";
import DashboardSection from "./sections/DashboardSection";
import ClientesSection from "./sections/ClientesSection";
import ProyectosSection from "./sections/ProyectosSection";
import ServiciosSection from "./sections/ServiciosSection";
import PromocionesSection from "./sections/PromocionesSection";
import MensajesSection from "./sections/MensajesSection";
import BlogSection from "./sections/BlogSection";
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
};

export type UsuarioActual = {
  nombre: string;
  rol: string;
};

export default function AdminShell({ initial, usuario }: { initial: InitialAdminData; usuario: UsuarioActual }) {
  const [section, setSection] = useState<SectionId>("dashboard");
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

    const canal = supabase
      .channel("mensajes-proyecto-admin-shell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "mensajes_proyecto" }, contarSinLeer)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  return (
    <div className="tm-admin-theme flex min-h-screen flex-col md:flex-row">
      <AdminSidebarV2 activeId={section} onSelect={setSection} mensajesSinLeer={mensajesSinLeer} />
      <main className="w-full flex-1 overflow-y-auto px-[var(--space-5)] py-[var(--space-6)] md:px-[var(--space-7)]">
        <div className="w-full">
          <div className="mb-[var(--space-6)] flex justify-end">
            <TopBar usuario={usuario} initial={initial} mensajesSinLeer={mensajesSinLeer} onSelectSection={setSection} />
          </div>
          {section === "dashboard" && <DashboardSection initial={initial} onSelectSection={setSection} />}
          {section === "clientes" && <ClientesSection initial={initial.clientes} onSelectSection={setSection} />}
          {section === "proyectos" && <ProyectosSection initial={initial.proyectos} />}
          {section === "servicios" && <ServiciosSection initial={initial.servicios} />}
          {section === "promociones" && <PromocionesSection initial={initial.cupones} />}
          {section === "mensajes" && <MensajesSection />}
          {section === "blog" && <BlogSection initial={initial.blogs} />}
          {section === "reportes" && <ReportesSection clientes={initial.clientes} proyectos={initial.proyectos} />}
          {section === "facturacion" && <FacturacionSection />}
          {section === "calendario" && <CalendarioSection />}
          {section === "configuracion" && <ConfiguracionSection />}
        </div>
      </main>
    </div>
  );
}
