"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const RECURSO_VACIO = {
  titulo: "", slug: "", tipo: "Gratis", precio: "", formato: "", icono: "📄",
  imagen_url: "", archivo_url: "", descripcion_corta: "", descripcion_larga: "",
  beneficios: "", estado: "Publicado",
};

export default function RecursoTab() {
  const [showForm, setShowForm] = useState(false);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [recursoEditando, setRecursoEditando] = useState<any | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenContenido, setSubiendoImagenContenido] = useState(false);
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  const [nuevoRecurso, setNuevoRecurso] = useState(RECURSO_VACIO);

  const fetchRecursos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("recursos")
      .select("*, recursos_descargas(count)")
      .order("creado_en", { ascending: false });

    if (error) console.error("Error al traer recursos:", error.message);
    setRecursos(data || []);
    setCargando(false);
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value;
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setNuevoRecurso({ ...nuevoRecurso, titulo, slug });
  };

  const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoImagen(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error("Seleccioná una imagen.");
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("imagenes-blog").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("imagenes-blog").getPublicUrl(fileName);
      setNuevoRecurso({ ...nuevoRecurso, imagen_url: data.publicUrl });
    } catch (error: any) {
      alert("Error subiendo la imagen: " + error.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const insertarEnContenido = (texto: string) => {
    const textarea = contenidoRef.current;
    if (!textarea) {
      setNuevoRecurso((prev) => ({ ...prev, descripcion_larga: prev.descripcion_larga + texto }));
      return;
    }
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    setNuevoRecurso((prev) => ({
      ...prev,
      descripcion_larga: prev.descripcion_larga.slice(0, inicio) + texto + prev.descripcion_larga.slice(fin),
    }));
    requestAnimationFrame(() => {
      const pos = inicio + texto.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const handleInsertarImagenContenido = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoImagenContenido(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error("Seleccioná una imagen.");
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("imagenes-blog").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("imagenes-blog").getPublicUrl(fileName);
      insertarEnContenido(`\n[img]${data.publicUrl}[/img]\n`);
    } catch (error: any) {
      alert("Error subiendo la imagen: " + error.message);
    } finally {
      setSubiendoImagenContenido(false);
      e.target.value = "";
    }
  };

  const handleInsertarVideo = () => {
    const url = prompt("Pegá la URL del video (YouTube o Vimeo):");
    if (!url?.trim()) return;
    insertarEnContenido(`\n[video]${url.trim()}[/video]\n`);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const payload = {
      ...nuevoRecurso,
      precio: nuevoRecurso.tipo === "Pago" && nuevoRecurso.precio ? Number(nuevoRecurso.precio) : null,
    };

    let error;
    if (recursoEditando) {
      ({ error } = await supabase.from("recursos").update(payload).eq("id", recursoEditando.id));
    } else {
      ({ error } = await supabase.from("recursos").insert([payload]));
    }

    if (error) {
      alert("Error al guardar el recurso: " + error.message);
    } else {
      alert(recursoEditando ? "¡Recurso actualizado!" : "¡Recurso publicado!");
      cerrarFormulario();
      await fetchRecursos();
    }
    setGuardando(false);
  };

  const iniciarEdicion = (recurso: any) => {
    setRecursoEditando(recurso);
    setNuevoRecurso({
      titulo: recurso.titulo,
      slug: recurso.slug,
      tipo: recurso.tipo || "Gratis",
      precio: recurso.precio ? recurso.precio.toString() : "",
      formato: recurso.formato || "",
      icono: recurso.icono || "📄",
      imagen_url: recurso.imagen_url || "",
      archivo_url: recurso.archivo_url || "",
      descripcion_corta: recurso.descripcion_corta || "",
      descripcion_larga: recurso.descripcion_larga || "",
      beneficios: recurso.beneficios || "",
      estado: recurso.estado || "Publicado",
    });
    setShowForm(true);
  };

  const eliminarRecurso = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés borrar este recurso para siempre?")) return;
    const { error } = await supabase.from("recursos").delete().eq("id", id);
    if (error) alert("Error al borrar: " + error.message);
    else fetchRecursos();
  };

  const cerrarFormulario = () => {
    setShowForm(false);
    setRecursoEditando(null);
    setNuevoRecurso(RECURSO_VACIO);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">Guías y Recursos (Lead Magnets)</h1>
          <p className="text-neutral-400 text-sm">Gestioná los recursos gratuitos y de pago que le ofrecés a tu comunidad.</p>
        </div>
        <button
          onClick={() => (showForm ? cerrarFormulario() : setShowForm(true))}
          className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          {showForm ? "✕ Cancelar" : "➕ Nuevo Recurso"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleGuardar} className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-8 mb-10 shadow-2xl">

          {/* SECCIÓN 1: Info básica */}
          <div>
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">1. Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Título del Recurso</label>
                <input type="text" required value={nuevoRecurso.titulo} onChange={handleTituloChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: Plantilla de Content Plan 2026" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">URL Amigable (Slug)</label>
                <input type="text" required value={nuevoRecurso.slug} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, slug: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-400 outline-none focus:border-[#ccff00]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Tipo</label>
                <select value={nuevoRecurso.tipo} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, tipo: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]">
                  <option value="Gratis">🎁 Gratis (pide email)</option>
                  <option value="Pago">💎 Pago (WhatsApp)</option>
                </select>
              </div>
              {nuevoRecurso.tipo === "Pago" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Precio (AR$)</label>
                  <input type="number" value={nuevoRecurso.precio} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, precio: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: 15000" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Formato</label>
                <input type="text" list="formatos-sugeridos" value={nuevoRecurso.formato} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, formato: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: Google Sheets" />
                <datalist id="formatos-sugeridos">
                  <option value="Google Sheets" />
                  <option value="PDF Interactivo" />
                  <option value="Notion Template" />
                  <option value="Looker Studio" />
                  <option value="Ebook PDF" />
                  <option value="Figma / Canva" />
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Ícono (emoji)</label>
                <input type="text" value={nuevoRecurso.icono} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, icono: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] text-xl" placeholder="📊" maxLength={4} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Imagen / Mockup (Hero)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
                    {nuevoRecurso.imagen_url ? <img src={nuevoRecurso.imagen_url} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl opacity-50">🖼️</span>}
                  </div>
                  <div className="w-full">
                    <input type="file" accept="image/*" onChange={handleSubirImagen} disabled={subiendoImagen} className="hidden" id="imagen-recurso" />
                    <label htmlFor="imagen-recurso" className="block w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm hover:border-[#ccff00] cursor-pointer transition-colors text-center text-neutral-300 font-medium">
                      {subiendoImagen ? "Subiendo... ⏳" : "📁 Subir Imagen"}
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Link de Descarga (Drive, Notion, PDF...)</label>
                <input type="text" value={nuevoRecurso.archivo_url} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, archivo_url: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 outline-none focus:border-[#ccff00]" placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Descripción corta (para la tarjeta y el subtítulo)</label>
              <textarea required rows={2} value={nuevoRecurso.descripcion_corta} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, descripcion_corta: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] resize-none" placeholder="Organizá todo el contenido de tu mes en un solo lugar..." />
            </div>
          </div>

          {/* SECCIÓN 2: Contenido de la página */}
          <div>
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">2. Página del Recurso</h3>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">¿Qué te llevás? (una línea por beneficio)</label>
              <textarea rows={4} value={nuevoRecurso.beneficios} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, beneficios: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] resize-none" placeholder={"200 hooks listos para usar\nHooks para Reels, TikTok y Shorts\nHooks emocionales, educativos y narrativos"} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase text-neutral-500">Desarrollo (info completa del recurso)</label>
                <div className="flex gap-2">
                  <input type="file" accept="image/*" onChange={handleInsertarImagenContenido} disabled={subiendoImagenContenido} className="hidden" id="imagen-contenido-recurso" />
                  <label htmlFor="imagen-contenido-recurso" className="cursor-pointer text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    {subiendoImagenContenido ? "Subiendo... ⏳" : "🖼️ Insertar imagen"}
                  </label>
                  <button type="button" onClick={handleInsertarVideo} className="text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    🎬 Insertar video
                  </button>
                </div>
              </div>
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
                <textarea ref={contenidoRef} rows={10} value={nuevoRecurso.descripcion_larga} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, descripcion_larga: e.target.value })} placeholder="Contale al usuario todo sobre el recurso. Dejá una línea en blanco entre párrafos." className="w-full bg-transparent px-6 py-4 text-neutral-200 outline-none resize-y leading-relaxed" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <select value={nuevoRecurso.estado} onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, estado: e.target.value })} className={`text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer ${nuevoRecurso.estado === "Publicado" ? "bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30" : "bg-neutral-800 text-neutral-400 border border-neutral-700"}`}>
              <option value="Publicado">🟢 Publicado (Visible)</option>
              <option value="Borrador">🟠 Borrador (Oculto)</option>
            </select>

            <div className="flex gap-4">
              <button type="button" onClick={cerrarFormulario} className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" disabled={guardando || subiendoImagen} className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50">
                {guardando ? "Guardando..." : (recursoEditando ? "💾 Actualizar Recurso" : "✨ Publicar Recurso")}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">Recursos Publicados ({recursos.length})</span>
          {cargando && <span className="text-xs text-[#ccff00] animate-pulse font-bold">Sincronizando...</span>}
        </div>

        <div className="divide-y divide-neutral-800">
          {recursos.length === 0 && !cargando ? (
            <div className="p-12 text-center text-neutral-400">Aún no cargaste ningún recurso.</div>
          ) : (
            recursos.map((recurso) => (
              <div key={recurso.id} className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 hover:bg-neutral-800/40 group">
                <div className="flex gap-4 items-center w-full lg:w-auto">
                  <div className="w-14 h-14 shrink-0 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-center text-2xl">
                    {recurso.icono || "📄"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full">{recurso.estado}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${recurso.tipo === "Pago" ? "bg-amber-400/20 text-amber-400" : "bg-[#ccff00]/20 text-[#ccff00]"}`}>
                        {recurso.tipo === "Pago" ? `💎 $${Number(recurso.precio || 0).toLocaleString("es-AR")}` : "🎁 Gratis"}
                      </span>
                      <span className="text-[10px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-full border border-neutral-800">
                        📥 {recurso.recursos_descargas?.[0]?.count ?? 0} descargas
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base break-words">{recurso.titulo}</h4>
                    <span className="text-xs text-neutral-500">{recurso.formato}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto justify-end flex-wrap">
                  <button onClick={() => iniciarEdicion(recurso)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-lg">Editar</button>
                  <button onClick={() => eliminarRecurso(recurso.id)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
