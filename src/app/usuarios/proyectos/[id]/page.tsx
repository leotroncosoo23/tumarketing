"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, FileText, Image as ImageIcon, Archive, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUsuarioSession } from "@/lib/useUsuarioSession";
import { obtenerUrlArchivo } from "@/lib/mensajes-actions";
import type { MensajeProyecto, TipoArchivoMensaje } from "@/lib/mensajes";
import { ESTADOS_SERVICIO_CONTRATADO, ETIQUETA_ESTADO } from "@/lib/estado-servicio";
import FacturacionCard from "@/components/usuarios/FacturacionCard";
import ModuloProyecto from "@/components/usuarios/ModuloProyecto";
import ChatProyecto from "@/components/usuarios/ChatProyecto";

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

export default function ProyectoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { perfil, cargando } = useUsuarioSession();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [cargandoProyecto, setCargandoProyecto] = useState(true);

  // Solo para las secciones de "Archivos del Proyecto" y avatares del módulo —
  // el chat en sí (envío, tiempo real) vive en <ChatProyecto>.
  const [mensajes, setMensajes] = useState<MensajeProyecto[]>([]);

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

  useEffect(() => {
    const proyectoId = proyecto?.id;
    if (!proyectoId) return;

    const canal = supabase
      .channel(`mensajes-proyecto-archivos-${proyectoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes_proyecto", filter: `servicio_contratado_id=eq.${proyectoId}` },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new as MensajeProyecto]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [proyecto?.id]);

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
            href="/usuarios"
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
            href="/usuarios"
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
          href="/usuarios"
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
          <div className="h-140 lg:h-[calc(100vh-160px)]">
            <ChatProyecto key={proyecto.id} servicioContratadoId={proyecto.id} titulo="Soporte TuMarketing" />
          </div>
        </div>
      </div>
    </main>
  );
}
