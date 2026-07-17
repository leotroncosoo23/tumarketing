"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAlumnoSession } from "@/lib/useAlumnoSession";
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

const ESTILO_ESTADO: Record<string, string> = {
  pagada: "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30",
  pendiente: "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  vencida: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const SIMBOLO_MONEDA: Record<string, string> = { ARS: "$", USD: "U$D " };

export default function FacturacionCard({ servicioContratadoId }: { servicioContratadoId: string }) {
  const { perfil } = useAlumnoSession();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from("facturas")
        .select("id, concepto, monto, moneda, estado, fecha_emision, fecha_vencimiento")
        .eq("servicio_contratado_id", servicioContratadoId)
        .order("fecha_emision", { ascending: false });

      if (error) console.error("Error al traer las facturas:", error.message);
      setFacturas(data || []);
      setCargando(false);
    };
    cargar();
  }, [servicioContratadoId]);

  const descargar = (factura: Factura) => {
    generarFacturaPDF({
      concepto: factura.concepto,
      monto: factura.monto,
      moneda: factura.moneda,
      fechaEmision: factura.fecha_emision,
      nombreCliente: perfil?.nombre || perfil?.email || "Cliente",
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Facturación y Pagos</p>

      {cargando ? (
        <p className="text-sm text-neutral-500">Cargando...</p>
      ) : facturas.length === 0 ? (
        <p className="text-sm text-neutral-500">Todavía no hay facturas para este proyecto.</p>
      ) : (
        <div className="space-y-2">
          {facturas.map((factura) => (
            <div
              key={factura.id}
              className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl p-3"
            >
              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-white truncate">{factura.concepto}</p>
                  <span
                    className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      ESTILO_ESTADO[factura.estado] || ESTILO_ESTADO.pendiente
                    }`}
                  >
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
                className="shrink-0 text-xs font-bold text-neutral-300 hover:text-[#ccff00] bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 rounded-lg px-3 py-2 transition-colors whitespace-nowrap"
              >
                ⬇️ Comprobante
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
