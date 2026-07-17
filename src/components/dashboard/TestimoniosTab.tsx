"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Curso = {
  id: string;
  titulo: string;
};

type Testimonio = {
  id: string;
  curso_id: string;
  nombre_alumno: string;
  comentario: string;
  calificacion: number;
  aprobado: boolean;
  creado_en?: string;
  cursos?: { titulo: string } | null;
};

type ComentarioBlog = {
  id: string;
  nombre: string;
  comentario: string;
  creado_en: string;
  blogs?: { titulo: string; slug: string } | null;
};

export default function TestimoniosTab() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [comentariosBlog, setComentariosBlog] = useState<ComentarioBlog[]>([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nuevoTestimonio, setNuevoTestimonio] = useState({
    curso_id: "",
    nombre_alumno: "",
    comentario: "",
    calificacion: 5,
    aprobado: true, // Por defecto lo aprobamos para que se muestre
  });

  const fetchData = async () => {
    setCargando(true);

    // Traemos los cursos para el selector
    const { data: dataCursos, error: errorCursos } = await supabase
      .from("cursos")
      .select("id, titulo");

    if (errorCursos) {
      console.error("Error al traer cursos:", errorCursos.message);
    }
    setCursos(dataCursos || []);

    // Traemos los testimonios cruzando datos con la tabla cursos para tener el nombre del curso
    const { data: dataTestimonios, error: errorTestimonios } = await supabase
      .from("testimonios")
      .select(`*, cursos (titulo)`)
      .order("creado_en", { ascending: false });

    if (errorTestimonios) {
      console.error("Error al traer testimonios:", errorTestimonios.message);
    }
    setTestimonios((dataTestimonios as Testimonio[]) || []);

    setCargando(false);
  };

  const fetchComentariosBlog = async () => {
    setCargandoComentarios(true);
    const { data, error } = await supabase
      .from("comentarios_blog")
      .select(`*, blogs (titulo, slug)`)
      .order("creado_en", { ascending: false });

    if (error) {
      console.error("Error al traer comentarios de blog:", error.message);
    }
    setComentariosBlog((data as ComentarioBlog[]) || []);
    setCargandoComentarios(false);
  };

  const eliminarComentarioBlog = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este comentario?")) return;
    const { error } = await supabase.from("comentarios_blog").delete().eq("id", id);
    if (error) {
      alert("Error al borrar: " + error.message);
      return;
    }
    fetchComentariosBlog();
  };

  useEffect(() => {
    // Ambas se reutilizan tras crear/editar/borrar testimonios y comentarios
    // (ver más abajo), por eso viven fuera del efecto en vez de estar inline.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    fetchComentariosBlog();
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTestimonio.curso_id) {
      alert("Por favor, seleccioná un curso.");
      return;
    }

    setGuardando(true);
    const { error } = await supabase.from("testimonios").insert([
      {
        ...nuevoTestimonio,
        calificacion: Number(nuevoTestimonio.calificacion),
      },
    ]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Testimonio guardado con éxito!");
      setShowForm(false);
      setNuevoTestimonio({
        curso_id: "",
        nombre_alumno: "",
        comentario: "",
        calificacion: 5,
        aprobado: true,
      });
      fetchData();
    }
    setGuardando(false);
  };

  const eliminarTestimonio = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar esta reseña?")) return;
    const { error } = await supabase.from("testimonios").delete().eq("id", id);
    if (error) {
      alert("Error al borrar: " + error.message);
      return;
    }
    fetchData();
  };

  const toggleAprobado = async (id: string, estadoActual: boolean) => {
    const { error } = await supabase
      .from("testimonios")
      .update({ aprobado: !estadoActual })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }
    fetchData();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black">💬 Testimonios y Reseñas</h1>
          <p className="text-neutral-400 text-sm">
            Gestioná la &quot;Prueba Social&quot; para convencer a más clientes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          {showForm ? "✕ Cancelar" : "➕ Cargar Reseña Manual"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleGuardar}
          className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-10 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">
            Nuevo Testimonio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                Alumno (Ej: María Gómez)
              </label>
              <input
                type="text"
                required
                value={nuevoTestimonio.nombre_alumno}
                onChange={(e) =>
                  setNuevoTestimonio({
                    ...nuevoTestimonio,
                    nombre_alumno: e.target.value,
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                placeholder="Nombre del alumno..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                ¿Sobre qué curso opina?
              </label>
              <select
                required
                value={nuevoTestimonio.curso_id}
                onChange={(e) =>
                  setNuevoTestimonio({
                    ...nuevoTestimonio,
                    curso_id: e.target.value,
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              >
                <option value="" disabled>
                  Seleccioná un curso...
                </option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
              Comentario / Reseña
            </label>
            <textarea
              required
              value={nuevoTestimonio.comentario}
              onChange={(e) =>
                setNuevoTestimonio({
                  ...nuevoTestimonio,
                  comentario: e.target.value,
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00] h-24 resize-none"
              placeholder="¡Me encantó el curso! Aprendí un montón sobre..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                Calificación
              </label>
              <select
                value={nuevoTestimonio.calificacion}
                onChange={(e) =>
                  setNuevoTestimonio({
                    ...nuevoTestimonio,
                    calificacion: Number(e.target.value),
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-yellow-400 font-bold outline-none focus:border-[#ccff00]"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
                <option value="2">⭐⭐ (2/5)</option>
                <option value="1">⭐ (1/5)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="aprobar"
                checked={nuevoTestimonio.aprobado}
                onChange={(e) =>
                  setNuevoTestimonio({
                    ...nuevoTestimonio,
                    aprobado: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-[#ccff00]"
              />
              <label
                htmlFor="aprobar"
                className="text-sm font-bold text-white cursor-pointer"
              >
                Aprobar inmediatamente y mostrar en la web
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl font-bold text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "✅ Guardar Testimonio"}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE TESTIMONIOS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
            Reseñas Registradas ({testimonios.length})
          </span>
          {cargando && (
            <span className="text-xs text-[#ccff00] animate-pulse font-bold">
              Cargando...
            </span>
          )}
        </div>

        <div className="divide-y divide-neutral-800">
          {testimonios.length === 0 && !cargando ? (
            <div className="p-12 text-center text-neutral-400">
              Aún no hay reseñas. ¡Cargá la primera!
            </div>
          ) : (
            testimonios.map((testimonio) => (
              <div
                key={testimonio.id}
                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-neutral-800/40 transition-colors group"
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-white text-lg break-words">
                      {testimonio.nombre_alumno}
                    </span>
                    <span className="text-yellow-400 text-sm shrink-0">
                      {"⭐".repeat(testimonio.calificacion)}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        testimonio.aprobado
                          ? "bg-[#ccff00]/20 text-[#ccff00]"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {testimonio.aprobado ? "🟢 Visible" : "🔴 Oculto"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 italic mb-2">
                    &quot;{testimonio.comentario}&quot;
                  </p>
                  <span className="text-xs text-neutral-500 font-bold bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                    Curso: {testimonio.cursos?.titulo || "Curso eliminado"}
                  </span>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end items-center mt-4 md:mt-0">
                  <button
                    onClick={() =>
                      toggleAprobado(testimonio.id, testimonio.aprobado)
                    }
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      testimonio.aprobado
                        ? "bg-neutral-950 border-neutral-700 text-neutral-400 hover:text-white"
                        : "bg-[#ccff00]/20 border-[#ccff00]/50 text-[#ccff00] hover:bg-[#ccff00]/30"
                    }`}
                  >
                    {testimonio.aprobado ? "Ocultar de la web" : "Mostrar en la web"}
                  </button>
                  <button
                    onClick={() => eliminarTestimonio(testimonio.id)}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg transition-colors"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COMENTARIOS DE BLOG */}
      <div className="mt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-black">📝 Comentarios del Blog</h2>
          <p className="text-neutral-400 text-sm">
            Los comentarios que dejan los lectores en los artículos. Se publican al instante; acá solo podés borrarlos si hace falta.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
            <span className="font-bold text-sm uppercase tracking-wider text-neutral-300">
              Comentarios Registrados ({comentariosBlog.length})
            </span>
            {cargandoComentarios && (
              <span className="text-xs text-[#ccff00] animate-pulse font-bold">Cargando...</span>
            )}
          </div>

          <div className="divide-y divide-neutral-800">
            {comentariosBlog.length === 0 && !cargandoComentarios ? (
              <div className="p-12 text-center text-neutral-400">
                Todavía no hay comentarios en el blog.
              </div>
            ) : (
              comentariosBlog.map((c) => (
                <div
                  key={c.id}
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-white text-base break-words">{c.nombre}</span>
                      <span className="text-xs text-neutral-500 shrink-0">
                        {new Date(c.creado_en).toLocaleDateString("es-AR", {
                          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 italic mb-2 break-words">&quot;{c.comentario}&quot;</p>
                    <span className="text-xs text-neutral-500 font-bold bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                      Artículo: {c.blogs?.titulo || "Artículo eliminado"}
                    </span>
                  </div>

                  <button
                    onClick={() => eliminarComentarioBlog(c.id)}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-red-500 text-red-500 text-xs font-bold rounded-lg transition-colors shrink-0"
                  >
                    Borrar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}