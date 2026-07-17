"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  FileText,
  Image as ImageIcon,
  Archive,
  Download,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlumnoSession } from "@/lib/useAlumnoSession";
import { enviarMensaje, obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { inferirTipoArchivo, type MensajeProyecto, type TipoArchivoMensaje } from "@/lib/mensajes";
import { ESTADOS_SERVICIO_CONTRATADO, ETIQUETA_ESTADO } from "@/lib/estado-servicio";
import FacturacionCard from "@/components/alumnos/FacturacionCard";
import ModuloProyecto from "@/components/alumnos/ModuloProyecto";

const PASOS_ESTADO = ESTADOS_SERVICIO_CONTRATADO;

type Proyecto = {
  id: string;
  estado: string;
  servicio_id: string;
  suspendido: boolean;
  link_staging: string | null;
  link_panel_final: string | null;
  video_tutorial_url: string | null;
  servicios: { titulo: string; descripcion_corta: string | null; tiempo_entrega: string | null; modulo: string } | null;
};

function IconoArchivo({ tipo }: { tipo: TipoArchivoMensaje }) {
  if (tipo === "pdf") return <FileText className="w-5 h-5" />;
  if (tipo === "zip") return <Archive className="w-5 h-5" />;
  return <ImageIcon className="w-5 h-5" />;
}

function BurbujaArchivo({
  nombre,
  tipo,
  esCliente,
  onDescargar,
}: {
  nombre: string;
  tipo: TipoArchivoMensaje;
  esCliente: boolean;
  onDescargar: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${esCliente ? "bg-black/10" : "bg-neutral-950/60"}`}>
      <span
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          esCliente ? "bg-black/10 text-black" : "bg-neutral-800 text-[#ccff00]"
        }`}
      >
        <IconoArchivo tipo={tipo} />
      </span>
      <span className="min-w-0 flex-grow text-sm font-medium truncate">{nombre}</span>
      <button
        onClick={onDescargar}
        className={`shrink-0 p-1.5 rounded-lg transition-colors ${esCliente ? "hover:bg-black/10" : "hover:bg-neutral-800"}`}
        aria-label="Descargar"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProyectoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { perfil, cargando } = useAlumnoSession();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [cargandoProyecto, setCargandoProyecto] = useState(true);

  const [mensajes, setMensajes] = useState<MensajeProyecto[]>([]);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const finMensajesRef = useRef<HTMLDivElement>(null);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!perfil) return;

    const cargar = async () => {
      const { data: proyectoData, error: errorProyecto } = await supabase
        .from("servicios_contratados")
        .select(
          "id, estado, servicio_id, suspendido, link_staging, link_panel_final, video_tutorial_url, servicios (titulo, descripcion_corta, tiempo_entrega, modulo)"
        )
        .eq("id", id)
        .eq("usuario_id", perfil.id)
        .maybeSingle();

      if (errorProyecto) console.error("Error al traer el proyecto:", errorProyecto.message);
      setProyecto((proyectoData as unknown as Proyecto) || null);

      if (proyectoData) {
        const { data: mensajesData, error: errorMensajes } = await supabase
          .from("mensajes_proyecto")
          .select("*")
          .eq("servicio_contratado_id", id)
          .order("creado_en", { ascending: true });

        if (errorMensajes) console.error("Error al traer los mensajes:", errorMensajes.message);
        setMensajes((mensajesData as MensajeProyecto[]) || []);
      }

      setCargandoProyecto(false);
    };
    cargar();
  }, [perfil, id]);

  // Chat en vivo: cualquier mensaje nuevo (propio o de la agencia) llega acá.
  useEffect(() => {
    if (!proyecto) return;

    const canal = supabase
      .channel(`mensajes-proyecto-${proyecto.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes_proyecto", filter: `servicio_contratado_id=eq.${proyecto.id}` },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new as MensajeProyecto]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [proyecto?.id]);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarTexto = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = textoMensaje.trim();
    if (!texto || !proyecto) return;

    setTextoMensaje("");
    const resultado = await enviarMensaje({ servicioContratadoId: proyecto.id, texto });
    if (resultado?.error) alert(resultado.error);
  };

  const adjuntarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo || !proyecto) return;

    setSubiendo(true);
    const tipo = inferirTipoArchivo(archivo);
    const path = `${proyecto.id}/${Date.now()}-${archivo.name}`;

    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      alert("Error al subir el archivo: " + errorSubida.message);
      setSubiendo(false);
      e.target.value = "";
      return;
    }

    const resultado = await enviarMensaje({
      servicioContratadoId: proyecto.id,
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

  if (cargando || cargandoProyecto) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Cargando...</p>
      </main>
    );
  }
  if (!perfil) return null;

  if (!proyecto) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-black mb-4">No encontramos este proyecto</h1>
          <p className="text-neutral-400 mb-8">Puede que ya no exista o que no tengas acceso a él.</p>
          <Link
            href="/alumnos"
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
          >
            ← Volver a Mis Proyectos
          </Link>
        </div>
      </main>
    );
  }

  if (proyecto.suspendido) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-5xl mb-6">🚫</div>
          <h1 className="text-2xl font-black mb-4">Acceso suspendido</h1>
          <p className="text-neutral-400 mb-8">
            El acceso a este proyecto está suspendido temporalmente. Si creés que es un error o querés regularizar tu
            situación, contactanos y lo resolvemos.
          </p>
          <Link
            href="/alumnos"
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#b8e600] transition-colors"
          >
            ← Volver a Mis Proyectos
          </Link>
        </div>
      </main>
    );
  }

  const pasoActual = Math.max((PASOS_ESTADO as readonly string[]).indexOf(proyecto.estado), 0);
  const archivosDelProyecto = mensajes.filter((m) => m.archivo_nombre && m.archivo_path);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Link
          href="/alumnos"
          className="text-neutral-400 hover:text-white text-sm font-bold flex items-center gap-2 mb-6 transition-colors w-fit"
        >
          ← Volver a Mis Proyectos
        </Link>

        {proyecto.estado === "Esperando información" && (
          <div className="bg-neutral-900 border border-[#ccff00]/30 rounded-2xl px-6 py-4 flex items-center gap-4 mb-6">
            <span className="w-11 h-11 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center text-xl shrink-0">
              📋
            </span>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Ya recibimos tu información. <span className="text-white font-bold">Pronto vamos a revisar tu solicitud</span> —
              mientras tanto, escribinos acá si tenés alguna consulta.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Ficha del proyecto */}
          <div className="space-y-6">
            {/* Tarjeta del Plan */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-[#ccff00]/30 rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Plan Contratado</p>
              <h1 className="text-xl font-black text-white mb-3 leading-snug">
                {proyecto.servicios?.titulo || "Servicio"}
              </h1>
              {proyecto.servicios?.descripcion_corta && (
                <p className="text-neutral-400 text-sm mb-4">{proyecto.servicios.descripcion_corta}</p>
              )}
              {proyecto.servicios?.tiempo_entrega && (
                <p className="text-xs text-neutral-500">
                  ⏱️ Entrega estimada: <span className="text-white font-bold">{proyecto.servicios.tiempo_entrega}</span>
                </p>
              )}
            </div>

            {/* Timeline de estado */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-5">Estado del Proyecto</p>
              <ol className="space-y-0">
                {PASOS_ESTADO.map((paso, indice) => {
                  const completado = indice < pasoActual;
                  const activo = indice === pasoActual;
                  const esUltimo = indice === PASOS_ESTADO.length - 1;

                  return (
                    <li key={paso} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {completado ? (
                          <CheckCircle2 className="w-6 h-6 text-[#ccff00] shrink-0" />
                        ) : (
                          <Circle
                            className={`w-6 h-6 shrink-0 ${activo ? "text-[#ccff00]" : "text-neutral-700"}`}
                            fill={activo ? "#ccff00" : "transparent"}
                          />
                        )}
                        {!esUltimo && (
                          <div className={`w-0.5 flex-grow min-h-[28px] ${completado ? "bg-[#ccff00]" : "bg-neutral-800"}`} />
                        )}
                      </div>
                      <div className={`pb-7 ${esUltimo ? "pb-0" : ""}`}>
                        <p
                          className={`text-sm font-bold ${
                            activo ? "text-[#ccff00]" : completado ? "text-white" : "text-neutral-500"
                          }`}
                        >
                          {ETIQUETA_ESTADO[paso]}
                        </p>
                        {activo && <p className="text-xs text-neutral-500 mt-0.5">Paso actual</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <FacturacionCard servicioContratadoId={proyecto.id} />

            <ModuloProyecto
              modulo={proyecto.servicios?.modulo || "otro"}
              servicioContratadoId={proyecto.id}
              linkStaging={proyecto.link_staging}
              linkPanelFinal={proyecto.link_panel_final}
              videoTutorialUrl={proyecto.video_tutorial_url}
              mensajesImagenesCliente={mensajes.filter(
                (m) => m.autor_rol === "cliente" && m.archivo_tipo === "imagen" && m.archivo_path
              )}
            />

            {/* Archivos del proyecto (derivados de los mensajes con adjunto) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Archivos del Proyecto
              </p>
              {archivosDelProyecto.length === 0 ? (
                <p className="text-sm text-neutral-500">Todavía no se compartió ningún archivo.</p>
              ) : (
                <div className="space-y-2">
                  {archivosDelProyecto.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl p-3 hover:border-[#ccff00]/40 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center shrink-0">
                        <IconoArchivo tipo={msg.archivo_tipo || "imagen"} />
                      </span>
                      <div className="min-w-0 flex-grow">
                        <p className="text-sm font-medium text-white truncate">{msg.archivo_nombre}</p>
                        <p className="text-xs text-neutral-500">
                          {msg.autor_rol === "cliente" ? "Enviado por vos" : "Enviado por la agencia"}
                        </p>
                      </div>
                      <button
                        onClick={() => msg.archivo_path && descargarArchivo(msg.archivo_path)}
                        className="shrink-0 p-2 rounded-lg text-neutral-400 hover:text-[#ccff00] hover:bg-neutral-800 transition-colors"
                        aria-label="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Chat de soporte */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col h-[560px] lg:h-[calc(100vh-160px)] overflow-hidden">
            {/* Cabecera del chat */}
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
              <span className="w-11 h-11 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-lg shrink-0">
                🎧
              </span>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">Soporte TuMarketing</p>
                <p className="text-xs text-[#ccff00] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                  En línea
                </p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {mensajes.length === 0 && (
                <p className="text-center text-neutral-500 text-sm py-8">
                  Todavía no hay mensajes. Escribile al equipo para arrancar la conversación.
                </p>
              )}
              {mensajes.map((msg) => {
                const esCliente = msg.autor_rol === "cliente";
                const hora = new Date(msg.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={msg.id} className={`flex ${esCliente ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        esCliente ? "bg-[#ccff00] text-black rounded-br-sm" : "bg-neutral-800 text-white rounded-bl-sm"
                      }`}
                    >
                      {msg.texto && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>}
                      {msg.archivo_nombre && msg.archivo_path && (
                        <BurbujaArchivo
                          nombre={msg.archivo_nombre}
                          tipo={msg.archivo_tipo || "imagen"}
                          esCliente={esCliente}
                          onDescargar={() => descargarArchivo(msg.archivo_path!)}
                        />
                      )}
                      <p className={`text-[10px] mt-1 text-right ${esCliente ? "text-black/50" : "text-neutral-500"}`}>
                        {hora}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={finMensajesRef} />
            </div>

            {/* Barra de entrada */}
            <form onSubmit={enviarTexto} className="flex items-center gap-2 p-3 border-t border-neutral-800 shrink-0">
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
          </div>
        </div>
      </div>
    </main>
  );
}
