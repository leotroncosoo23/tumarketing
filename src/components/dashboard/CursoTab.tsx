"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Convierte un timestamp ISO (UTC) al formato que espera un <input type="datetime-local">, en hora local
function isoAInputLocal(iso: string) {
  const fecha = new Date(iso);
  const conOffset = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return conOffset.toISOString().slice(0, 16);
}

export default function CursoTab() {
  const [showCursoForm, setShowCursoForm] = useState(false);
  const [cursos, setCursos] = useState<any[]>([]);
  const [cargandoCursos, setCargandoCursos] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<any | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  
  // Estado ampliado con el precio de descuento y la oferta especial
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: "", categoria: "", precio: "", precio_descuento: "", descripcion: "", imagen_url: "", video_url: "",
    duracion: "", nivel: "Todos los niveles", modalidad: "A tu ritmo",
    requisitos: "", para_quien: "", aprendizajes: "",
    oferta_activa: false, oferta_etiqueta: "", oferta_fecha_fin: ""
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState<any | null>(null);
  const [lecciones, setLecciones] = useState<any[]>([]);
  const [cargandoLecciones, setCargandoLecciones] = useState(false);
  const [showLeccionForm, setShowLeccionForm] = useState(false);
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: "", video_url: "", orden: 1 });

  const fetchCursos = async () => {
    setCargandoCursos(true);
    const { data } = await supabase.from("cursos").select("*").order("creado_en", { ascending: false });
    setCursos(data || []);
    setCargandoCursos(false);
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSubiendoImagen(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error("Seleccioná una imagen.");
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from("imagenes-cursos").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("imagenes-cursos").getPublicUrl(fileName);
      setNuevoCurso({ ...nuevoCurso, imagen_url: data.publicUrl });
    } catch (error: any) {
      alert("Error subiendo la imagen: " + error.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleGuardarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    
    const precioNumerico = Number(nuevoCurso.precio) || 0;
    // Si dejó el descuento vacío, mandamos un null, sino el número
    const precioDescuentoNumerico = nuevoCurso.precio_descuento ? Number(nuevoCurso.precio_descuento) : null;
    // datetime-local no trae zona horaria; lo mandamos tal cual y Postgres lo toma como hora local
    const ofertaFechaFin = nuevoCurso.oferta_fecha_fin ? new Date(nuevoCurso.oferta_fecha_fin).toISOString() : null;

    let errorAlGuardar;

    if (cursoEditando) {
      const { error } = await supabase.from("cursos").update({
        ...nuevoCurso,
        precio: precioNumerico,
        precio_descuento: precioDescuentoNumerico,
        oferta_fecha_fin: ofertaFechaFin
      }).eq("id", cursoEditando.id);
      errorAlGuardar = error;
    } else {
      const { error } = await supabase.from("cursos").insert([{
        ...nuevoCurso,
        precio: precioNumerico,
        precio_descuento: precioDescuentoNumerico,
        oferta_fecha_fin: ofertaFechaFin
      }]);
      errorAlGuardar = error;
    }
    
    if (errorAlGuardar) alert("Error al guardar curso: " + errorAlGuardar.message);
    else {
      alert(cursoEditando ? "¡Curso actualizado!" : "¡Curso creado con éxito!");
      cerrarFormularioCurso();
      await fetchCursos(); 
    }
    setGuardando(false);
  };

  const iniciarEdicionCurso = (curso: any) => {
    setCursoEditando(curso);
    setNuevoCurso({
      titulo: curso.titulo,
      categoria: curso.categoria || "",
      precio: curso.precio.toString(),
      precio_descuento: curso.precio_descuento ? curso.precio_descuento.toString() : "",
      descripcion: curso.descripcion || "", 
      imagen_url: curso.imagen_url || "", 
      video_url: curso.video_url || "",
      duracion: curso.duracion || "",
      nivel: curso.nivel || "Todos los niveles",
      modalidad: curso.modalidad || "A tu ritmo",
      requisitos: curso.requisitos || "",
      para_quien: curso.para_quien || "",
      aprendizajes: curso.aprendizajes || "",
      oferta_activa: curso.oferta_activa || false,
      oferta_etiqueta: curso.oferta_etiqueta || "",
      oferta_fecha_fin: curso.oferta_fecha_fin ? isoAInputLocal(curso.oferta_fecha_fin) : ""
    });
    setShowCursoForm(true);
  };

  const eliminarCurso = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés borrar este curso para siempre?")) return;
    const { error } = await supabase.from("cursos").delete().eq("id", id);
    if (error) alert("Error al borrar: " + error.message);
    else await fetchCursos();
  };

  const cerrarFormularioCurso = () => {
    setShowCursoForm(false);
    setCursoEditando(null);
    setNuevoCurso({
      titulo: "", categoria: "", precio: "", precio_descuento: "", descripcion: "", imagen_url: "", video_url: "",
      duracion: "", nivel: "Todos los niveles", modalidad: "A tu ritmo",
      requisitos: "", para_quien: "", aprendizajes: "",
      oferta_activa: false, oferta_etiqueta: "", oferta_fecha_fin: ""
    });
  };

  // --- LÓGICA DE LECCIONES ---
  const abrirGestorLecciones = async (curso: any) => {
    setCursoSeleccionado(curso);
    await fetchLecciones(curso.id);
  };

  const fetchLecciones = async (cursoId: string) => {
    setCargandoLecciones(true);
    const { data } = await supabase.from("lecciones").select("*").eq("curso_id", cursoId).order("orden", { ascending: true });
    setLecciones(data || []);
    setNuevaLeccion(prev => ({ ...prev, orden: (data?.length || 0) + 1 }));
    setCargandoLecciones(false);
  };

  const handleGuardarLeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase.from("lecciones").insert([{ curso_id: cursoSeleccionado.id, titulo: nuevaLeccion.titulo, video_url: nuevaLeccion.video_url, orden: Number(nuevaLeccion.orden) }]);
    if (error) alert("Error guardando lección: " + error.message);
    else {
      alert("¡Lección agregada al curso!");
      setShowLeccionForm(false);
      setNuevaLeccion({ titulo: "", video_url: "", orden: 1 });
      await fetchLecciones(cursoSeleccionado.id);
    }
    setGuardando(false);
  };

  const eliminarLeccion = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar esta lección?")) return;
    const { error } = await supabase.from("lecciones").delete().eq("id", id);
    if (error) alert("Error: " + error.message);
    else await fetchLecciones(cursoSeleccionado.id);
  };

  if (cursoSeleccionado) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setCursoSeleccionado(null)} className="text-neutral-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold transition-colors">
          ← Volver al catálogo de cursos
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">{cursoSeleccionado.titulo}</h1>
            <p className="text-[#ccff00] font-bold text-sm">Gestor del Aula Virtual (Lecciones)</p>
          </div>
          <button onClick={() => setShowLeccionForm(!showLeccionForm)} className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-neutral-200 transition">
            {showLeccionForm ? "✕ Cancelar" : "➕ Agregar Lección"}
          </button>
        </div>

        {showLeccionForm && (
          <form onSubmit={handleGuardarLeccion} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Título del Video</label>
                <input type="text" required value={nuevaLeccion.titulo} onChange={(e) => setNuevaLeccion({...nuevaLeccion, titulo: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: Módulo 1 - Estrategia Base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Orden</label>
                <input type="number" required value={nuevaLeccion.orden} onChange={(e) => setNuevaLeccion({...nuevaLeccion, orden: Number(e.target.value)})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">URL del Video</label>
              <input type="text" required value={nuevaLeccion.video_url} onChange={(e) => setNuevaLeccion({...nuevaLeccion, video_url: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-400 outline-none focus:border-[#ccff00]" placeholder="https://..." />
            </div>
            <div className="flex justify-end mt-6">
              <button type="submit" disabled={guardando} className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] disabled:opacity-50">
                {guardando ? "Guardando..." : "Guardar Lección"}
              </button>
            </div>
          </form>
        )}

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-neutral-800">
            <span className="font-bold text-sm uppercase text-neutral-300">Temario ({lecciones.length} clases)</span>
          </div>
          <div className="divide-y divide-neutral-800">
            {lecciones.length === 0 && !cargandoLecciones ? (
              <div className="p-10 text-center text-neutral-500">Aún no subiste ninguna clase.</div>
            ) : (
              lecciones.map((leccion) => (
                <div key={leccion.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/40">
                  <div className="flex items-center gap-4">
                    <span className="bg-neutral-950 border border-neutral-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#ccff00]">{leccion.orden}</span>
                    <h4 className="font-bold text-white">{leccion.titulo}</h4>
                  </div>
                  <button onClick={() => eliminarLeccion(leccion.id)} className="text-red-500 hover:text-red-400 text-xs font-bold px-3 py-1 bg-red-500/10 rounded-lg">Borrar</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">Gestión de Cursos</h1>
          <p className="text-neutral-400 text-sm">Armá la ficha completa de venta para cada curso.</p>
        </div>
        <button onClick={() => showCursoForm ? cerrarFormularioCurso() : setShowCursoForm(true)} className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]">
          {showCursoForm ? "✕ Cancelar" : "➕ Nuevo Curso"}
        </button>
      </div>

      {showCursoForm && (
        <form onSubmit={handleGuardarCurso} className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-8 mb-10 shadow-2xl">
          
          {/* SECCIÓN 1: Info Básica */}
          <div>
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">1. Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Título del Curso</label>
                <input type="text" required value={nuevoCurso.titulo} onChange={(e) => setNuevoCurso({...nuevoCurso, titulo: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: Master en Meta Ads" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Categoría</label>
                <input
                  type="text"
                  list="categorias-sugeridas"
                  value={nuevoCurso.categoria}
                  onChange={(e) => setNuevoCurso({ ...nuevoCurso, categoria: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="Ej: Marketing Digital"
                />
                <datalist id="categorias-sugeridas">
                  <option value="Marketing Digital" />
                  <option value="Inteligencia Artificial" />
                  <option value="Diseño & Desarrollo Web" />
                  <option value="Redes Sociales" />
                  <option value="Ventas & E-commerce" />
                </datalist>
              </div>
            </div>

            {/* SECCIÓN PRECIOS (Normal y Descuento) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Precio Regular (AR$)</label>
                <input type="number" required value={nuevoCurso.precio} onChange={(e) => setNuevoCurso({...nuevoCurso, precio: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: 80000" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#ccff00] mb-2">
                  Precio Promocional (Opcional) <span className="bg-[#ccff00]/20 text-[#ccff00] px-2 py-0.5 rounded text-[10px]">¡Aumenta Ventas!</span>
                </label>
                <input type="number" value={nuevoCurso.precio_descuento} onChange={(e) => setNuevoCurso({...nuevoCurso, precio_descuento: e.target.value})} className="w-full bg-neutral-950 border border-[#ccff00]/50 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: 45000 (Dejar vacío si no hay promo)" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Descripción (Bajada de la página)</label>
              <textarea value={nuevoCurso.descripcion} onChange={(e) => setNuevoCurso({...nuevoCurso, descripcion: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-20 resize-none" placeholder="En este curso aprenderás a..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Imagen de Portada</label>
                <div className="flex gap-4">
                  {nuevoCurso.imagen_url && <img src={nuevoCurso.imagen_url} className="w-12 h-12 rounded object-cover" />}
                  <input type="file" accept="image/*" onChange={handleSubirImagen} disabled={subiendoImagen} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-2 text-sm text-neutral-400 file:bg-[#ccff00] file:text-black file:rounded-lg file:border-0 file:px-3 file:py-1 file:font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Video Tráiler URL (Para ventas)</label>
                <input type="text" value={nuevoCurso.video_url} onChange={(e) => setNuevoCurso({...nuevoCurso, video_url: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="YouTube o Vimeo URL" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Detalles Técnicos (Píldoras) */}
          <div>
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">2. Detalles Técnicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Duración</label>
                <input type="text" value={nuevoCurso.duracion} onChange={(e) => setNuevoCurso({...nuevoCurso, duracion: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]" placeholder="Ej: 10 semanas / 4 horas" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Nivel</label>
                <select value={nuevoCurso.nivel} onChange={(e) => setNuevoCurso({...nuevoCurso, nivel: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]">
                  <option>Inicial</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                  <option>Todos los niveles</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Modalidad</label>
                <select value={nuevoCurso.modalidad} onChange={(e) => setNuevoCurso({...nuevoCurso, modalidad: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]">
                  <option>A tu ritmo (Grabado)</option>
                  <option>En Vivo</option>
                  <option>Mixto</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Textos de Venta (E-Commerce) */}
          <div>
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-2 mb-4">3. Argumentos de Venta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Para quién es (Audiencia)</label>
                <textarea value={nuevoCurso.para_quien} onChange={(e) => setNuevoCurso({...nuevoCurso, para_quien: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-24 resize-none" placeholder="Emprendedores que buscan..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Requisitos</label>
                <textarea value={nuevoCurso.requisitos} onChange={(e) => setNuevoCurso({...nuevoCurso, requisitos: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-24 resize-none" placeholder="Tener una computadora con acceso a internet..."></textarea>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Qué vas a lograr / aprender (Separado por guiones)</label>
              <textarea value={nuevoCurso.aprendizajes} onChange={(e) => setNuevoCurso({...nuevoCurso, aprendizajes: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-28 resize-none" placeholder="- Diseñar estrategias efectivas&#10;- Configurar el Business Manager&#10;- Escalar tus ventas..."></textarea>
            </div>
          </div>

          {/* SECCIÓN 4: Oferta Especial */}
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
              <h3 className="text-xl font-bold text-[#ccff00]">4. Oferta Especial (Opcional)</h3>
              <button
                type="button"
                onClick={() => setNuevoCurso({ ...nuevoCurso, oferta_activa: !nuevoCurso.oferta_activa })}
                className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${
                  nuevoCurso.oferta_activa ? "bg-[#ccff00]" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    nuevoCurso.oferta_activa ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Si la activás, en la ficha del curso aparece un cartel llamativo con esta etiqueta y una cuenta regresiva. No hace falta activarla en todos los cursos a la vez.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Etiqueta de la oferta</label>
                <input
                  type="text"
                  value={nuevoCurso.oferta_etiqueta}
                  onChange={(e) => setNuevoCurso({ ...nuevoCurso, oferta_etiqueta: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="Ej: Mitad de año"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">La oferta termina el</label>
                <input
                  type="datetime-local"
                  value={nuevoCurso.oferta_fecha_fin}
                  onChange={(e) => setNuevoCurso({ ...nuevoCurso, oferta_fecha_fin: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                />
              </div>
            </div>

            {nuevoCurso.oferta_activa && nuevoCurso.oferta_etiqueta && (
              <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-black rounded-xl px-5 py-3">
                <span className="font-black italic">{nuevoCurso.oferta_etiqueta}</span>
                {nuevoCurso.precio_descuento && nuevoCurso.precio && (
                  <span className="ml-auto font-black text-lg">
                    -{Math.round((1 - Number(nuevoCurso.precio_descuento) / Number(nuevoCurso.precio)) * 100)}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
            <button type="button" onClick={cerrarFormularioCurso} className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" disabled={guardando || subiendoImagen} className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50">
              {guardando ? "Guardando..." : (cursoEditando ? "💾 Actualizar Curso" : "🚀 Publicar Curso")}
            </button>
          </div>
        </form>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">Catálogo Activo ({cursos.length})</span>
          {cargandoCursos && <span className="text-xs text-[#ccff00] animate-pulse font-bold">Sincronizando...</span>}
        </div>
        
        <div className="divide-y divide-neutral-800">
          {cursos.length === 0 && !cargandoCursos ? (
            <div className="p-12 text-center text-neutral-400">Aún no hay cursos cargados.</div>
          ) : (
            cursos.map((curso) => (
              <div key={curso.id} className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 hover:bg-neutral-800/40 group">
                <div className="flex gap-4 items-center w-full lg:w-auto">
                  <div className="w-16 h-16 shrink-0 bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                    {curso.imagen_url ? <img src={curso.imagen_url} alt={curso.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <span className="flex items-center justify-center w-full h-full text-xl opacity-30">🎓</span>}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-base mb-1 break-words">{curso.titulo}</h4>

                    {/* ACÁ MOSTRAMOS EL PRECIO Y EL DESCUENTO SI EXISTE */}
                    <div className="flex gap-3 text-xs font-medium flex-wrap items-center">
                      {curso.precio_descuento ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#ccff00] font-bold text-sm">${curso.precio_descuento.toLocaleString("es-AR")}</span>
                          <span className="text-neutral-500 line-through">${curso.precio.toLocaleString("es-AR")}</span>
                          <span className="bg-[#ccff00]/20 text-[#ccff00] px-1.5 py-0.5 rounded uppercase text-[9px] font-bold ml-1">Promo</span>
                        </div>
                      ) : (
                        <span className="text-[#ccff00] font-bold">${curso.precio.toLocaleString("es-AR")}</span>
                      )}
                      
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{curso.modalidad}</span>
                      <span className="text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{curso.nivel}</span>
                      {curso.oferta_activa && (
                        <span className="bg-gradient-to-r from-amber-400 to-pink-500 text-black px-2 py-0.5 rounded uppercase text-[9px] font-black">
                          🔥 {curso.oferta_etiqueta || "Oferta activa"}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto justify-end flex-wrap">
                  <button onClick={() => abrirGestorLecciones(curso)} className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg hover:bg-neutral-200">📚 Lecciones</button>
                  <button onClick={() => iniciarEdicionCurso(curso)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-lg">Editar Info</button>
                  <button onClick={() => eliminarCurso(curso.id)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}