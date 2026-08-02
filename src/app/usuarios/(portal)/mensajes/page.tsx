"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUsuarioPortal } from "../layout";
import ChatProyecto from "@/components/usuarios/ChatProyecto";
import { ETIQUETA_ESTADO, type EstadoServicioContratado } from "@/lib/estado-servicio";

type Conversacion = {
  id: string;
  nombre: string;
  estado: EstadoServicioContratado;
  noLeidos: number;
};

export default function MensajesPage() {
  const { perfil } = useUsuarioPortal();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data: servicios, error } = await supabase
        .from("servicios_contratados")
        .select("id, estado, servicios (titulo)")
        .eq("usuario_id", perfil.id);

      if (error || !servicios) {
        console.error("Error al traer tus servicios:", error?.message);
        setCargando(false);
        return;
      }

      type Fila = { id: string; estado: string; servicios: { titulo: string } | null };
      const filas = servicios as unknown as Fila[];
      const ids = filas.map((s) => s.id);

      const { data: mensajes } = ids.length
        ? await supabase
            .from("mensajes_proyecto")
            .select("servicio_contratado_id")
            .eq("autor_rol", "admin")
            .eq("leido", false)
            .in("servicio_contratado_id", ids)
        : { data: [] };

      const conteoPorServicio = new Map<string, number>();
      (mensajes || []).forEach((m: { servicio_contratado_id: string }) => {
        conteoPorServicio.set(m.servicio_contratado_id, (conteoPorServicio.get(m.servicio_contratado_id) || 0) + 1);
      });

      const lista = filas.map((s) => ({
        id: s.id,
        nombre: s.servicios?.titulo || "Servicio eliminado",
        estado: s.estado as EstadoServicioContratado,
        noLeidos: conteoPorServicio.get(s.id) || 0,
      }));

      setConversaciones(lista);
      setSeleccionada((prev) => prev || lista[0]?.id || null);
      setCargando(false);
    };
    cargar();
  }, [perfil.id]);

  const conversacionActiva = conversaciones.find((c) => c.id === seleccionada) || null;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black mb-1">Mensajes</h1>
      <p className="text-neutral-400 text-sm mb-8">Hablá directo con el equipo asignado a cada uno de tus servicios.</p>

      {cargando ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : conversaciones.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-3xl">
          <p className="text-neutral-400 text-lg">Todavía no contrataste ningún servicio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden h-160">
          {/* Panel de conversaciones */}
          <div className="border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col overflow-y-auto">
            <p className="px-5 pt-5 pb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500 shrink-0">Conversaciones</p>
            {conversaciones.map((c) => (
              <button
                key={c.id}
                onClick={() => setSeleccionada(c.id)}
                className={`flex items-center gap-3 px-5 py-3.5 text-left transition-colors border-l-2 ${
                  seleccionada === c.id ? "bg-neutral-800/60 border-[#ccff00]" : "border-transparent hover:bg-neutral-800/30"
                }`}
              >
                <span className="w-11 h-11 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-lg shrink-0">
                  💬
                </span>
                <div className="min-w-0 flex-grow">
                  <p className="font-bold text-white text-sm truncate">{c.nombre}</p>
                  <p className="text-xs text-neutral-500 truncate">{ETIQUETA_ESTADO[c.estado]}</p>
                </div>
                {c.noLeidos > 0 && (
                  <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                    {c.noLeidos > 9 ? "9+" : c.noLeidos}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat en vivo de la conversación seleccionada */}
          <div className="min-h-0">
            {conversacionActiva && (
              <ChatProyecto key={conversacionActiva.id} servicioContratadoId={conversacionActiva.id} titulo={conversacionActiva.nombre} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
