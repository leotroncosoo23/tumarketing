"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Archive, Download, Paperclip, SendHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { enviarMensaje, marcarMensajesLeidos, obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { inferirTipoArchivo, type MensajeProyecto, type TipoArchivoMensaje } from "@/lib/mensajes";

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

// Chat en vivo de un proyecto (servicio_contratado). Se usa tanto en el detalle
// del proyecto como embebido en /usuarios/mensajes, para no duplicar la lógica
// de envío/adjuntos/tiempo real en dos lugares.
//
// Quien lo instancia debe pasarle `key={servicioContratadoId}`: así React lo
// remonta entero al cambiar de conversación y el estado (mensajes, cargando)
// arranca limpio sin resetearlo a mano dentro de un efecto.
export default function ChatProyecto({ servicioContratadoId, titulo }: { servicioContratadoId: string; titulo: string }) {
  const [mensajes, setMensajes] = useState<MensajeProyecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const finMensajesRef = useRef<HTMLDivElement>(null);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from("mensajes_proyecto")
        .select("*")
        .eq("servicio_contratado_id", servicioContratadoId)
        .order("creado_en", { ascending: true });

      if (error) console.error("Error al traer los mensajes:", error.message);
      setMensajes((data as MensajeProyecto[]) || []);
      marcarMensajesLeidos(servicioContratadoId);
      setCargando(false);
    };
    cargar();
  }, [servicioContratadoId]);

  useEffect(() => {
    const canal = supabase
      .channel(`mensajes-proyecto-${servicioContratadoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes_proyecto", filter: `servicio_contratado_id=eq.${servicioContratadoId}` },
        (payload) => {
          setMensajes((prev) => [...prev, payload.new as MensajeProyecto]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [servicioContratadoId]);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarTexto = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = textoMensaje.trim();
    if (!texto) return;

    setTextoMensaje("");
    const resultado = await enviarMensaje({ servicioContratadoId, texto });
    if (resultado?.error) alert(resultado.error);
  };

  const adjuntarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);
    const tipo = inferirTipoArchivo(archivo);
    const path = `${servicioContratadoId}/${Date.now()}-${archivo.name}`;

    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      alert("Error al subir el archivo: " + errorSubida.message);
      setSubiendo(false);
      e.target.value = "";
      return;
    }

    const resultado = await enviarMensaje({
      servicioContratadoId,
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

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
        <span className="w-11 h-11 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-lg shrink-0">
          🎧
        </span>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm truncate">{titulo}</p>
          <p className="text-xs text-[#ccff00] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            En línea
          </p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3 min-h-0">
        {cargando ? (
          <p className="text-center text-neutral-500 text-sm py-8">Cargando...</p>
        ) : mensajes.length === 0 ? (
          <p className="text-center text-neutral-500 text-sm py-8">
            Todavía no hay mensajes. Escribile al equipo para arrancar la conversación.
          </p>
        ) : (
          mensajes.map((msg) => {
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
                  <p className={`text-[10px] mt-1 text-right ${esCliente ? "text-black/50" : "text-neutral-500"}`}>{hora}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={finMensajesRef} />
      </div>

      <form onSubmit={enviarTexto} className="flex items-center gap-2 p-3 border-t border-neutral-800 shrink-0">
        <input ref={inputArchivoRef} type="file" accept="image/*,application/pdf,.zip" onChange={adjuntarArchivo} className="hidden" />
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
  );
}
