"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Paperclip, SendHorizontal, FileText, Image as ImageIcon, Archive, Download, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enviarMensaje, marcarMensajesLeidos, obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { inferirTipoArchivo, type MensajeProyecto, type TipoArchivoMensaje } from "@/lib/mensajes";

type Proyecto = {
  id: string;
  estado: string;
  usuarios: { nombre: string | null; email: string } | null;
  servicios: { titulo: string } | null;
};

type Briefing = {
  plan: string;
  whatsapp: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  objetivo_negocio: string;
  cliente_ideal: string;
  gestion_cuenta: string;
  created_at: string;
};

function IconoArchivo({ tipo }: { tipo: TipoArchivoMensaje }) {
  if (tipo === "pdf") return <FileText className="w-5 h-5" />;
  if (tipo === "zip") return <Archive className="w-5 h-5" />;
  return <ImageIcon className="w-5 h-5" />;
}

function ultimoMensajePreview(mensajes: MensajeProyecto[]) {
  const ultimo = mensajes[mensajes.length - 1];
  if (!ultimo) return "Sin mensajes todavía";
  if (ultimo.texto) return ultimo.texto;
  if (ultimo.archivo_nombre) return `📎 ${ultimo.archivo_nombre}`;
  return "";
}

export default function MensajesTab() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [mensajesPorProyecto, setMensajesPorProyecto] = useState<Record<string, MensajeProyecto[]>>({});
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [proyectoActivoId, setProyectoActivoId] = useState<string | null>(null);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const [mostrarFicha, setMostrarFicha] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [cargandoFicha, setCargandoFicha] = useState(false);

  const inputArchivoRef = useRef<HTMLInputElement>(null);
  const finMensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cargar = async () => {
      const [proyectosRes, mensajesRes] = await Promise.all([
        supabase
          .from("servicios_contratados")
          .select("id, estado, usuarios (nombre, email), servicios (titulo)")
          .order("otorgado_en", { ascending: false }),
        supabase.from("mensajes_proyecto").select("*").order("creado_en", { ascending: true }),
      ]);

      if (proyectosRes.error) console.error("Error al traer proyectos:", proyectosRes.error.message);
      if (mensajesRes.error) console.error("Error al traer mensajes:", mensajesRes.error.message);

      setProyectos((proyectosRes.data as unknown as Proyecto[]) || []);

      const agrupados: Record<string, MensajeProyecto[]> = {};
      ((mensajesRes.data as MensajeProyecto[]) || []).forEach((m) => {
        if (!agrupados[m.servicio_contratado_id]) agrupados[m.servicio_contratado_id] = [];
        agrupados[m.servicio_contratado_id].push(m);
      });
      setMensajesPorProyecto(agrupados);
      setCargando(false);
    };
    cargar();
  }, []);

  // Escucha global: un mensaje nuevo puede llegar para cualquier chat de la lista.
  useEffect(() => {
    const canal = supabase
      .channel("mensajes-proyecto-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_proyecto" }, (payload) => {
        const nuevo = payload.new as MensajeProyecto;
        setMensajesPorProyecto((prev) => ({
          ...prev,
          [nuevo.servicio_contratado_id]: [...(prev[nuevo.servicio_contratado_id] || []), nuevo],
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [proyectoActivoId, mensajesPorProyecto]);

  const proyectosFiltrados = proyectos.filter((p) =>
    (p.usuarios?.nombre || p.usuarios?.email || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const noLeidosPorProyecto = useMemo(() => {
    const conteo: Record<string, number> = {};
    Object.entries(mensajesPorProyecto).forEach(([id, mensajes]) => {
      conteo[id] = mensajes.filter((m) => m.autor_rol === "cliente" && !m.leido).length;
    });
    return conteo;
  }, [mensajesPorProyecto]);

  const proyectoActivo = proyectos.find((p) => p.id === proyectoActivoId) || null;
  const mensajesActivos = proyectoActivoId ? mensajesPorProyecto[proyectoActivoId] || [] : [];

  const abrirChat = async (id: string) => {
    setProyectoActivoId(id);
    setMostrarFicha(false);

    if ((noLeidosPorProyecto[id] || 0) > 0) {
      setMensajesPorProyecto((prev) => ({
        ...prev,
        [id]: (prev[id] || []).map((m) => (m.autor_rol === "cliente" ? { ...m, leido: true } : m)),
      }));
      await marcarMensajesLeidos(id);
    }
  };

  const enviarTexto = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = textoMensaje.trim();
    if (!texto || !proyectoActivoId) return;

    setTextoMensaje("");
    const resultado = await enviarMensaje({ servicioContratadoId: proyectoActivoId, texto });
    if (resultado?.error) alert(resultado.error);
  };

  const adjuntarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo || !proyectoActivoId) return;

    setSubiendo(true);
    const tipo = inferirTipoArchivo(archivo);
    const path = `${proyectoActivoId}/${Date.now()}-${archivo.name}`;

    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      alert("Error al subir el archivo: " + errorSubida.message);
      setSubiendo(false);
      e.target.value = "";
      return;
    }

    const resultado = await enviarMensaje({
      servicioContratadoId: proyectoActivoId,
      archivoNombre: archivo.name,
      archivoTipo: tipo,
      archivoPath: path,
    });
    if (resultado?.error) alert(resultado.error);

    setSubiendo(false);
    e.target.value = "";
  };

  const descargarArchivo = async (path: string) => {
    const resultado = await obtenerUrlArchivo(path);
    if (resultado.error || !resultado.url) {
      alert(resultado.error || "No pudimos generar el link de descarga.");
      return;
    }
    window.open(resultado.url, "_blank", "noopener,noreferrer");
  };

  const abrirFicha = async () => {
    if (!proyectoActivoId) return;
    setMostrarFicha(true);
    setCargandoFicha(true);

    const { data, error } = await supabase
      .from("briefings")
      .select("plan, whatsapp, instagram_url, facebook_url, youtube_url, objetivo_negocio, cliente_ideal, gestion_cuenta, created_at")
      .eq("servicio_contratado_id", proyectoActivoId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) console.error("Error al traer el briefing:", error.message);
    setBriefing((data as Briefing) || null);
    setCargandoFicha(false);
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-black">💬 Mensajes</h1>
        <p className="text-neutral-400 text-sm">Tu bandeja de entrada con todos los clientes de servicios.</p>
      </div>

      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* COLUMNA IZQUIERDA: Lista de chats (30%) */}
        <div
          className={`w-full md:w-[30%] border-r border-neutral-800 flex-col ${
            proyectoActivo ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-neutral-800 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-[#ccff00] transition-colors"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-neutral-800">
            {cargando ? (
              <div className="p-8 text-center text-neutral-500 text-sm">Cargando...</div>
            ) : proyectosFiltrados.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-sm">Ningún cliente coincide con tu búsqueda.</div>
            ) : (
              proyectosFiltrados.map((proyecto) => {
                const nombreCliente = proyecto.usuarios?.nombre || proyecto.usuarios?.email || "Sin nombre";
                const noLeidos = noLeidosPorProyecto[proyecto.id] || 0;
                return (
                  <button
                    key={proyecto.id}
                    onClick={() => abrirChat(proyecto.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      proyectoActivoId === proyecto.id ? "bg-[#ccff00]/10" : "hover:bg-neutral-800/40"
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300 shrink-0">
                      {nombreCliente
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm truncate">{nombreCliente}</span>
                        {noLeidos > 0 && (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#ccff00] text-black text-[10px] font-black flex items-center justify-center">
                            {noLeidos}
                          </span>
                        )}
                      </div>
                      <p className="text-[#ccff00]/80 text-xs font-bold truncate mb-0.5">
                        {proyecto.servicios?.titulo || "Servicio"}
                      </p>
                      <p className="text-neutral-500 text-xs truncate">
                        {ultimoMensajePreview(mensajesPorProyecto[proyecto.id] || [])}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Chat activo (70%) */}
        <div className={`w-full md:w-[70%] flex-col ${proyectoActivo ? "flex" : "hidden md:flex"}`}>
          {!proyectoActivo ? (
            <div className="flex-grow flex items-center justify-center text-center p-8">
              <div>
                <span className="text-4xl mb-4 block">💬</span>
                <p className="text-neutral-400">Elegí un cliente de la lista para ver la conversación.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cabecera */}
              <div className="flex items-center justify-between gap-3 p-4 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setProyectoActivoId(null)}
                    className="md:hidden shrink-0 text-neutral-400 hover:text-white p-1 -ml-1"
                    aria-label="Volver a la lista"
                  >
                    ←
                  </button>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">
                      {proyectoActivo.usuarios?.nombre || proyectoActivo.usuarios?.email}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{proyectoActivo.servicios?.titulo}</p>
                  </div>
                </div>
                <button
                  onClick={abrirFicha}
                  className="shrink-0 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/50 text-neutral-300 hover:text-[#ccff00] text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Ver ficha del proyecto
                </button>
              </div>

              {/* Mensajes */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {mensajesActivos.length === 0 && (
                  <p className="text-center text-neutral-500 text-sm py-8">Todavía no hay mensajes con este cliente.</p>
                )}
                {mensajesActivos.map((msg) => {
                  const esAdmin = msg.autor_rol === "admin";
                  const hora = new Date(msg.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={msg.id} className={`flex ${esAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${
                          esAdmin ? "bg-[#ccff00] text-black rounded-br-sm" : "bg-neutral-800 text-white rounded-bl-sm"
                        }`}
                      >
                        {msg.texto && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>}
                        {msg.archivo_nombre && msg.archivo_path && (
                          <div className={`flex items-center gap-3 rounded-xl p-3 ${esAdmin ? "bg-black/10" : "bg-neutral-950/60"}`}>
                            <span
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                esAdmin ? "bg-black/10 text-black" : "bg-neutral-800 text-[#ccff00]"
                              }`}
                            >
                              <IconoArchivo tipo={msg.archivo_tipo || "imagen"} />
                            </span>
                            <span className="min-w-0 flex-grow text-sm font-medium truncate">{msg.archivo_nombre}</span>
                            <button
                              onClick={() => descargarArchivo(msg.archivo_path!)}
                              className="shrink-0"
                              aria-label="Descargar"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <p className={`text-[10px] mt-1 text-right ${esAdmin ? "text-black/50" : "text-neutral-500"}`}>
                          {hora}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={finMensajesRef} />
              </div>

              {/* Barra de entrada */}
              <div className="border-t border-neutral-800 p-3 shrink-0">
                <form onSubmit={enviarTexto} className="flex items-center gap-2">
                  <input
                    ref={inputArchivoRef}
                    type="file"
                    accept="image/*,application/pdf,.zip"
                    onChange={adjuntarArchivo}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputArchivoRef.current?.click()}
                    disabled={subiendo}
                    title="Adjuntar PDF, PNG, JPG o ZIP — sin pérdida de calidad"
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#ccff00] hover:bg-neutral-800 transition-colors disabled:opacity-40"
                    aria-label="Adjuntar archivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={textoMensaje}
                    onChange={(e) => setTextoMensaje(e.target.value)}
                    placeholder={subiendo ? "Subiendo archivo..." : "Escribí un mensaje..."}
                    disabled={subiendo}
                    className="flex-grow bg-neutral-950 border border-neutral-800 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#ccff00] transition-colors disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!textoMensaje.trim() || subiendo}
                    className="shrink-0 w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center hover:bg-[#b8e600] transition-colors disabled:opacity-40"
                    aria-label="Enviar"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-neutral-600 mt-2 text-center">
                  Adjuntá PDF, PNG, JPG o ZIP — se envían sin pérdida de calidad.
                </p>
              </div>
            </>
          )}
        </div>

        {/* PANEL: Ficha del proyecto (briefing) */}
        {mostrarFicha && proyectoActivo && (
          <div className="absolute inset-0 z-10 flex justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMostrarFicha(false)} />
            <div className="relative w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Ficha del Proyecto</h2>
                <button
                  onClick={() => setMostrarFicha(false)}
                  className="text-neutral-500 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cargandoFicha ? (
                <p className="text-neutral-400 text-sm">Cargando...</p>
              ) : !briefing ? (
                <p className="text-neutral-400 text-sm">
                  {proyectoActivo.usuarios?.nombre || "Este cliente"} todavía no completó el formulario base.
                </p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Plan</p>
                    <p className="text-white font-bold">{briefing.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">WhatsApp</p>
                    <p className="text-white">{briefing.whatsapp || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Plataformas</p>
                    <ul className="space-y-1 text-sm">
                      <li className="text-neutral-300">
                        <span className="text-neutral-500">Instagram:</span> {briefing.instagram_url || "—"}
                      </li>
                      <li className="text-neutral-300">
                        <span className="text-neutral-500">Facebook:</span> {briefing.facebook_url || "—"}
                      </li>
                      <li className="text-neutral-300">
                        <span className="text-neutral-500">YouTube:</span> {briefing.youtube_url || "—"}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Objetivo del negocio</p>
                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{briefing.objetivo_negocio || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Cliente ideal</p>
                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{briefing.cliente_ideal || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Gestión de cuenta</p>
                    <p className="text-neutral-300 text-sm">
                      {briefing.gestion_cuenta === "agencia"
                        ? "La agencia administra y publica el contenido."
                        : "El cliente se encarga de publicar."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-500 mb-1">Enviado el</p>
                    <p className="text-neutral-300 text-sm">
                      {new Date(briefing.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
