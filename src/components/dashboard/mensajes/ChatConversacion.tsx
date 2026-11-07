"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Archive,
  Check,
  CheckCheck,
  Clock,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  RotateCcw,
  SendHorizontal,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enviarMensaje, marcarMensajesLeidos, obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { inferirTipoArchivo, type MensajeProyecto, type TipoArchivoMensaje } from "@/lib/mensajes";
import { AvatarCliente } from "./AvatarCliente";
import { fechaSeparador, hora, mismoDia, RESPUESTAS_RAPIDAS } from "./utils";

export type ConversacionActiva = {
  servicioContratadoId: string;
  clienteNombre: string;
  servicioTitulo: string;
};

// Mensaje que todavía no confirmó la base (se muestra al instante al enviar).
type Pendiente = { tempId: string; texto: string; archivoNombre?: string; estado: "enviando" | "error"; creado_en: string };

const AGRUPAR_MS = 5 * 60 * 1000;
const MAX_ARCHIVO_MB = 20;

function IconoArchivo({ tipo }: { tipo: TipoArchivoMensaje }) {
  if (tipo === "pdf") return <FileText className="h-5 w-5" />;
  if (tipo === "zip") return <Archive className="h-5 w-5" />;
  return <ImageIcon className="h-5 w-5" />;
}

// Chat de un proyecto. Quien lo usa le pasa key={servicioContratadoId} para
// que al cambiar de conversación se remonte con el estado limpio.
export function ChatConversacion({ conversacion, onVolver }: { conversacion: ConversacionActiva; onVolver: () => void }) {
  const id = conversacion.servicioContratadoId;
  const [mensajes, setMensajes] = useState<MensajeProyecto[]>([]);
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [primerNoLeidoId, setPrimerNoLeidoId] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [rapidasAbiertas, setRapidasAbiertas] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [hayNuevosAbajo, setHayNuevosAbajo] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);
  const pegadoAbajo = useRef(true);
  const primerScroll = useRef(true);
  const contadorTemp = useRef(0);

  // Carga inicial: guardamos dónde empiezan los no leídos ANTES de marcarlos.
  useEffect(() => {
    supabase
      .from("mensajes_proyecto")
      .select("*")
      .eq("servicio_contratado_id", id)
      .order("creado_en", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Error al traer los mensajes:", error.message);
        const lista = (data as MensajeProyecto[]) || [];
        setMensajes(lista);
        setPrimerNoLeidoId(lista.find((m) => m.autor_rol === "cliente" && !m.leido)?.id ?? null);
        setCargando(false);
        if (lista.some((m) => m.autor_rol === "cliente" && !m.leido)) marcarMensajesLeidos(id);
      });
  }, [id]);

  // Tiempo real: mensajes nuevos y cambios de "leído" (para los tildes).
  useEffect(() => {
    const canal = supabase
      .channel(`admin-chat-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes_proyecto", filter: `servicio_contratado_id=eq.${id}` },
        (payload) => {
          const nuevo = payload.new as MensajeProyecto;
          setMensajes((prev) => (prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo]));
          if (nuevo.autor_rol === "admin") {
            // Reemplaza al "pendiente" que mostramos al enviar.
            setPendientes((prev) => {
              const i = prev.findIndex((p) => (nuevo.texto ? p.texto === nuevo.texto : p.archivoNombre === nuevo.archivo_nombre));
              return i === -1 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
            });
          } else {
            marcarMensajesLeidos(id);
            if (!pegadoAbajo.current) setHayNuevosAbajo(true);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "mensajes_proyecto", filter: `servicio_contratado_id=eq.${id}` },
        (payload) => {
          const editado = payload.new as MensajeProyecto;
          setMensajes((prev) => prev.map((m) => (m.id === editado.id ? editado : m)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [id]);

  // Scroll: la primera vez salta al primer no leído (o al final); después sigue
  // al final solo si el usuario ya estaba abajo, para no sacarlo de lo que lee.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || cargando) return;
    if (primerScroll.current) {
      primerScroll.current = false;
      const marca = el.querySelector("[data-no-leidos]");
      if (marca) (marca as HTMLElement).scrollIntoView({ block: "center" });
      else el.scrollTop = el.scrollHeight;
      return;
    }
    if (pegadoAbajo.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [mensajes, pendientes, cargando]);

  const alScrollear = () => {
    const el = scrollRef.current;
    if (!el) return;
    pegadoAbajo.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (pegadoAbajo.current && hayNuevosAbajo) setHayNuevosAbajo(false);
  };

  const irAbajo = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    setHayNuevosAbajo(false);
  };

  const ajustarAlto = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  const mandar = async (contenido: string, tempIdExistente?: string) => {
    const tempId = tempIdExistente ?? `tmp-${++contadorTemp.current}`;
    pegadoAbajo.current = true;
    setPendientes((prev) =>
      tempIdExistente
        ? prev.map((p) => (p.tempId === tempId ? { ...p, estado: "enviando" } : p))
        : [...prev, { tempId, texto: contenido, estado: "enviando", creado_en: new Date().toISOString() }]
    );
    const resultado = await enviarMensaje({ servicioContratadoId: id, texto: contenido });
    if (resultado?.error) {
      setPendientes((prev) => prev.map((p) => (p.tempId === tempId ? { ...p, estado: "error" } : p)));
    }
  };

  const enviarTexto = (e?: React.FormEvent) => {
    e?.preventDefault();
    const valor = texto.trim();
    if (!valor) return;
    setTexto("");
    setRapidasAbiertas(false);
    requestAnimationFrame(() => {
      ajustarAlto();
      textareaRef.current?.focus();
    });
    mandar(valor);
  };

  const alPresionarTecla = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // En el celular (pantalla táctil) Enter hace salto de línea y se envía con el
    // botón, como en WhatsApp. En la compu, Enter envía.
    const tactil = window.matchMedia("(pointer: coarse)").matches;
    if (e.key === "Enter" && !e.shiftKey && !tactil && !e.nativeEvent.isComposing) {
      e.preventDefault();
      enviarTexto();
    }
  };

  const usarRapida = (r: string) => {
    setTexto((t) => (t.trim() ? `${t.trim()} ${r}` : r));
    setRapidasAbiertas(false);
    requestAnimationFrame(() => {
      ajustarAlto();
      textareaRef.current?.focus();
    });
  };

  const adjuntar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    if (archivo.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      alert(`El archivo pesa más de ${MAX_ARCHIVO_MB} MB.`);
      return;
    }

    const tempId = `tmp-archivo-${++contadorTemp.current}`;
    pegadoAbajo.current = true;
    setSubiendo(true);
    setPendientes((prev) => [...prev, { tempId, texto: "", archivoNombre: archivo.name, estado: "enviando", creado_en: new Date().toISOString() }]);

    const path = `${id}/${Date.now()}-${archivo.name}`;
    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      setPendientes((prev) => prev.filter((p) => p.tempId !== tempId));
      setSubiendo(false);
      alert("No se pudo subir el archivo: " + errorSubida.message);
      return;
    }

    const resultado = await enviarMensaje({
      servicioContratadoId: id,
      archivoNombre: archivo.name,
      archivoTipo: inferirTipoArchivo(archivo),
      archivoPath: path,
    });
    if (resultado?.error) {
      setPendientes((prev) => prev.filter((p) => p.tempId !== tempId));
      alert(resultado.error);
    }
    setSubiendo(false);
  };

  const descargar = async (path: string) => {
    const resultado = await obtenerUrlArchivo(path);
    if (resultado.error || !resultado.url) {
      alert(resultado.error || "No pudimos generar el link de descarga.");
      return;
    }
    window.open(resultado.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Encabezado */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-[var(--border-subtle)] bg-[var(--black-2)] px-2 pb-2.5 pt-[calc(10px+env(safe-area-inset-top))] md:gap-3 md:bg-transparent md:px-5 md:py-3">
        <button
          onClick={onVolver}
          aria-label="Volver a la lista"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)] active:bg-[var(--black-4)] md:hidden"
        >
          <ArrowLeft className="h-[22px] w-[22px]" />
        </button>
        <AvatarCliente nombre={conversacion.clienteNombre} tamano={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-[var(--text-primary)]">{conversacion.clienteNombre}</p>
          <p className="truncate text-[12px] text-[var(--text-tertiary)]">{conversacion.servicioTitulo}</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={alScrollear} className="tm-chat-fondo h-full overflow-y-auto px-3 py-4 md:px-6">
          {cargando ? (
            <div className="flex flex-col gap-3 py-2">
              {[60, 40, 72, 35, 55].map((w, i) => (
                <div key={i} className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}>
                  <div className="h-10 animate-pulse rounded-[16px] bg-[var(--black-3)]" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          ) : mensajes.length === 0 && pendientes.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <AvatarCliente nombre={conversacion.clienteNombre} tamano={64} />
              <p className="mt-4 text-[15px] font-bold text-[var(--text-primary)]">Arrancá la conversación</p>
              <p className="mt-1 max-w-[300px] text-[13px] text-[var(--text-tertiary)]">
                {conversacion.clienteNombre} va a ver tu mensaje en su portal, dentro del proyecto “{conversacion.servicioTitulo}”.
              </p>
            </div>
          ) : (
            <>
              {mensajes.map((m, i) => {
                const anterior = mensajes[i - 1];
                const siguiente = mensajes[i + 1];
                const esAdmin = m.autor_rol === "admin";
                const nuevoDia = !anterior || !mismoDia(anterior.creado_en, m.creado_en);
                const pegadoArriba =
                  !nuevoDia && anterior?.autor_rol === m.autor_rol && +new Date(m.creado_en) - +new Date(anterior.creado_en) < AGRUPAR_MS;
                const ultimoDelGrupo =
                  !siguiente ||
                  siguiente.autor_rol !== m.autor_rol ||
                  !mismoDia(siguiente.creado_en, m.creado_en) ||
                  +new Date(siguiente.creado_en) - +new Date(m.creado_en) >= AGRUPAR_MS;

                return (
                  <Fragment key={m.id}>
                    {nuevoDia && (
                      <div className="sticky top-0 z-[1] my-3 flex justify-center">
                        <span className="rounded-full bg-[var(--black-3)]/90 px-3 py-1 text-[11.5px] font-semibold first-letter:uppercase text-[var(--text-secondary)] shadow backdrop-blur">
                          {fechaSeparador(m.creado_en)}
                        </span>
                      </div>
                    )}
                    {m.id === primerNoLeidoId && (
                      <div data-no-leidos className="my-3 flex items-center gap-3">
                        <span className="h-px flex-1 bg-[var(--accent)]/40" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">Mensajes nuevos</span>
                        <span className="h-px flex-1 bg-[var(--accent)]/40" />
                      </div>
                    )}
                    <div className={`flex ${esAdmin ? "justify-end" : "justify-start"} ${pegadoArriba ? "mt-0.5" : "mt-3"}`}>
                      <div
                        className={`max-w-[85%] px-3.5 py-2 md:max-w-[68%] ${
                          esAdmin
                            ? `bg-[var(--accent)] text-[var(--accent-contrast)] rounded-[18px] ${ultimoDelGrupo ? "rounded-br-[6px]" : ""}`
                            : `bg-[var(--black-3)] text-[var(--text-primary)] rounded-[18px] ${ultimoDelGrupo ? "rounded-bl-[6px]" : ""}`
                        }`}
                      >
                        {m.texto && <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.45]">{m.texto}</p>}
                        {m.archivo_nombre && m.archivo_path && (
                          <button
                            onClick={() => descargar(m.archivo_path!)}
                            className={`mt-0.5 flex w-full min-w-[200px] items-center gap-3 rounded-[12px] p-2.5 text-left ${
                              esAdmin ? "bg-black/10 hover:bg-black/15" : "bg-[var(--black-4)] hover:bg-[var(--black-5)]"
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${
                                esAdmin ? "bg-black/15" : "bg-[var(--black-5)] text-[var(--accent)]"
                              }`}
                            >
                              <IconoArchivo tipo={m.archivo_tipo || "imagen"} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold">{m.archivo_nombre}</span>
                              <span className={`text-[11px] uppercase ${esAdmin ? "opacity-60" : "text-[var(--text-tertiary)]"}`}>
                                {m.archivo_tipo || "archivo"} · Descargar
                              </span>
                            </span>
                            <Download className="h-4 w-4 shrink-0 opacity-70" />
                          </button>
                        )}
                        <span
                          className={`mt-0.5 flex items-center justify-end gap-1 text-[10.5px] ${
                            esAdmin ? "text-black/55" : "text-[var(--text-tertiary)]"
                          }`}
                        >
                          {hora(m.creado_en)}
                          {esAdmin &&
                            (m.leido ? (
                              <CheckCheck className="h-3.5 w-3.5 text-black/80" aria-label="Leído" />
                            ) : (
                              <Check className="h-3.5 w-3.5" aria-label="Enviado" />
                            ))}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                );
              })}

              {pendientes.map((p) => (
                <div key={p.tempId} className="mt-1 flex flex-col items-end">
                  <div
                    className={`max-w-[85%] rounded-[18px] rounded-br-[6px] px-3.5 py-2 md:max-w-[68%] ${
                      p.estado === "error" ? "border border-[var(--signal-error)] bg-[var(--signal-error)]/10" : "bg-[var(--accent)]/70"
                    } text-[var(--accent-contrast)]`}
                  >
                    <p className={`whitespace-pre-wrap break-words text-[14px] leading-[1.45] ${p.estado === "error" ? "text-[var(--text-primary)]" : ""}`}>
                      {p.archivoNombre ? `📎 ${p.archivoNombre}` : p.texto}
                    </p>
                    {p.estado === "enviando" && (
                      <span className="mt-0.5 flex items-center justify-end gap-1 text-[10.5px] text-black/55">
                        {p.archivoNombre ? "Subiendo" : "Enviando"} <Clock className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  {p.estado === "error" && (
                    <span className="mt-1 flex items-center gap-2 text-[12px] text-[var(--signal-error)]">
                      No se envió.
                      <button onClick={() => mandar(p.texto, p.tempId)} className="flex items-center gap-1 font-semibold underline">
                        <RotateCcw className="h-3 w-3" /> Reintentar
                      </button>
                      <button
                        onClick={() => setPendientes((prev) => prev.filter((x) => x.tempId !== p.tempId))}
                        className="text-[var(--text-tertiary)] underline"
                      >
                        Descartar
                      </button>
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {hayNuevosAbajo && (
          <button
            onClick={irAbajo}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-2 text-[12px] font-bold text-[var(--accent-contrast)] shadow-lg"
          >
            <ArrowDown className="h-3.5 w-3.5" /> Mensajes nuevos
          </button>
        )}
      </div>

      {/* Respuestas rápidas */}
      {rapidasAbiertas && (
        <div className="tm-sin-scrollbar flex shrink-0 gap-2 overflow-x-auto border-t border-[var(--border-subtle)] px-3 py-2.5 md:flex-wrap md:px-5">
          {RESPUESTAS_RAPIDAS.map((r) => (
            <button
              key={r}
              onClick={() => usarRapida(r)}
              className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--black-3)] px-3 py-1.5 text-[12.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-primary)]"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Escritura */}
      <form
        onSubmit={enviarTexto}
        className="flex shrink-0 items-end gap-2 bg-[var(--black-2)] px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 md:border-t md:border-[var(--border-subtle)] md:bg-transparent md:px-4 md:py-3"
      >
        <input ref={archivoRef} type="file" accept="image/*,application/pdf,.zip" onChange={adjuntar} className="hidden" />

        {/* Cápsula de escritura: respuestas rápidas · texto · adjuntar */}
        <div className="flex min-h-11 flex-1 items-end rounded-[24px] border border-[var(--border-subtle)] bg-[var(--black-3)] focus-within:border-[var(--border-focus)]">
          <button
            type="button"
            onClick={() => setRapidasAbiertas((v) => !v)}
            aria-label="Respuestas rápidas"
            title="Respuestas rápidas"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
              rapidasAbiertas ? "text-[var(--accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Zap className="h-5 w-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={texto}
            rows={1}
            onChange={(e) => {
              setTexto(e.target.value);
              ajustarAlto();
            }}
            onKeyDown={alPresionarTecla}
            placeholder="Mensaje"
            enterKeyHint="enter"
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent py-[10px] text-[16px] leading-[1.4] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] md:text-[14px] md:leading-[1.5]"
          />
          <button
            type="button"
            onClick={() => archivoRef.current?.click()}
            disabled={subiendo}
            aria-label="Adjuntar archivo"
            title="Adjuntar imagen, PDF o ZIP"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-40"
          >
            {subiendo ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5 -rotate-45" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!texto.trim()}
          aria-label="Enviar"
          // Evita que el teclado del celular se cierre al tocar "Enviar".
          onMouseDown={(e) => e.preventDefault()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] transition-transform active:scale-90 disabled:opacity-35"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </form>
      <p className="hidden shrink-0 px-5 pb-2 text-right text-[11px] text-[var(--text-tertiary)] md:block">
        Enter para enviar · Shift + Enter para salto de línea
      </p>
    </div>
  );
}
