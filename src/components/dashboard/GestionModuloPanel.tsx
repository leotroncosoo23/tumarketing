"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type GestionModuloPanelProps = {
  servicioContratadoId: string;
  usuarioId: string;
  nombreServicio: string;
  modulo: string;
  onCerrar: () => void;
};

type PostCalendario = {
  id: string;
  titulo: string;
  fecha_publicacion: string;
  estado: string;
  comentario_cliente: string | null;
  respuesta_admin: string | null;
};

const COLUMNAS_CALENDARIO = [
  { estado: "pendiente", titulo: "⏳ Esperando Aprobación" },
  { estado: "aprobado", titulo: "✅ Aprobados" },
  { estado: "cambios_solicitados", titulo: "🔄 Con Cambios" },
] as const;

// Función de módulo (no del componente): Date.now() es impuro y no puede
// llamarse desde una función definida en el cuerpo de un componente con
// React Compiler activado (reactCompiler: true en next.config.ts).
function generarPathArchivo(carpeta: string, archivo: File, prefijoNombre = ""): string {
  return `${carpeta}/${prefijoNombre}${Date.now()}-${archivo.name}`;
}

type ColorMarca = { nombre: string; hex: string };
type Tipografia = { nombre: string; url: string };

const mesActualISO = () => {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;
};

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-black text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">{titulo}</h3>
      {children}
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClase =
  "w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ccff00]";

export default function GestionModuloPanel({ servicioContratadoId, usuarioId, nombreServicio, modulo, onCerrar }: GestionModuloPanelProps) {
  const [guardando, setGuardando] = useState(false);

  // Módulo Web
  const [linkStaging, setLinkStaging] = useState("");
  const [linkPanelFinal, setLinkPanelFinal] = useState("");
  const [videoTutorialUrl, setVideoTutorialUrl] = useState("");

  // Módulo Social
  const [posts, setPosts] = useState<PostCalendario[]>([]);
  const [tituloPost, setTituloPost] = useState("");
  const [copyPost, setCopyPost] = useState("");
  const [fechaPost, setFechaPost] = useState("");
  const [imagenPost, setImagenPost] = useState<File | null>(null);
  const [subiendoPost, setSubiendoPost] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [respondiendo, setRespondiendo] = useState<string | null>(null);

  // Módulo Ads / IA
  const [inversion, setInversion] = useState("");
  const [clics, setClics] = useState("");
  const [leads, setLeads] = useState("");
  const [conversacionesIa, setConversacionesIa] = useState("");
  const [tiempoAhorrado, setTiempoAhorrado] = useState("");

  // Módulo Branding
  const [subiendoLogo, setSubiendoLogo] = useState<string | null>(null);
  const [colores, setColores] = useState<ColorMarca[]>([]);
  const [nombreColor, setNombreColor] = useState("");
  const [hexColor, setHexColor] = useState("#ccff00");
  const [tipografias, setTipografias] = useState<Tipografia[]>([]);
  const [nombreFuente, setNombreFuente] = useState("");
  const [urlFuente, setUrlFuente] = useState("");

  // Factura manual (común a todos los módulos)
  const [conceptoFactura, setConceptoFactura] = useState(nombreServicio);
  const [montoFactura, setMontoFactura] = useState("");
  const [monedaFactura, setMonedaFactura] = useState<"ARS" | "USD">("ARS");
  const [vencimientoFactura, setVencimientoFactura] = useState("");
  const [facturaCreada, setFacturaCreada] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (modulo === "web") {
        const { data } = await supabase
          .from("servicios_contratados")
          .select("link_staging, link_panel_final, video_tutorial_url")
          .eq("id", servicioContratadoId)
          .maybeSingle();
        if (data) {
          setLinkStaging(data.link_staging || "");
          setLinkPanelFinal(data.link_panel_final || "");
          setVideoTutorialUrl(data.video_tutorial_url || "");
        }
      }

      if (modulo === "social") {
        const { data } = await supabase
          .from("posts_calendario")
          .select("id, titulo, fecha_publicacion, estado, comentario_cliente, respuesta_admin")
          .eq("servicio_contratado_id", servicioContratadoId)
          .order("fecha_publicacion", { ascending: true });
        setPosts(data || []);
      }

      if (modulo === "ads") {
        const { data } = await supabase
          .from("metricas_mensuales")
          .select("inversion, clics, leads, conversaciones_ia, tiempo_ahorrado_horas")
          .eq("servicio_contratado_id", servicioContratadoId)
          .eq("mes", mesActualISO())
          .maybeSingle();
        if (data) {
          setInversion(data.inversion?.toString() || "");
          setClics(data.clics?.toString() || "");
          setLeads(data.leads?.toString() || "");
          setConversacionesIa(data.conversaciones_ia?.toString() || "");
          setTiempoAhorrado(data.tiempo_ahorrado_horas?.toString() || "");
        }
      }

      if (modulo === "branding") {
        const { data } = await supabase
          .from("brand_kits")
          .select("colores, tipografias")
          .eq("servicio_contratado_id", servicioContratadoId)
          .maybeSingle();
        if (data) {
          setColores(data.colores || []);
          setTipografias(data.tipografias || []);
        }
      }
    };
    cargar();
  }, [servicioContratadoId, modulo]);

  const guardarWeb = async () => {
    setGuardando(true);
    const { error } = await supabase
      .from("servicios_contratados")
      .update({ link_staging: linkStaging || null, link_panel_final: linkPanelFinal || null, video_tutorial_url: videoTutorialUrl || null })
      .eq("id", servicioContratadoId);
    setGuardando(false);
    if (error) alert("Error al guardar: " + error.message);
    else alert("Accesos guardados.");
  };

  const agregarPost = async () => {
    if (!tituloPost.trim() || !fechaPost) return;
    setSubiendoPost(true);

    let imagenPath: string | null = null;
    if (imagenPost) {
      const path = generarPathArchivo(`${servicioContratadoId}/posts`, imagenPost);
      const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, imagenPost);
      if (errorSubida) {
        alert("Error al subir la imagen: " + errorSubida.message);
        setSubiendoPost(false);
        return;
      }
      imagenPath = path;
    }

    const { data, error } = await supabase
      .from("posts_calendario")
      .insert([{ servicio_contratado_id: servicioContratadoId, titulo: tituloPost.trim(), copy: copyPost.trim() || null, imagen_path: imagenPath, fecha_publicacion: fechaPost }])
      .select("id, titulo, fecha_publicacion, estado, comentario_cliente, respuesta_admin")
      .single();

    setSubiendoPost(false);
    if (error) return alert("Error al crear el post: " + error.message);

    setPosts((prev) => [...prev, data]);
    setTituloPost("");
    setCopyPost("");
    setFechaPost("");
    setImagenPost(null);
  };

  // Responder un post con "cambios solicitados" lo vuelve a poner en "pendiente"
  // para que el cliente vea la corrección y lo apruebe de nuevo.
  const responderPost = async (postId: string) => {
    const respuesta = (respuestas[postId] || "").trim();
    if (!respuesta) return;

    const { error } = await supabase
      .from("posts_calendario")
      .update({ respuesta_admin: respuesta, estado: "pendiente" })
      .eq("id", postId);

    if (error) return alert("Error al responder: " + error.message);

    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, respuesta_admin: respuesta, estado: "pendiente" } : p)));
    setRespuestas((prev) => ({ ...prev, [postId]: "" }));
    setRespondiendo(null);
  };

  const guardarMetricas = async () => {
    setGuardando(true);
    const { error } = await supabase.from("metricas_mensuales").upsert(
      [
        {
          servicio_contratado_id: servicioContratadoId,
          mes: mesActualISO(),
          inversion: inversion ? Number(inversion) : null,
          clics: clics ? Number(clics) : null,
          leads: leads ? Number(leads) : null,
          conversaciones_ia: conversacionesIa ? Number(conversacionesIa) : null,
          tiempo_ahorrado_horas: tiempoAhorrado ? Number(tiempoAhorrado) : null,
        },
      ],
      { onConflict: "servicio_contratado_id,mes" }
    );
    setGuardando(false);
    if (error) alert("Error al guardar las métricas: " + error.message);
    else alert("Métricas del mes guardadas.");
  };

  const subirLogo = async (variante: "logo_png_path" | "logo_svg_path" | "logo_blanco_path" | "logo_negro_path", archivo: File) => {
    setSubiendoLogo(variante);
    const path = generarPathArchivo(`${servicioContratadoId}/brandkit`, archivo, `${variante}-`);
    const { error: errorSubida } = await supabase.storage.from("archivos-proyectos").upload(path, archivo);
    if (errorSubida) {
      alert("Error al subir el logo: " + errorSubida.message);
      setSubiendoLogo(null);
      return;
    }
    const { error } = await supabase
      .from("brand_kits")
      .upsert([{ servicio_contratado_id: servicioContratadoId, [variante]: path }], { onConflict: "servicio_contratado_id" });
    setSubiendoLogo(null);
    if (error) alert("Error al guardar el logo: " + error.message);
  };

  const agregarColor = async () => {
    if (!nombreColor.trim()) return;
    const nuevos = [...colores, { nombre: nombreColor.trim(), hex: hexColor }];
    const { error } = await supabase
      .from("brand_kits")
      .upsert([{ servicio_contratado_id: servicioContratadoId, colores: nuevos }], { onConflict: "servicio_contratado_id" });
    if (error) return alert("Error al guardar el color: " + error.message);
    setColores(nuevos);
    setNombreColor("");
  };

  const agregarFuente = async () => {
    if (!nombreFuente.trim() || !urlFuente.trim()) return;
    const nuevas = [...tipografias, { nombre: nombreFuente.trim(), url: urlFuente.trim() }];
    const { error } = await supabase
      .from("brand_kits")
      .upsert([{ servicio_contratado_id: servicioContratadoId, tipografias: nuevas }], { onConflict: "servicio_contratado_id" });
    if (error) return alert("Error al guardar la tipografía: " + error.message);
    setTipografias(nuevas);
    setNombreFuente("");
    setUrlFuente("");
  };

  const crearFacturaManual = async () => {
    if (!conceptoFactura.trim() || !montoFactura) return;
    setGuardando(true);
    const { error } = await supabase.from("facturas").insert([
      {
        usuario_id: usuarioId,
        servicio_contratado_id: servicioContratadoId,
        concepto: conceptoFactura.trim(),
        monto: Number(montoFactura),
        moneda: monedaFactura,
        estado: "pendiente",
        fecha_vencimiento: vencimientoFactura || null,
      },
    ]);
    setGuardando(false);
    if (error) return alert("Error al crear la factura: " + error.message);
    setFacturaCreada(true);
    setMontoFactura("");
    setVencimientoFactura("");
  };

  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onCerrar} />
      <div className="relative w-full sm:w-[460px] h-full bg-neutral-950 border-l border-neutral-800 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black text-white">Gestionar entregables</h2>
          <button onClick={onCerrar} className="text-neutral-500 hover:text-white transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-6">{nombreServicio}</p>

        {modulo === "web" && (
          <Seccion titulo="🔗 Accesos del Proyecto">
            <Campo label="Link de staging (sitio de prueba)">
              <input value={linkStaging} onChange={(e) => setLinkStaging(e.target.value)} placeholder="https://..." className={inputClase} />
            </Campo>
            <Campo label="Link al panel final (Shopify / WordPress)">
              <input value={linkPanelFinal} onChange={(e) => setLinkPanelFinal(e.target.value)} placeholder="https://..." className={inputClase} />
            </Campo>
            <Campo label="Video tutorial (YouTube / Loom)">
              <input value={videoTutorialUrl} onChange={(e) => setVideoTutorialUrl(e.target.value)} placeholder="https://..." className={inputClase} />
            </Campo>
            <button onClick={guardarWeb} disabled={guardando} className="w-full bg-[#ccff00] text-black font-bold text-sm py-2.5 rounded-lg hover:bg-[#b8e600] transition disabled:opacity-40">
              {guardando ? "Guardando..." : "Guardar accesos"}
            </button>
          </Seccion>
        )}

        {modulo === "social" && (
          <Seccion titulo="📅 Calendario de Aprobación">
            {posts.length > 0 && (
              <div className="space-y-4 mb-5">
                {COLUMNAS_CALENDARIO.map((columna) => {
                  const postsColumna = posts.filter((p) => p.estado === columna.estado);
                  if (postsColumna.length === 0) return null;
                  return (
                    <div key={columna.estado}>
                      <p className="text-[10px] font-bold uppercase text-neutral-500 mb-2">
                        {columna.titulo} ({postsColumna.length})
                      </p>
                      <div className="space-y-2">
                        {postsColumna.map((p) => (
                          <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-neutral-200 truncate">{p.titulo}</span>
                              <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                                {new Date(p.fecha_publicacion).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                              </span>
                            </div>

                            {columna.estado === "cambios_solicitados" && (
                              <div className="mt-2 space-y-1.5">
                                {p.comentario_cliente && (
                                  <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                                    Cliente: {p.comentario_cliente}
                                  </p>
                                )}
                                {respondiendo === p.id ? (
                                  <div className="space-y-1.5">
                                    <textarea
                                      value={respuestas[p.id] || ""}
                                      onChange={(e) => setRespuestas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                                      placeholder="Contestá qué corregiste..."
                                      className={`${inputClase} h-16 resize-none text-xs`}
                                    />
                                    <button
                                      onClick={() => responderPost(p.id)}
                                      disabled={!(respuestas[p.id] || "").trim()}
                                      className="w-full bg-[#ccff00] text-black text-xs font-bold py-1.5 rounded-lg hover:bg-[#b8e600] transition disabled:opacity-40"
                                    >
                                      Responder y volver a pendiente
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setRespondiendo(p.id)}
                                    className="text-xs font-bold text-neutral-300 hover:text-[#ccff00]"
                                  >
                                    💬 Responder
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Campo label="Título del post">
              <input value={tituloPost} onChange={(e) => setTituloPost(e.target.value)} className={inputClase} placeholder="Ej: Post lanzamiento producto" />
            </Campo>
            <Campo label="Copy">
              <textarea value={copyPost} onChange={(e) => setCopyPost(e.target.value)} className={`${inputClase} h-20 resize-none`} />
            </Campo>
            <Campo label="Fecha de publicación">
              <input type="date" value={fechaPost} onChange={(e) => setFechaPost(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Imagen">
              <input type="file" accept="image/*" onChange={(e) => setImagenPost(e.target.files?.[0] || null)} className="text-xs text-neutral-400" />
            </Campo>
            <button onClick={agregarPost} disabled={subiendoPost || !tituloPost.trim() || !fechaPost} className="w-full bg-[#ccff00] text-black font-bold text-sm py-2.5 rounded-lg hover:bg-[#b8e600] transition disabled:opacity-40">
              {subiendoPost ? "Subiendo..." : "Agregar post"}
            </button>
          </Seccion>
        )}

        {modulo === "ads" && (
          <Seccion titulo="📊 Métricas del Mes Actual">
            <Campo label="Inversión ($)">
              <input type="number" value={inversion} onChange={(e) => setInversion(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Clics">
              <input type="number" value={clics} onChange={(e) => setClics(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Leads">
              <input type="number" value={leads} onChange={(e) => setLeads(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Conversaciones automatizadas (IA)">
              <input type="number" value={conversacionesIa} onChange={(e) => setConversacionesIa(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Horas ahorradas (IA)">
              <input type="number" value={tiempoAhorrado} onChange={(e) => setTiempoAhorrado(e.target.value)} className={inputClase} />
            </Campo>
            <button onClick={guardarMetricas} disabled={guardando} className="w-full bg-[#ccff00] text-black font-bold text-sm py-2.5 rounded-lg hover:bg-[#b8e600] transition disabled:opacity-40">
              {guardando ? "Guardando..." : "Guardar métricas del mes"}
            </button>
          </Seccion>
        )}

        {modulo === "branding" && (
          <Seccion titulo="🎨 Brand Kit">
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(
                [
                  ["logo_png_path", "PNG"],
                  ["logo_svg_path", "SVG"],
                  ["logo_blanco_path", "Fondo blanco"],
                  ["logo_negro_path", "Fondo negro"],
                ] as const
              ).map(([variante, etiqueta]) => (
                <label key={variante} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs font-bold text-neutral-300 text-center cursor-pointer hover:border-[#ccff00]/40 transition-colors">
                  {subiendoLogo === variante ? "Subiendo..." : `⬆️ ${etiqueta}`}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const archivo = e.target.files?.[0];
                      if (archivo) subirLogo(variante, archivo);
                    }}
                  />
                </label>
              ))}
            </div>

            <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Colores</p>
            {colores.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {colores.map((c) => (
                  <span key={c.hex} className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-300">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    {c.nombre}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mb-5">
              <input value={nombreColor} onChange={(e) => setNombreColor(e.target.value)} placeholder="Nombre (Ej: Primario)" className={`${inputClase} flex-grow`} />
              <input type="color" value={hexColor} onChange={(e) => setHexColor(e.target.value)} className="w-10 h-10 rounded-lg border border-neutral-800 bg-neutral-900 shrink-0" />
              <button onClick={agregarColor} className="shrink-0 bg-white text-black text-xs font-bold px-3 rounded-lg hover:bg-neutral-200">
                +
              </button>
            </div>

            <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Tipografías</p>
            {tipografias.length > 0 && (
              <ul className="space-y-1 mb-2">
                {tipografias.map((f) => (
                  <li key={f.nombre} className="text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 truncate">
                    {f.nombre}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input value={nombreFuente} onChange={(e) => setNombreFuente(e.target.value)} placeholder="Nombre" className={`${inputClase} flex-grow`} />
              <input value={urlFuente} onChange={(e) => setUrlFuente(e.target.value)} placeholder="Link de descarga" className={`${inputClase} flex-grow`} />
              <button onClick={agregarFuente} className="shrink-0 bg-white text-black text-xs font-bold px-3 rounded-lg hover:bg-neutral-200">
                +
              </button>
            </div>
          </Seccion>
        )}

        <Seccion titulo="🧾 Agregar Factura Manual">
          <Campo label="Concepto">
            <input value={conceptoFactura} onChange={(e) => setConceptoFactura(e.target.value)} className={inputClase} />
          </Campo>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Campo label="Monto">
              <input type="number" value={montoFactura} onChange={(e) => setMontoFactura(e.target.value)} className={inputClase} />
            </Campo>
            <Campo label="Moneda">
              <select value={monedaFactura} onChange={(e) => setMonedaFactura(e.target.value as "ARS" | "USD")} className={inputClase}>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </Campo>
          </div>
          <Campo label="Vencimiento (opcional)">
            <input type="date" value={vencimientoFactura} onChange={(e) => setVencimientoFactura(e.target.value)} className={inputClase} />
          </Campo>
          <button onClick={crearFacturaManual} disabled={guardando || !conceptoFactura.trim() || !montoFactura} className="w-full bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 text-neutral-300 hover:text-[#ccff00] font-bold text-sm py-2.5 rounded-lg transition disabled:opacity-40">
            {facturaCreada ? "✅ Factura agregada — agregar otra" : "Agregar factura"}
          </button>
        </Seccion>
      </div>
    </div>
  );
}
