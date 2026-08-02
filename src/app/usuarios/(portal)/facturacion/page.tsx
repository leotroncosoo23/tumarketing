"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUsuarioPortal } from "../layout";
import { generarFacturaPDF } from "@/lib/factura-pdf";

type Factura = {
  id: string;
  concepto: string;
  monto: number;
  moneda: string;
  estado: string;
  fecha_emision: string;
  fecha_vencimiento: string | null;
};

type ServicioActivo = { id: string; titulo: string; precioArs: number; precioUsd: number; otorgadoEn: string };

// Próxima renovación mensual "estimada" a partir de la fecha real de alta del
// primer servicio (mismo día del mes, la próxima vez que caiga). Placeholder
// hasta que exista una fecha de facturación recurrente real.
function proximaRenovacionEstimada(otorgadoEnISO: string): string {
  const inicio = new Date(otorgadoEnISO);
  const hoy = new Date();
  const resultado = new Date(hoy.getFullYear(), hoy.getMonth(), inicio.getDate());
  if (resultado <= hoy) resultado.setMonth(resultado.getMonth() + 1);
  return resultado.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
}

const ESTILO_ESTADO: Record<string, string> = {
  pagada: "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30",
  pendiente: "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  vencida: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const SIMBOLO_MONEDA: Record<string, string> = { ARS: "$", USD: "U$D " };

export default function FacturacionPage() {
  const { perfil } = useUsuarioPortal();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [servicios, setServicios] = useState<ServicioActivo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [facturasRes, serviciosRes] = await Promise.all([
        supabase
          .from("facturas")
          .select("id, concepto, monto, moneda, estado, fecha_emision, fecha_vencimiento")
          .eq("usuario_id", perfil.id)
          .order("fecha_emision", { ascending: false }),
        supabase
          .from("servicios_contratados")
          .select("id, suspendido, otorgado_en, servicios (titulo, precio_ars, precio_usd)")
          .eq("usuario_id", perfil.id)
          .eq("suspendido", false)
          .order("otorgado_en", { ascending: true }),
      ]);

      if (facturasRes.error) console.error("Error al traer tus facturas:", facturasRes.error.message);
      setFacturas(facturasRes.data || []);

      type Fila = { id: string; otorgado_en: string; servicios: { titulo: string; precio_ars: number; precio_usd: number } | null };
      setServicios(
        ((serviciosRes.data as unknown as Fila[]) || [])
          .filter((s) => s.servicios)
          .map((s) => ({
            id: s.id,
            titulo: s.servicios!.titulo,
            precioArs: s.servicios!.precio_ars,
            precioUsd: s.servicios!.precio_usd,
            otorgadoEn: s.otorgado_en,
          }))
      );
      setCargando(false);
    };
    cargar();
  }, [perfil.id]);

  const descargar = (factura: Factura) => {
    generarFacturaPDF({
      concepto: factura.concepto,
      monto: factura.monto,
      moneda: factura.moneda,
      fechaEmision: factura.fecha_emision,
      nombreCliente: perfil.nombre || perfil.email,
    });
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black mb-1">Facturación</h1>
      <p className="text-neutral-400 text-sm mb-8">Tus servicios activos y el historial de facturas.</p>

      {cargando ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : (
        <>
          {servicios.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-stretch">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Plan actual</p>
                    <p className="text-xl font-black text-white">{servicios[0].titulo}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 whitespace-nowrap">
                    Activo
                  </span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-neutral-500 mb-1">Monto mensual</p>
                    <p className="text-xl font-black text-white">
                      ${servicios.reduce((acc, s) => acc + s.precioArs, 0).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-neutral-500 mb-1">Próxima renovación</p>
                    <p className="text-xl font-black text-white">{proximaRenovacionEstimada(servicios[0].otorgadoEn)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-neutral-500">Medio de pago</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                    Vista previa
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400">💳</div>
                  <div>
                    <p className="text-sm text-white">Terminada en 4821</p>
                    <p className="text-xs text-neutral-500">Vence 08/28</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Todavía no está disponible guardar un medio de pago. Cada servicio se paga desde el checkout al contratarlo.")}
                  className="text-sm font-bold text-white hover:text-[#ccff00] transition-colors text-left"
                >
                  Cambiar tarjeta
                </button>
              </div>
            </div>
          )}

          {servicios.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Gasto mensual activo</p>
                <p className="text-2xl font-black text-[#ccff00]">
                  ${servicios.reduce((acc, s) => acc + s.precioArs, 0).toLocaleString("es-AR")}
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Servicios activos</p>
                <p className="text-2xl font-black text-white">{servicios.length}</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Facturas pendientes</p>
                <p className="text-2xl font-black text-white">{facturas.filter((f) => f.estado === "pendiente").length}</p>
              </div>
            </div>
          )}

          {servicios.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {servicios.map((s) => (
                <div key={s.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <p className="text-xs text-neutral-500 mb-1">Servicio activo</p>
                  <p className="font-bold text-white text-sm mb-3">{s.titulo}</p>
                  <p className="text-lg font-black text-[#ccff00]">${s.precioArs.toLocaleString("es-AR")}</p>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-black mb-4">Historial de facturas</h3>
          {facturas.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 text-lg">Todavía no tenés facturas.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {facturas.map((factura) => (
                <div key={factura.id} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white truncate">{factura.concepto}</p>
                      <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ESTILO_ESTADO[factura.estado] || ESTILO_ESTADO.pendiente}`}>
                        {factura.estado}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {SIMBOLO_MONEDA[factura.moneda] || ""}
                      {factura.monto.toLocaleString("es-AR")} {factura.moneda} ·{" "}
                      {new Date(factura.fecha_emision).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      {factura.fecha_vencimiento &&
                        ` · Vence ${new Date(factura.fecha_vencimiento).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
                    </p>
                  </div>
                  <button
                    onClick={() => descargar(factura)}
                    className="shrink-0 text-xs font-bold text-neutral-300 hover:text-[#ccff00] bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-lg px-3 py-2 transition-colors whitespace-nowrap"
                  >
                    ⬇️ Comprobante
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
