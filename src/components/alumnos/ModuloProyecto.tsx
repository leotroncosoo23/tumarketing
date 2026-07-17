"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { obtenerUrlArchivo } from "@/lib/mensajes-actions";
import { aprobarPost, solicitarCambiosPost } from "@/lib/posts-actions";
import type { MensajeProyecto } from "@/lib/mensajes";

type PostCalendario = {
  id: string;
  titulo: string;
  copy: string | null;
  imagen_path: string | null;
  fecha_publicacion: string;
  estado: "pendiente" | "aprobado" | "cambios_solicitados";
  comentario_cliente: string | null;
  respuesta_admin: string | null;
};

type MetricaMensual = {
  id: string;
  mes: string;
  inversion: number | null;
  clics: number | null;
  leads: number | null;
  conversaciones_ia: number | null;
  tiempo_ahorrado_horas: number | null;
};

type BrandKit = {
  logo_png_path: string | null;
  logo_svg_path: string | null;
  logo_blanco_path: string | null;
  logo_negro_path: string | null;
  colores: { nombre: string; hex: string }[];
  tipografias: { nombre: string; url: string }[];
};

type ModuloProyectoProps = {
  modulo: string;
  servicioContratadoId: string;
  linkStaging: string | null;
  linkPanelFinal: string | null;
  videoTutorialUrl: string | null;
  mensajesImagenesCliente: MensajeProyecto[];
};

function Tarjeta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">{titulo}</p>
      {children}
    </div>
  );
}

function ModuloWeb({ linkStaging, linkPanelFinal, videoTutorialUrl }: Pick<ModuloProyectoProps, "linkStaging" | "linkPanelFinal" | "videoTutorialUrl">) {
  const sinNada = !linkStaging && !linkPanelFinal && !videoTutorialUrl;

  return (
    <Tarjeta titulo="Accesos del Proyecto">
      {sinNada ? (
        <p className="text-sm text-neutral-500">Todavía no hay accesos cargados para este proyecto.</p>
      ) : (
        <div className="space-y-2">
          {linkStaging && (
            <a href={linkStaging} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-xl p-3 text-sm font-bold text-white transition-colors">
              🔗 Ver sitio de prueba <span>→</span>
            </a>
          )}
          {linkPanelFinal && (
            <a href={linkPanelFinal} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-xl p-3 text-sm font-bold text-white transition-colors">
              🛠️ Ir a tu panel <span>→</span>
            </a>
          )}
          {videoTutorialUrl && (
            <a href={videoTutorialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-xl p-3 text-sm font-bold text-white transition-colors">
              🎥 Ver tutorial <span>→</span>
            </a>
          )}
        </div>
      )}
    </Tarjeta>
  );
}

function ModuloSocial({ servicioContratadoId, mensajesImagenesCliente }: Pick<ModuloProyectoProps, "servicioContratadoId" | "mensajesImagenesCliente">) {
  const [posts, setPosts] = useState<PostCalendario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [comentarioAbierto, setComentarioAbierto] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [urlsImagenes, setUrlsImagenes] = useState<Record<string, string>>({});

  const cargarPosts = async () => {
    const { data, error } = await supabase
      .from("posts_calendario")
      .select("*")
      .eq("servicio_contratado_id", servicioContratadoId)
      .order("fecha_publicacion", { ascending: true });

    if (error) console.error("Error al traer el calendario:", error.message);
    setPosts((data as PostCalendario[]) || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarPosts();
  }, [servicioContratadoId]);

  useEffect(() => {
    posts.forEach((post) => {
      if (post.imagen_path && !urlsImagenes[post.id]) {
        obtenerUrlArchivo(post.imagen_path).then((r) => {
          if (r.url) setUrlsImagenes((prev) => ({ ...prev, [post.id]: r.url! }));
        });
      }
    });
  }, [posts]);

  const aprobar = async (postId: string) => {
    const resultado = await aprobarPost(postId);
    if (resultado.error) return alert(resultado.error);
    await cargarPosts();
  };

  const enviarCambios = async (postId: string) => {
    setEnviando(true);
    const resultado = await solicitarCambiosPost(postId, comentario);
    setEnviando(false);
    if (resultado.error) return alert(resultado.error);
    setComentarioAbierto(null);
    setComentario("");
    await cargarPosts();
  };

  return (
    <>
      <Tarjeta titulo="Calendario de Aprobación">
        {cargando ? (
          <p className="text-sm text-neutral-500">Cargando...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-neutral-500">Todavía no hay posts para revisar.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                {urlsImagenes[post.id] && (
                  <img src={urlsImagenes[post.id]} alt={post.titulo} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-white text-sm truncate">{post.titulo}</p>
                  <span
                    className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      post.estado === "aprobado"
                        ? "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30"
                        : post.estado === "cambios_solicitados"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                    }`}
                  >
                    {post.estado === "aprobado" ? "Aprobado" : post.estado === "cambios_solicitados" ? "Cambios pedidos" : "Pendiente"}
                  </span>
                </div>
                {post.copy && <p className="text-neutral-400 text-sm mb-2 whitespace-pre-wrap">{post.copy}</p>}
                <p className="text-xs text-neutral-500 mb-3">
                  📅 {new Date(post.fecha_publicacion).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>

                {post.estado === "pendiente" && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => aprobar(post.id)}
                        className="flex-1 bg-[#ccff00] text-black text-xs font-bold py-2 rounded-lg hover:bg-[#b8e600] transition-colors"
                      >
                        ✅ Aprobar
                      </button>
                      <button
                        onClick={() => setComentarioAbierto(comentarioAbierto === post.id ? null : post.id)}
                        className="flex-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold py-2 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-colors"
                      >
                        🔄 Solicitar Cambio
                      </button>
                    </div>
                    {comentarioAbierto === post.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          placeholder="Contanos qué querés cambiar..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ccff00] h-20 resize-none"
                        />
                        <button
                          onClick={() => enviarCambios(post.id)}
                          disabled={enviando || !comentario.trim()}
                          className="w-full bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold py-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40"
                        >
                          {enviando ? "Enviando..." : "Enviar comentario"}
                        </button>
                      </div>
                    )}
                  </>
                )}
                {post.estado === "cambios_solicitados" && post.comentario_cliente && (
                  <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-2 mt-1">
                    Tu comentario: {post.comentario_cliente}
                  </p>
                )}
                {post.respuesta_admin && (
                  <p className="text-xs text-[#ccff00] bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-lg p-2 mt-1">
                    La agencia respondió: {post.respuesta_admin}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Tarjeta>

      <Tarjeta titulo="Repositorio de Medios">
        {mensajesImagenesCliente.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Todavía no compartiste fotos. Podés mandarlas desde el chat con el clip 📎.
          </p>
        ) : (
          <p className="text-sm text-neutral-500">
            {mensajesImagenesCliente.length} foto{mensajesImagenesCliente.length !== 1 ? "s" : ""} compartida
            {mensajesImagenesCliente.length !== 1 ? "s" : ""} por el chat.
          </p>
        )}
      </Tarjeta>
    </>
  );
}

function ModuloAds({ servicioContratadoId }: Pick<ModuloProyectoProps, "servicioContratadoId">) {
  const [metricas, setMetricas] = useState<MetricaMensual[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from("metricas_mensuales")
        .select("*")
        .eq("servicio_contratado_id", servicioContratadoId)
        .order("mes", { ascending: false });

      if (error) console.error("Error al traer métricas:", error.message);
      setMetricas((data as MetricaMensual[]) || []);
      setCargando(false);
    };
    cargar();
  }, [servicioContratadoId]);

  const actual = metricas[0] || null;
  const anteriores = metricas.slice(1);

  const stat = (etiqueta: string, valor: number | null, prefijo = "") =>
    valor === null || valor === undefined ? null : (
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] font-bold uppercase text-neutral-500 mb-1">{etiqueta}</p>
        <p className="text-2xl font-black text-[#ccff00]">
          {prefijo}
          {valor.toLocaleString("es-AR")}
        </p>
      </div>
    );

  return (
    <Tarjeta titulo="Métricas del Mes">
      {cargando ? (
        <p className="text-sm text-neutral-500">Cargando...</p>
      ) : !actual ? (
        <p className="text-sm text-neutral-500">Todavía no hay métricas cargadas para este proyecto.</p>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-3">
            {new Date(actual.mes).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {stat("Inversión", actual.inversion, "$")}
            {stat("Clics", actual.clics)}
            {stat("Leads", actual.leads)}
            {stat("Conversaciones IA", actual.conversaciones_ia)}
            {stat("Horas ahorradas", actual.tiempo_ahorrado_horas)}
          </div>
          {anteriores.length > 0 && (
            <>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mb-2">Meses anteriores</p>
              <ul className="space-y-1">
                {anteriores.map((m) => (
                  <li key={m.id} className="text-xs text-neutral-400 flex justify-between bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                    <span>{new Date(m.mes).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</span>
                    {m.inversion !== null && <span>${m.inversion.toLocaleString("es-AR")}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Tarjeta>
  );
}

function ModuloBranding({ servicioContratadoId }: Pick<ModuloProyectoProps, "servicioContratadoId">) {
  const [kit, setKit] = useState<BrandKit | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from("brand_kits")
        .select("*")
        .eq("servicio_contratado_id", servicioContratadoId)
        .maybeSingle();

      if (error) console.error("Error al traer el brand kit:", error.message);
      setKit((data as BrandKit) || null);
      setCargando(false);
    };
    cargar();
  }, [servicioContratadoId]);

  const descargarLogo = async (path: string | null, nombre: string) => {
    if (!path) return;
    const resultado = await obtenerUrlArchivo(path);
    if (resultado.error || !resultado.url) return alert(resultado.error || "No pudimos generar el link de descarga.");
    window.open(resultado.url, "_blank", "noopener,noreferrer");
    void nombre;
  };

  const copiarHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const variantes = kit
    ? [
        { nombre: "PNG", path: kit.logo_png_path },
        { nombre: "SVG", path: kit.logo_svg_path },
        { nombre: "Fondo blanco", path: kit.logo_blanco_path },
        { nombre: "Fondo negro", path: kit.logo_negro_path },
      ].filter((v) => v.path)
    : [];

  return (
    <Tarjeta titulo="Brand Kit">
      {cargando ? (
        <p className="text-sm text-neutral-500">Cargando...</p>
      ) : !kit ? (
        <p className="text-sm text-neutral-500">Todavía no hay un brand kit cargado para este proyecto.</p>
      ) : (
        <div className="space-y-5">
          {variantes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mb-2">Logo</p>
              <div className="grid grid-cols-2 gap-2">
                {variantes.map((v) => (
                  <button
                    key={v.nombre}
                    onClick={() => descargarLogo(v.path, v.nombre)}
                    className="bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-lg p-3 text-xs font-bold text-white transition-colors text-left"
                  >
                    ⬇️ {v.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {kit.colores?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mb-2">Colores</p>
              <div className="flex flex-wrap gap-2">
                {kit.colores.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => copiarHex(c.hex)}
                    title="Copiar HEX"
                    className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 hover:border-[#ccff00]/40 rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    {c.nombre} · {c.hex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {kit.tipografias?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mb-2">Tipografías</p>
              <ul className="space-y-1.5">
                {kit.tipografias.map((f) => (
                  <li key={f.nombre}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-300 hover:text-[#ccff00] font-medium underline underline-offset-2"
                    >
                      {f.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Tarjeta>
  );
}

export default function ModuloProyecto(props: ModuloProyectoProps) {
  if (props.modulo === "web") return <ModuloWeb {...props} />;
  if (props.modulo === "social") return <ModuloSocial {...props} />;
  if (props.modulo === "ads") return <ModuloAds {...props} />;
  if (props.modulo === "branding") return <ModuloBranding {...props} />;
  return null;
}
