"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Comunicado = {
  id: string;
  asunto: string;
  mensaje: string;
  cantidad_destinatarios: number;
  creado_en: string;
};

export default function EmailMarketingTab() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cantidadSuscriptores, setCantidadSuscriptores] = useState<number | null>(null);
  const [historial, setHistorial] = useState<Comunicado[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const fetchCantidadSuscriptores = async () => {
    const { count } = await supabase
      .from("suscriptores")
      .select("id", { count: "exact", head: true })
      .eq("activo", true);
    setCantidadSuscriptores(count ?? 0);
  };

  const fetchHistorial = async () => {
    setCargandoHistorial(true);
    const { data, error } = await supabase
      .from("comunicados")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(20);

    if (error) console.error("Error al traer historial:", error.message);
    setHistorial(data || []);
    setCargandoHistorial(false);
  };

  useEffect(() => {
    fetchCantidadSuscriptores();
    fetchHistorial();
  }, []);

  const handleEnviar = async () => {
    if (!asunto.trim() || !mensaje.trim()) {
      alert("Completá el asunto y el mensaje antes de enviar.");
      return;
    }

    const confirmar = confirm(
      `¿Enviar este comunicado a ${cantidadSuscriptores ?? "todos los"} suscriptor(es) activo(s)? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setEnviando(true);
    try {
      const res = await fetch("/api/enviar-comunicado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asunto, mensaje }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Error al enviar: " + data.error);
      } else {
        alert(`¡Comunicado enviado a ${data.enviados} suscriptor(es)!`);
        setAsunto("");
        setMensaje("");
        fetchHistorial();
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
    }
    setEnviando(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black">📨 Email Marketing</h1>
        <p className="text-neutral-400 text-sm">
          Escribí un comunicado y enviáselo a toda tu base de suscriptores activos.
        </p>
      </div>

      {/* EDITOR */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-10 shadow-2xl">
        <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">
          Nuevo Comunicado
        </h3>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
            Asunto
          </label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
            placeholder="Ej: ¡Nuevo curso disponible!"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
            Mensaje
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-48 resize-none"
            placeholder="Escribí acá el contenido del correo..."
          />
          <p className="text-xs text-neutral-500 mt-2">
            Se envía como texto simple con saltos de línea respetados. Cada suscriptor recibe su propio email (nadie ve la lista de destinatarios).
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
          <span className="text-sm text-neutral-400">
            Destinatarios:{" "}
            <span className="text-[#ccff00] font-bold">
              {cantidadSuscriptores === null ? "..." : cantidadSuscriptores} suscriptor(es) activo(s)
            </span>
          </span>
          <button
            onClick={handleEnviar}
            disabled={enviando}
            className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "🚀 Enviar a todos los suscriptores"}
          </button>
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
            Historial de Comunicados
          </span>
          {cargandoHistorial && (
            <span className="text-xs text-[#ccff00] animate-pulse font-bold">Cargando...</span>
          )}
        </div>

        <div className="divide-y divide-neutral-800">
          {historial.length === 0 && !cargandoHistorial ? (
            <div className="p-12 text-center text-neutral-400">
              Todavía no enviaste ningún comunicado.
            </div>
          ) : (
            historial.map((c) => (
              <div key={c.id} className="p-5 hover:bg-neutral-800/40 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-white mb-1">{c.asunto}</h4>
                    <p className="text-sm text-neutral-500 line-clamp-2">{c.mensaje}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#ccff00] block">
                      {c.cantidad_destinatarios} enviados
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(c.creado_en).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}