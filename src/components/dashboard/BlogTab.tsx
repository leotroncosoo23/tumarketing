"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogTab() {
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [cargandoBlogs, setCargandoBlogs] = useState(false);
  const [blogEditando, setBlogEditando] = useState<any | null>(null);

  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenContenido, setSubiendoImagenContenido] = useState(false);
  const [enviarNewsletter, setEnviarNewsletter] = useState(false);
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  const [nuevoBlog, setNuevoBlog] = useState({
    titulo: "", slug: "", autor: "", resumen: "", contenido: "", imagen_url: "", categoria: "Marketing", estado: "Publicado"
  });

  const fetchBlogs = async () => {
    setCargandoBlogs(true);
    const { data } = await supabase.from("blogs").select("*").order("creado_en", { ascending: false });
    setBlogs(data || []);
    setCargandoBlogs(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoImagen(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error("Seleccioná una imagen.");
      
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from("imagenes-blog").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("imagenes-blog").getPublicUrl(fileName);
      setNuevoBlog({ ...nuevoBlog, imagen_url: data.publicUrl });
    } catch (error: any) {
      alert("Error subiendo la imagen: " + error.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  // Inserta texto en la posición del cursor dentro del textarea de contenido
  const insertarEnContenido = (texto: string) => {
    const textarea = contenidoRef.current;
    if (!textarea) {
      setNuevoBlog((prev) => ({ ...prev, contenido: prev.contenido + texto }));
      return;
    }
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    setNuevoBlog((prev) => {
      const nuevoContenido = prev.contenido.slice(0, inicio) + texto + prev.contenido.slice(fin);
      return { ...prev, contenido: nuevoContenido };
    });
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
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;

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

  const handleGuardarBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    
    let errorAlGuardar;

    if (blogEditando) {
      const { error } = await supabase.from("blogs").update({ ...nuevoBlog }).eq("id", blogEditando.id);
      errorAlGuardar = error;
    } else {
      const { error } = await supabase.from("blogs").insert([{ ...nuevoBlog }]);
      errorAlGuardar = error;
    }

    if (errorAlGuardar) {
      alert("Error publicando el artículo: " + errorAlGuardar.message);
    } else {
      let mensaje = blogEditando ? "¡Artículo actualizado!" : "¡Artículo guardado con éxito!";
      if (enviarNewsletter && !blogEditando) mensaje += " (Correos encolados).";
      
      alert(mensaje);
      cerrarFormularioBlog();
      setTimeout(fetchBlogs, 500);
    }
    setGuardando(false);
  };

  const iniciarEdicionBlog = (blog: any) => {
    setBlogEditando(blog);
    setNuevoBlog({
      titulo: blog.titulo,
      slug: blog.slug,
      autor: blog.autor || "",
      resumen: blog.resumen || "",
      contenido: blog.contenido,
      imagen_url: blog.imagen_url || "",
      categoria: blog.categoria || "Marketing",
      estado: blog.estado || "Publicado"
    });
    setShowBlogForm(true);
  };

  const eliminarBlog = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés borrar este artículo?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) alert("Error al borrar: " + error.message);
    else fetchBlogs();
  };

  const cerrarFormularioBlog = () => {
    setShowBlogForm(false);
    setBlogEditando(null);
    setNuevoBlog({ titulo: "", slug: "", autor: "", resumen: "", contenido: "", imagen_url: "", categoria: "Marketing", estado: "Publicado" });
  };

  const handleTituloBlogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value;
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setNuevoBlog({ ...nuevoBlog, titulo, slug });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">Gestión de Contenidos (Blog)</h1>
          <p className="text-neutral-400 text-sm">Creá, editá o eliminá los artículos de tu sitio.</p>
        </div>
        <button onClick={() => showBlogForm ? cerrarFormularioBlog() : setShowBlogForm(true)} className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]">
          {showBlogForm ? "✕ Cerrar Editor" : "✍️ Redactar Artículo"}
        </button>
      </div>

      {showBlogForm && (
        <form onSubmit={handleGuardarBlog} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <div className="bg-neutral-950 border-b border-neutral-800 p-4 px-6 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-white">Estado:</span>
              <select value={nuevoBlog.estado} onChange={(e) => setNuevoBlog({...nuevoBlog, estado: e.target.value})} className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer ${nuevoBlog.estado === 'Publicado' ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}>
                <option value="Publicado">🟢 Publicado (Visible)</option>
                <option value="Borrador">🟠 Borrador (Oculto)</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-white">Categoría:</span>
              <select value={nuevoBlog.categoria} onChange={(e) => setNuevoBlog({...nuevoBlog, categoria: e.target.value})} className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 px-3 py-1.5 rounded-lg outline-none focus:border-[#ccff00]">
                <option>Marketing</option>
                <option>Redes Sociales</option>
                <option>Branding</option>
                <option>Ventas</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Título del Artículo</label>
                <input type="text" required value={nuevoBlog.titulo} onChange={handleTituloBlogChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-all text-lg font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">URL Amigable (Slug)</label>
                <input type="text" required value={nuevoBlog.slug} onChange={(e) => setNuevoBlog({...nuevoBlog, slug: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-400 outline-none focus:border-[#ccff00] transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Autor</label>
                <input type="text" value={nuevoBlog.autor} onChange={(e) => setNuevoBlog({...nuevoBlog, autor: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] transition-all" placeholder="Ej: Enzo Rueda (vacío = 'Equipo TuMarketing')" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Imagen de Portada</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 shrink-0 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
                    {nuevoBlog.imagen_url ? <img src={nuevoBlog.imagen_url} alt="Portada" className="w-full h-full object-cover" /> : <span className="text-3xl opacity-50">🖼️</span>}
                  </div>
                  <div className="w-full">
                    <input type="file" accept="image/*" onChange={handleSubirImagen} disabled={subiendoImagen} className="hidden" id="imagen-blog" />
                    <label htmlFor="imagen-blog" className="block w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm hover:border-[#ccff00] cursor-pointer transition-colors text-center text-neutral-300 font-medium">
                      {subiendoImagen ? "Subiendo a la nube... ⏳" : "📁 Subir Imagen"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Resumen / Bajada (SEO)</label>
                <textarea rows={3} required value={nuevoBlog.resumen} onChange={(e) => setNuevoBlog({...nuevoBlog, resumen: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 outline-none focus:border-[#ccff00] transition-all resize-none h-24" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Desarrollo del Artículo</label>
                <div className="flex gap-2">
                  <input type="file" accept="image/*" onChange={handleInsertarImagenContenido} disabled={subiendoImagenContenido} className="hidden" id="imagen-contenido" />
                  <label htmlFor="imagen-contenido" className="cursor-pointer text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    {subiendoImagenContenido ? "Subiendo... ⏳" : "🖼️ Insertar imagen"}
                  </label>
                  <button type="button" onClick={handleInsertarVideo} className="text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    🎬 Insertar video
                  </button>
                </div>
              </div>
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
                <textarea ref={contenidoRef} rows={12} required value={nuevoBlog.contenido} onChange={(e) => setNuevoBlog({...nuevoBlog, contenido: e.target.value})} placeholder="Desarrollo del artículo... Dejá una línea en blanco entre párrafos. Usá los botones de arriba para meter imágenes o videos en el medio del texto." className="w-full bg-transparent px-6 py-4 text-neutral-200 outline-none resize-y leading-relaxed" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Separá los párrafos con una línea en blanco. Las imágenes y videos que insertes van a aparecer justo donde esté el cursor.
              </p>
            </div>

            {!blogEditando && (
              <div className={`border rounded-xl p-5 flex items-start gap-4 transition-colors ${enviarNewsletter ? 'bg-[#ccff00]/5 border-[#ccff00]/30' : 'bg-neutral-950 border-neutral-800'}`}>
                <div className="mt-1">
                  <input type="checkbox" id="newsletter" className="w-5 h-5 accent-[#ccff00] cursor-pointer" checked={enviarNewsletter} onChange={(e) => setEnviarNewsletter(e.target.checked)} />
                </div>
                <div>
                  <label htmlFor="newsletter" className="text-base font-bold text-white cursor-pointer select-none">Notificar a toda la base de datos (Vía Resend)</label>
                  <p className="text-sm text-neutral-400 mt-1">Se disparará un correo avisándole a tus alumnos sobre este nuevo post.</p>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-4">
              <button type="button" onClick={cerrarFormularioBlog} className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" disabled={guardando || subiendoImagen} className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50">
                {guardando ? "Procesando..." : (blogEditando ? "💾 Actualizar Artículo" : "✨ Publicar Artículo")}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm">Artículos del Blog ({blogs.length})</span>
          {cargandoBlogs && <span className="text-xs text-[#ccff00] animate-pulse">Sincronizando...</span>}
        </div>
        <div className="divide-y divide-neutral-800">
          {blogs.length === 0 && !cargandoBlogs ? (
            <div className="p-12 text-center text-neutral-400">Tu blog está vacío. ¡Escribí el primer artículo!</div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:bg-neutral-800/40">
                <div className="flex gap-4 items-center w-full sm:w-auto min-w-0">
                  <div className="w-16 h-16 shrink-0 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
                    {blog.imagen_url ? <img src={blog.imagen_url} alt={blog.titulo} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-xl opacity-30">📄</span>}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full mr-2">{blog.estado}</span>
                    <h4 className="font-bold text-white text-base mt-1 break-words">{blog.titulo}</h4>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => iniciarEdicionBlog(blog)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-blue-400 text-xs font-bold rounded-lg hover:border-blue-500">Editar</button>
                  <button onClick={() => eliminarBlog(blog.id)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-red-500 text-xs font-bold rounded-lg hover:border-red-500">Borrar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}