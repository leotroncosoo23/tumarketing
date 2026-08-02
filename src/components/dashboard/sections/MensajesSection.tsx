"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enviarMensaje, marcarMensajesLeidos } from "@/lib/mensajes-actions";
import type { MensajeProyecto } from "@/lib/mensajes";
import { getConversaciones, type ConversacionResumen } from "@/lib/dashboard-queries";
import { Badge } from "@/components/dashboard/ui";

export default function MensajesSection() {
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [activaId, setActivaId] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeProyecto[]>([]);
  const [texto, setTexto] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  const cargarConversaciones = async () => {
    const data = await getConversaciones(supabase);
    setConversaciones(data);
    setCargando(false);
    if (!activaId && data[0]) setActivaId(data[0].servicioContratadoId);
  };

  useEffect(() => {
    cargarConversaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activaId) return;
    supabase
      .from("mensajes_proyecto")
      .select("*")
      .eq("servicio_contratado_id", activaId)
      .order("creado_en", { ascending: true })
      .then(({ data }) => setMensajes((data as MensajeProyecto[]) || []));
    marcarMensajesLeidos(activaId);
  }, [activaId]);

  useEffect(() => {
    const canal = supabase
      .channel("mensajes-proyecto-admin-inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, (payload) => {
        const nuevo = payload.new as MensajeProyecto;
        if (nuevo.servicio_contratado_id === activaId) {
          setMensajes((prev) => [...prev, nuevo]);
        }
        cargarConversaciones();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activaId]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const activa = conversaciones.find((c) => c.servicioContratadoId === activaId) || null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = texto.trim();
    if (!valor || !activaId) return;
    setTexto("");
    const resultado = await enviarMensaje({ servicioContratadoId: activaId, texto: valor });
    if (resultado?.error) alert(resultado.error);
  };

  return (
    <div className="grid h-[640px] grid-cols-[320px_1fr] overflow-hidden rounded-[var(--radius-l)] border border-[var(--border-subtle)]">
      <div className="overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--surface-card)]">
        {cargando && <p className="p-4 text-center text-sm text-[var(--text-tertiary)]">Cargando...</p>}
        {conversaciones.map((c) => (
          <button
            key={c.servicioContratadoId}
            onClick={() => setActivaId(c.servicioContratadoId)}
            className={`flex w-full items-center gap-3 border-b border-[var(--border-subtle)] p-3 text-left transition-colors ${
              activaId === c.servicioContratadoId ? "bg-[var(--surface-card-hover)]" : "hover:bg-[var(--surface-card-hover)]/60"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--black-4)] text-xs font-bold text-[var(--accent)]">
              {c.clienteNombre.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-[var(--text-primary)]">{c.clienteNombre}</span>
                {c.ultimaFecha && (
                  <span className="shrink-0 text-[11px] text-[var(--text-tertiary)]">
                    {new Date(c.ultimaFecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-[var(--text-tertiary)]">{c.ultimoMensaje || c.servicioTitulo}</p>
            </div>
            {c.noLeidos > 0 && <Badge tone="lime">{c.noLeidos}</Badge>}
          </button>
        ))}
        {!cargando && conversaciones.length === 0 && (
          <p className="p-4 text-center text-sm text-[var(--text-tertiary)]">Todavía no hay conversaciones.</p>
        )}
      </div>

      <div className="flex flex-col bg-[var(--surface-page)]">
        {!activa ? (
          <div className="flex flex-1 items-center justify-center text-[var(--text-tertiary)]">
            Elegí una conversación de la lista.
          </div>
        ) : (
          <>
            <div className="border-b border-[var(--border-subtle)] p-4">
              <p className="tm-display font-bold text-[var(--text-primary)]">{activa.clienteNombre}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{activa.servicioTitulo}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {mensajes.map((m) => {
                const esAdmin = m.autor_rol === "admin";
                return (
                  <div key={m.id} className={`mb-3 flex ${esAdmin ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-[var(--radius-m)] px-4 py-2.5 text-sm ${
                        esAdmin ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-primary)]"
                      }`}
                    >
                      {m.texto || m.archivo_nombre}
                    </div>
                  </div>
                );
              })}
              <div ref={finRef} />
            </div>
            <form onSubmit={enviar} className="flex gap-3 border-t border-[var(--border-subtle)] p-4">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribí un mensaje..."
                className="flex-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)]"
              />
              <button
                type="submit"
                disabled={!texto.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
