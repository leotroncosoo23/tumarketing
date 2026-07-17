"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Cupon = {
  id: string;
  codigo: string;
  tipo_descuento: string;
  valor: number;
  limite_usos: number | null;
  usos_actuales: number;
  fecha_vencimiento: string | null;
  activo: boolean;
};

export default function BeneficiosTab() {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nuevoCupon, setNuevoCupon] = useState({
    codigo: "",
    tipo_descuento: "porcentaje",
    valor: "",
    limite_usos: "",
    fecha_vencimiento: ""
  });

  const fetchCupones = async () => {
    setCargando(true);
    const { data } = await supabase.from("cupones").select("*").order("creado_en", { ascending: false });
    setCupones(data || []);
    setCargando(false);
  };

  useEffect(() => {
    // fetchCupones también se reutiliza tras crear/editar/borrar un cupón
    // (ver más abajo), por eso vive fuera del efecto en vez de estar inline.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCupones();
  }, []);

  const handleGuardarCupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const { error } = await supabase.from("cupones").insert([{
      codigo: nuevoCupon.codigo.toUpperCase().replace(/\s/g, ''), // Fuerza mayúsculas y sin espacios
      tipo_descuento: nuevoCupon.tipo_descuento,
      valor: Number(nuevoCupon.valor),
      limite_usos: nuevoCupon.limite_usos ? Number(nuevoCupon.limite_usos) : null,
      fecha_vencimiento: nuevoCupon.fecha_vencimiento ? new Date(nuevoCupon.fecha_vencimiento).toISOString() : null,
      activo: true
    }]);

    if (error) {
      alert("Error al crear cupón: " + error.message);
    } else {
      alert("¡Cupón creado con éxito!");
      setShowForm(false);
      setNuevoCupon({ codigo: "", tipo_descuento: "porcentaje", valor: "", limite_usos: "", fecha_vencimiento: "" });
      fetchCupones();
    }
    setGuardando(false);
  };

  const eliminarCupon = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cupón?")) return;
    const { error } = await supabase.from("cupones").delete().eq("id", id);
    if (error) alert("Error al borrar: " + error.message);
    else fetchCupones();
  };

  const toggleActivo = async (id: string, estadoActual: boolean) => {
    const { error } = await supabase.from("cupones").update({ activo: !estadoActual }).eq("id", id);
    if (!error) fetchCupones();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">🎁 Beneficios y Promos</h1>
          <p className="text-neutral-400 text-sm">Creá códigos de descuento para impulsar tus ventas.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]">
          {showForm ? "✕ Cancelar" : "➕ Crear Cupón"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleGuardarCupon} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-10 shadow-2xl">
          <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">Nuevo Código de Descuento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Código (Ej: VERANO20)</label>
              <input type="text" required value={nuevoCupon.codigo} onChange={(e) => setNuevoCupon({...nuevoCupon, codigo: e.target.value.toUpperCase()})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] font-black tracking-widest uppercase" placeholder="MIPROMO" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Tipo de Descuento</label>
              <select value={nuevoCupon.tipo_descuento} onChange={(e) => setNuevoCupon({...nuevoCupon, tipo_descuento: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]">
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Monto Fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Valor ({nuevoCupon.tipo_descuento === 'porcentaje' ? '%' : 'AR$'})</label>
              <input type="number" required value={nuevoCupon.valor} onChange={(e) => setNuevoCupon({...nuevoCupon, valor: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-[#ccff00] font-bold outline-none focus:border-[#ccff00]" placeholder={nuevoCupon.tipo_descuento === 'porcentaje' ? "Ej: 20" : "Ej: 5000"} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Límite de usos (Opcional)</label>
              <input type="number" value={nuevoCupon.limite_usos} onChange={(e) => setNuevoCupon({...nuevoCupon, limite_usos: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: 100 (vacío = sin límite)" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Fecha de Vencimiento (Opcional)</label>
              <input type="date" value={nuevoCupon.fecha_vencimiento} onChange={(e) => setNuevoCupon({...nuevoCupon, fecha_vencimiento: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-400 outline-none focus:border-[#ccff00] [color-scheme:dark]" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" disabled={guardando} className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50">
              {guardando ? "Guardando..." : "✅ Guardar Cupón"}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE CUPONES */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">Cupones Activos ({cupones.length})</span>
          {cargando && <span className="text-xs text-[#ccff00] animate-pulse font-bold">Cargando...</span>}
        </div>
        
        <div className="divide-y divide-neutral-800">
          {cupones.length === 0 && !cargando ? (
            <div className="p-12 text-center text-neutral-400">No hay cupones creados. ¡Armá tu primera promo!</div>
          ) : (
            cupones.map((cupon) => (
              <div key={cupon.id} className={`p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${cupon.activo ? 'hover:bg-neutral-800/40' : 'bg-neutral-950/80 opacity-60'}`}>
                
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-2 rounded-lg font-black text-lg tracking-widest ${cupon.activo ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20' : 'bg-neutral-800 text-neutral-500 border border-neutral-700'}`}>
                    {cupon.codigo}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      {cupon.tipo_descuento === 'porcentaje' ? `${cupon.valor}% OFF` : `$${cupon.valor.toLocaleString("es-AR")} de descuento`}
                    </h4>
                    <div className="flex gap-3 text-[11px] text-neutral-500 uppercase font-bold tracking-wider flex-wrap">
                      <span>Usos: {cupon.usos_actuales} {cupon.limite_usos ? `/ ${cupon.limite_usos}` : '(Sin límite)'}</span>
                      {cupon.fecha_vencimiento && (
                        <>
                          <span>•</span>
                          <span>Vence: {new Date(cupon.fecha_vencimiento).toLocaleDateString("es-AR")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto justify-end items-center flex-wrap">
                  <button onClick={() => toggleActivo(cupon.id, cupon.activo)} className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${cupon.activo ? 'bg-neutral-950 border-neutral-700 text-neutral-400 hover:text-white' : 'bg-[#ccff00]/20 border-[#ccff00]/50 text-[#ccff00] hover:bg-[#ccff00]/30'}`}>
                    {cupon.activo ? "⏸ Apagar" : "▶️ Prender"}
                  </button>
                  <button onClick={() => eliminarCupon(cupon.id)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg transition-colors">
                    Borrar
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}