"use client";

import { useState } from "react";
import AdminSidebar, { type AdminTabId } from "@/components/dashboard/AdminSidebar";

// Importaciones ACTIVAS (sin las barras //)
import ResumenTab from "@/components/dashboard/ResumenTab";
import CursoTab from "@/components/dashboard/CursoTab";
import BlogTab from "@/components/dashboard/BlogTab";
import RecursoTab from "@/components/dashboard/RecursoTab";
import AlumnoTab from "@/components/dashboard/AlumnoTab";
import MensajesTab from "@/components/dashboard/MensajesTab";
import BeneficiosTab from "@/components/dashboard/BeneficiosTab";
import TestimoniosTab from "@/components/dashboard/TestimoniosTab";
import ConfiguracionTab from "@/components/dashboard/ConfiguracionTab";
import EmailMarketingTab from "@/components/dashboard/EmailMarketingTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("resumen");

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      <AdminSidebar activeId={activeTab} onSelectTab={setActiveTab} />

      {/* --- CONTENIDO PRINCIPAL DINÁMICO --- */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === "resumen" && <ResumenTab />}
        {activeTab === "cursos" && <CursoTab />}
        {activeTab === "blog" && <BlogTab />}
        {activeTab === "recursos" && <RecursoTab />}
        {activeTab === "alumnos" && <AlumnoTab />}
        {activeTab === "mensajes" && <MensajesTab />}
        {activeTab === "beneficios" && <BeneficiosTab />}
        {activeTab === "testimonios" && <TestimoniosTab />}
        {activeTab === "configuracion" && <ConfiguracionTab />}
        {activeTab === "email" && <EmailMarketingTab />}
      </main>
    </div>
  );
}
