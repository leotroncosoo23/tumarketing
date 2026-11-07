"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, Check, MessageSquarePlus, MessagesSquare, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getConversaciones, getProyectosResumen, type ConversacionResumen, type ProyectoResumen } from "@/lib/dashboard-queries";
import { Sheet } from "@/components/dashboard/app/Sheet";
import { AvatarCliente } from "@/components/dashboard/mensajes/AvatarCliente";
import { ChatConversacion, type ConversacionActiva } from "@/components/dashboard/mensajes/ChatConversacion";
import { fechaLista } from "@/components/dashboard/mensajes/utils";

type Filtro = "todas" | "sin-leer";

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function MensajesSection() {
  const [conversaciones, setConversaciones] = useState<ConversacionResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activa, setActiva] = useState<ConversacionActiva | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [nuevaAbierta, setNuevaAbierta] = useState(false);
  const recarga = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cargar = useCallback(() => {
    getConversaciones(supabase)
      .then((data) => {
        setConversaciones(data);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
    // Cualquier mensaje nuevo o "leído" actualiza la bandeja (agrupado, para no
    // recargar 10 veces si llegan varios juntos).
    const programar = () => {
      if (recarga.current) clearTimeout(recarga.current);
      recarga.current = setTimeout(cargar, 400);
    };
    const canal = supabase
      .channel("mensajes-admin-bandeja")
      .on("postgres_changes", { event: "*", schema: "public", table: "mensajes_proyecto" }, programar)
      .subscribe();
    return () => {
      if (recarga.current) clearTimeout(recarga.current);
      supabase.removeChannel(canal);
    };
  }, [cargar]);

  const totalSinLeer = conversaciones.reduce((n, c) => n + c.noLeidos, 0);

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return conversaciones.filter((c) => {
      if (filtro === "sin-leer" && c.noLeidos === 0) return false;
      if (!q) return true;
      return normalizar(`${c.clienteNombre} ${c.servicioTitulo} ${c.ultimoMensaje ?? ""}`).includes(q);
    });
  }, [conversaciones, filtro, busqueda]);

  const abrir = (c: ConversacionActiva) => {
    // El chat abierto queda en el historial: el botón "atrás" del celular lo
    // cierra y vuelve a la bandeja (como WhatsApp). Si ya había uno abierto,
    // lo reemplazamos para no apilar historial al saltar entre chats.
    const estado = { ...(window.history.state || {}), tmChat: c.servicioContratadoId };
    if (activa) window.history.replaceState(estado, "");
    else window.history.pushState(estado, "");

    setActiva({ servicioContratadoId: c.servicioContratadoId, clienteNombre: c.clienteNombre, servicioTitulo: c.servicioTitulo });
    // Al abrirla, sacamos el contador sin esperar a la recarga.
    setConversaciones((prev) => prev.map((x) => (x.servicioContratadoId === c.servicioContratadoId ? { ...x, noLeidos: 0 } : x)));
  };

  // "Atrás" (botón del celular o flecha del chat) cierra el chat.
  useEffect(() => {
    const alVolver = (e: PopStateEvent) => {
      if (!e.state?.tmChat) setActiva(null);
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  const cerrarChat = () => {
    if (window.history.state?.tmChat) window.history.back();
    else setActiva(null);
  };

  // Celular: el chat abierto ocupa toda la pantalla y se ajusta al alto visible
  // cuando aparece el teclado (en iPhone el teclado no achica la página).
  const chatRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!activa) return;
    const vv = window.visualViewport;
    const esCelular = window.matchMedia("(max-width: 767px)").matches;
    if (!esCelular) return;

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const el = chatRef.current;
    const ajustar = () => {
      if (!el || !vv) return;
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
    };
    ajustar();
    vv?.addEventListener("resize", ajustar);
    vv?.addEventListener("scroll", ajustar);
    return () => {
      document.body.style.overflow = overflowPrevio;
      vv?.removeEventListener("resize", ajustar);
      vv?.removeEventListener("scroll", ajustar);
      if (el) {
        el.style.height = "";
        el.style.top = "";
      }
    };
  }, [activa]);

  return (
    <>
      <div className="-mx-4 -mt-5 bg-[var(--surface-page)] md:mx-0 md:mt-0 md:flex md:h-[calc(100dvh-200px)] md:min-h-[560px] md:overflow-hidden md:rounded-[var(--radius-l)] md:border md:border-[var(--border-subtle)]">
        {/* ── Bandeja ── */}
        <aside className="flex min-h-0 w-full flex-col bg-[var(--surface-page)] md:w-[340px] md:shrink-0 md:border-r md:border-[var(--border-subtle)] md:bg-[var(--black-2)] lg:w-[380px]">
          <div className="sticky top-[calc(56px+env(safe-area-inset-top))] z-10 shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-page)]/95 px-4 pb-3 pt-3 backdrop-blur-xl md:static md:border-b-0 md:bg-transparent md:pt-4 md:backdrop-blur-none">
            <div className="mb-3 hidden items-center justify-between md:flex">
              <div className="flex items-baseline gap-2">
                <h2 className="tm-display text-[18px] font-bold text-[var(--text-primary)]">Bandeja</h2>
                {totalSinLeer > 0 && <span className="text-[12px] font-semibold text-[var(--accent)]">{totalSinLeer} sin leer</span>}
              </div>
              <button
                onClick={() => setNuevaAbierta(true)}
                title="Nueva conversación"
                aria-label="Nueva conversación"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--black-4)] hover:text-[var(--accent)]"
              >
                <MessageSquarePlus className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cliente o mensaje"
                className="h-10 w-full rounded-full bg-[var(--black-4)] pl-9 pr-9 text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-1 focus:ring-[var(--border-focus)] md:rounded-[12px] md:text-[14px]"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {(
                [
                  ["todas", "Todas"],
                  ["sin-leer", totalSinLeer > 0 ? `Sin leer (${totalSinLeer})` : "Sin leer"],
                ] as [Filtro, string][]
              ).map(([valor, label]) => (
                <button
                  key={valor}
                  onClick={() => setFiltro(valor)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    filtro === valor
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                      : "bg-[var(--black-4)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 md:overflow-y-auto">
            {cargando ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-[var(--black-4)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--black-4)]" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--black-3)]" />
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="px-6 py-10 text-center text-[13px] text-[var(--signal-error)]">{error}</p>
            ) : visibles.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <MessagesSquare className="mb-3 h-9 w-9 text-[var(--text-tertiary)]" />
                <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {busqueda ? "Sin resultados" : filtro === "sin-leer" ? "Estás al día 🎉" : "Todavía no hay conversaciones"}
                </p>
                <p className="mt-1 text-[13px] text-[var(--text-tertiary)]">
                  {busqueda
                    ? "Probá con otro nombre o palabra."
                    : filtro === "sin-leer"
                      ? "No tenés mensajes pendientes de leer."
                      : "Escribile a un cliente para arrancar."}
                </p>
                {!busqueda && filtro === "todas" && (
                  <button onClick={() => setNuevaAbierta(true)} className="mt-4 text-[13px] font-bold text-[var(--accent)]">
                    Nueva conversación
                  </button>
                )}
              </div>
            ) : (
              visibles.map((c) => {
                const seleccionada = activa?.servicioContratadoId === c.servicioContratadoId;
                const sinLeer = c.noLeidos > 0;
                return (
                  <button
                    key={c.servicioContratadoId}
                    onClick={() => abrir(c)}
                    className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      seleccionada ? "bg-[var(--black-4)]" : "hover:bg-[var(--black-3)]"
                    }`}
                  >
                    {seleccionada && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[var(--accent)]" />}
                    <AvatarCliente nombre={c.clienteNombre} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-[14px] text-[var(--text-primary)] ${sinLeer ? "font-bold" : "font-semibold"}`}>
                          {c.clienteNombre}
                        </span>
                        {c.ultimaFecha && (
                          <span className={`shrink-0 text-[11.5px] ${sinLeer ? "font-semibold text-[var(--accent)]" : "text-[var(--text-tertiary)]"}`}>
                            {fechaLista(c.ultimaFecha)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11.5px] text-[var(--text-tertiary)]">{c.servicioTitulo}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className={`flex min-w-0 flex-1 items-center gap-1 truncate text-[13px] ${sinLeer ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                          {c.ultimoAutorRol === "admin" &&
                            (c.ultimoLeido ? (
                              <CheckCheck className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                            ) : (
                              <Check className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />
                            ))}
                          <span className="truncate">
                            {c.ultimoAutorRol === "admin" && <span className="text-[var(--text-tertiary)]">Vos: </span>}
                            {c.ultimoMensaje || "Sin mensajes"}
                          </span>
                        </p>
                        {sinLeer && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-bold text-[var(--accent-contrast)]">
                            {c.noLeidos > 99 ? "99+" : c.noLeidos}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Chat ── (celular: pantalla completa sobre todo el panel, como WhatsApp) */}
        <section
          ref={chatRef}
          className={`min-h-0 min-w-0 flex-col bg-[var(--surface-page)] max-md:fixed max-md:inset-x-0 max-md:top-0 max-md:z-50 max-md:h-[100dvh] md:flex md:flex-1 ${
            activa ? "flex" : "hidden"
          }`}
        >
          {activa ? (
            <ChatConversacion key={activa.servicioContratadoId} conversacion={activa} onVolver={cerrarChat} />
          ) : (
            <div className="tm-chat-fondo flex flex-1 flex-col items-center justify-center px-8 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--black-3)]">
                <MessagesSquare className="h-7 w-7 text-[var(--accent)]" />
              </span>
              <p className="tm-display text-[18px] font-bold text-[var(--text-primary)]">Tus mensajes con clientes</p>
              <p className="mt-1 max-w-[340px] text-[13.5px] text-[var(--text-tertiary)]">
                Elegí una conversación de la bandeja o empezá una nueva con cualquier proyecto activo.
              </p>
              <button
                onClick={() => setNuevaAbierta(true)}
                className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[13px] font-bold text-[var(--accent-contrast)]"
              >
                Nueva conversación
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Botón flotante de nueva conversación (celular) */}
      {!activa && (
        <button
          onClick={() => setNuevaAbierta(true)}
          aria-label="Nueva conversación"
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_10px_30px_-8px_rgba(180,255,0,0.55)] transition-transform active:scale-90 md:hidden"
        >
          <MessageSquarePlus className="h-6 w-6" />
        </button>
      )}

      <NuevaConversacion
        abierta={nuevaAbierta}
        onCerrar={() => setNuevaAbierta(false)}
        conversaciones={conversaciones}
        onElegir={(c) => {
          setNuevaAbierta(false);
          abrir(c);
        }}
      />
    </>
  );
}

// Selector de proyecto para escribirle a un cliente (aunque todavía no haya mensajes).
function NuevaConversacion({
  abierta,
  onCerrar,
  conversaciones,
  onElegir,
}: {
  abierta: boolean;
  onCerrar: () => void;
  conversaciones: ConversacionResumen[];
  onElegir: (c: ConversacionActiva) => void;
}) {
  const [proyectos, setProyectos] = useState<ProyectoResumen[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!abierta || proyectos) return;
    getProyectosResumen(supabase)
      .then(setProyectos)
      .catch(() => setProyectos([]));
  }, [abierta, proyectos]);

  const conChat = useMemo(() => new Set(conversaciones.map((c) => c.servicioContratadoId)), [conversaciones]);

  const lista = useMemo(() => {
    const t = normalizar(q.trim());
    return (proyectos || [])
      .filter((p) => !p.suspendido)
      .filter((p) => !t || normalizar(`${p.clienteNombre} ${p.servicioTitulo}`).includes(t));
  }, [proyectos, q]);

  return (
    <Sheet abierto={abierta} onCerrar={onCerrar} titulo="Nueva conversación">
      <div className="px-5 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente o servicio"
            className="h-10 w-full rounded-[12px] bg-[var(--black-4)] pl-9 pr-3 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </div>
      <div className="px-2">
        {proyectos === null ? (
          <p className="py-8 text-center text-[13px] text-[var(--text-tertiary)]">Cargando proyectos…</p>
        ) : lista.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[var(--text-tertiary)]">No hay proyectos activos{q ? " con ese nombre" : ""}.</p>
        ) : (
          lista.map((p) => (
            <button
              key={p.id}
              onClick={() => onElegir({ servicioContratadoId: p.id, clienteNombre: p.clienteNombre, servicioTitulo: p.servicioTitulo })}
              className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors hover:bg-[var(--black-3)]"
            >
              <AvatarCliente nombre={p.clienteNombre} tamano={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[var(--text-primary)]">{p.clienteNombre}</span>
                <span className="block truncate text-[12.5px] text-[var(--text-tertiary)]">{p.servicioTitulo}</span>
              </span>
              {conChat.has(p.id) && <span className="shrink-0 text-[11px] text-[var(--text-tertiary)]">Ya tiene chat</span>}
            </button>
          ))
        )}
      </div>
    </Sheet>
  );
}
