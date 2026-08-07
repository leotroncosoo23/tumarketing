"use client";

import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Input, Textarea, Select, Badge, StatCard } from "@/components/dashboard/ui";
import type { Blog } from "@/components/dashboard/AdminShell";

const VACIO: Omit<Blog, "id" | "creado_en"> = {
  titulo: "",
  slug: "",
  autor: "",
  resumen: "",
  contenido: "",
  imagen_url: "",
  categoria: "Marketing",
  estado: "Publicado",
  vistas: 0,
  meta_titulo: "",
  meta_descripcion: "",
  tags: "",
  fecha_programada: "",
};

type ComentarioBlog = {
  id: string;
  nombre: string;
  comentario: string;
  creado_en: string;
  estado: string;
  blogs?: { titulo: string } | null;
};

export default function BlogSection({ initial }: { initial: Blog[] }) {
  const [tab, setTab] = useState<"entradas" | "comentarios">("entradas");
  const [blogs, setBlogs] = useState<Blog[]>(initial);
  const [filtro, setFiltro] = useState<"todos" | string>("todos");
  const [vista, setVista] = useState<"lista" | "editor">("lista");
  const [editando, setEditando] = useState<Blog | null>(null);
  const [draft, setDraft] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenContenido, setSubiendoImagenContenido] = useState(false);
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  // Aviso por mail a los suscriptores del newsletter (tabla "suscriptores",
  // vía /api/enviar-notificacion-blog, que ya existía pero no se llamaba desde
  // ningún lado). Se resetea a false en cada apertura del editor a propósito:
  // no querés que un simple ajuste de texto en un post ya publicado vuelva a
  // disparar el mail sin que el admin lo tilde de nuevo.
  const [notificarSuscriptores, setNotificarSuscriptores] = useState(false);
  const [enviandoNewsletter, setEnviandoNewsletter] = useState(false);

  const [comentarios, setComentarios] = useState<ComentarioBlog[]>([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(false);

  const refrescarBlogs = async () => {
    const { data } = await supabase.from("blogs").select("*").order("creado_en", { ascending: false });
    setBlogs((data as Blog[]) || []);
  };

  const cargarComentarios = async () => {
    setCargandoComentarios(true);
    const { data } = await supabase.from("comentarios_blog").select("*, blogs(titulo)").order("creado_en", { ascending: false });
    setComentarios((data as ComentarioBlog[]) || []);
    setCargandoComentarios(false);
  };

  useEffect(() => {
    if (tab === "comentarios") cargarComentarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const abrirNuevo = () => {
    setEditando(null);
    setDraft(VACIO);
    setNotificarSuscriptores(false);
    setVista("editor");
  };

  const abrirEdicion = (b: Blog) => {
    setEditando(b);
    setDraft({
      titulo: b.titulo,
      slug: b.slug,
      autor: b.autor || "",
      resumen: b.resumen,
      contenido: b.contenido,
      imagen_url: b.imagen_url || "",
      categoria: b.categoria,
      estado: b.estado,
      vistas: b.vistas ?? 0,
      meta_titulo: b.meta_titulo || "",
      meta_descripcion: b.meta_descripcion || "",
      tags: b.tags || "",
      fecha_programada: b.fecha_programada || "",
    });
    setNotificarSuscriptores(false);
    setVista("editor");
  };

  const handleTitulo = (titulo: string) => {
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setDraft((d) => ({ ...d, titulo, slug: editando ? d.slug : slug }));
  };

  const subirPortada = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoImagen(true);
    const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("imagenes-blog").upload(fileName, file);
    if (error) {
      alert("Error subiendo imagen: " + error.message);
    } else {
      const { data } = supabase.storage.from("imagenes-blog").getPublicUrl(fileName);
      setDraft((d) => ({ ...d, imagen_url: data.publicUrl }));
    }
    setSubiendoImagen(false);
  };

  // Inserta texto en "Contenido" en la posición del cursor (no al final),
  // igual que ya funcionaba en RecursoTab.tsx para "descripcion_larga".
  const insertarEnContenido = (texto: string) => {
    const textarea = contenidoRef.current;
    if (!textarea) {
      setDraft((prev) => ({ ...prev, contenido: prev.contenido + texto }));
      return;
    }
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    setDraft((prev) => ({
      ...prev,
      contenido: prev.contenido.slice(0, inicio) + texto + prev.contenido.slice(fin),
    }));
    requestAnimationFrame(() => {
      const pos = inicio + texto.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const handleInsertarImagenContenido = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoImagenContenido(true);
    const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("imagenes-blog").upload(fileName, file);
    if (error) {
      alert("Error subiendo imagen: " + error.message);
    } else {
      const { data } = supabase.storage.from("imagenes-blog").getPublicUrl(fileName);
      insertarEnContenido(`\n[img]${data.publicUrl}[/img]\n`);
    }
    setSubiendoImagenContenido(false);
    e.target.value = "";
  };

  const handleInsertarVideo = () => {
    const url = prompt("Pegá la URL del video (YouTube o Vimeo):");
    if (!url?.trim()) return;
    insertarEnContenido(`\n[video]${url.trim()}[/video]\n`);
  };

  const guardar = async () => {
    setGuardando(true);
    const payload = {
      ...draft,
      fecha_programada: draft.fecha_programada || null,
    };
    const { error } = editando
      ? await supabase.from("blogs").update(payload).eq("id", editando.id)
      : await supabase.from("blogs").insert([payload]);
    if (error) {
      alert("Error al guardar: " + error.message);
      setGuardando(false);
      return;
    }

    // El aviso por mail solo tiene sentido si el post queda Publicado ahora
    // mismo: uno Programado o en Borrador todavía no tiene nada para leer.
    if (notificarSuscriptores && draft.estado === "Publicado") {
      setEnviandoNewsletter(true);
      try {
        const res = await fetch("/api/enviar-notificacion-blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: draft.titulo, descripcion: draft.resumen, imagen_url: draft.imagen_url, slug: draft.slug }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert("No pudimos avisar a los suscriptores: " + (data.error || "error desconocido"));
        } else if (data.errores?.length) {
          alert(`📧 ${data.message}\n\nErrores:\n` + data.errores.join("\n"));
        } else {
          alert(`📧 ${data.message}`);
        }
      } catch (err) {
        alert("No pudimos avisar a los suscriptores: " + (err instanceof Error ? err.message : "error de red"));
      }
      setEnviandoNewsletter(false);
    }

    setVista("lista");
    await refrescarBlogs();
    setGuardando(false);
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Borrar este artículo?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return alert("Error al borrar: " + error.message);
    refrescarBlogs();
  };

  const moderarComentario = async (id: string, estado: "aprobado" | "pendiente") => {
    const { error } = await supabase.from("comentarios_blog").update({ estado }).eq("id", id);
    if (error) return alert("No pudimos moderar (¿corriste la migración SQL?): " + error.message);
    cargarComentarios();
  };

  const borrarComentario = async (id: string) => {
    if (!confirm("¿Borrar este comentario?")) return;
    const { error } = await supabase.from("comentarios_blog").delete().eq("id", id);
    if (error) return alert("Error al borrar: " + error.message);
    cargarComentarios();
  };

  const filtrados = blogs.filter((b) => filtro === "todos" || b.estado === filtro);
  const pendientes = comentarios.filter((c) => (c.estado ?? "aprobado") === "pendiente").length;

  if (vista === "editor") {
    return (
      <div>
        <button
          onClick={() => setVista("lista")}
          className="mb-5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Volver al listado
        </button>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card className="flex flex-col gap-4">
            <Input label="Título" value={draft.titulo} onChange={(e) => handleTitulo(e.target.value)} />
            <Input label="Slug (URL)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            <Textarea
              label="Extracto"
              rows={2}
              value={draft.resumen}
              onChange={(e) => setDraft({ ...draft, resumen: e.target.value })}
            />
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Contenido</span>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInsertarImagenContenido}
                    disabled={subiendoImagenContenido}
                    className="hidden"
                    id="imagen-contenido-blog"
                  />
                  <label
                    htmlFor="imagen-contenido-blog"
                    className="cursor-pointer rounded-[var(--radius-s)] bg-[var(--black-4)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--black-5)]"
                  >
                    {subiendoImagenContenido ? "Subiendo..." : "🖼️ Insertar imagen"}
                  </label>
                  <button
                    type="button"
                    onClick={handleInsertarVideo}
                    className="rounded-[var(--radius-s)] bg-[var(--black-4)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--black-5)]"
                  >
                    🎬 Insertar video
                  </button>
                </div>
              </div>
              <Textarea
                ref={contenidoRef}
                rows={12}
                value={draft.contenido}
                onChange={(e) => setDraft({ ...draft, contenido: e.target.value })}
                placeholder="Dejá una línea en blanco entre párrafos. Usá los botones de arriba para insertar imágenes o videos en cualquier punto."
              />
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-4">
              <h3 className="tm-display mb-3 font-bold text-[var(--text-primary)]">SEO</h3>
              <div className="flex flex-col gap-4">
                <Input
                  label="Meta título"
                  value={draft.meta_titulo || ""}
                  onChange={(e) => setDraft({ ...draft, meta_titulo: e.target.value })}
                />
                <Input
                  label="Meta descripción"
                  value={draft.meta_descripcion || ""}
                  onChange={(e) => setDraft({ ...draft, meta_descripcion: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-4">
              <Select label="Estado" value={draft.estado} onChange={(e) => setDraft({ ...draft, estado: e.target.value })}>
                <option value="Borrador">Borrador</option>
                <option value="Programado">Programado</option>
                <option value="Publicado">Publicado</option>
              </Select>
              <Select label="Categoría" value={draft.categoria} onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}>
                <option>Marketing</option>
                <option>Redes Sociales</option>
                <option>Branding</option>
                <option>Ventas</option>
                <option>Web</option>
                <option>Estrategia</option>
                <option>Publicidad</option>
                <option>Casos de Éxito</option>
              </Select>
              <Input label="Autor" value={draft.autor || ""} onChange={(e) => setDraft({ ...draft, autor: e.target.value })} />
              <Input label="Tags" value={draft.tags || ""} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="marketing, redes" />
              {draft.estado === "Programado" && (
                <Input
                  label="Fecha de programación"
                  type="date"
                  value={draft.fecha_programada?.slice(0, 10) || ""}
                  onChange={(e) => setDraft({ ...draft, fecha_programada: e.target.value })}
                />
              )}
            </Card>

            <Card>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-m)] border p-3 transition-colors ${
                  notificarSuscriptores ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border-subtle)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={notificarSuscriptores}
                  onChange={(e) => setNotificarSuscriptores(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span className="flex items-center gap-2 text-[var(--text-primary)] [font-size:var(--fs-body-s)]">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  Enviar a suscriptores del newsletter
                </span>
              </label>
              {notificarSuscriptores && draft.estado !== "Publicado" && (
                <p className="mt-2 text-[var(--text-tertiary)] [font-size:12px]">
                  Solo se envía si el estado queda en &quot;Publicado&quot; al guardar.
                </p>
              )}
            </Card>
            <Card>
              <h3 className="mb-3 text-sm font-bold text-[var(--text-primary)]">Portada</h3>
              <div className="mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-[var(--radius-m)] bg-[var(--surface-sunken)]">
                {draft.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imagen_url} alt="Portada" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--text-tertiary)]">Sin imagen</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={subirPortada} disabled={subiendoImagen} id="portada-blog" className="hidden" />
              <label
                htmlFor="portada-blog"
                className="block cursor-pointer rounded-[var(--radius-m)] border border-[var(--border-subtle)] py-2.5 text-center text-sm text-[var(--text-secondary)] hover:border-[var(--accent)]"
              >
                {subiendoImagen ? "Subiendo..." : "Subir imagen"}
              </label>
            </Card>
            <Button onClick={guardar} disabled={guardando || !draft.titulo.trim()}>
              {enviandoNewsletter ? "Avisando a suscriptores..." : guardando ? "Guardando..." : "Guardar entrada"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTab("entradas")}
          className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold ${
            tab === "entradas" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
          }`}
        >
          Entradas
        </button>
        <button
          onClick={() => setTab("comentarios")}
          className={`flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold ${
            tab === "comentarios" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
          }`}
        >
          Comentarios
          {pendientes > 0 && <Badge tone="red">{pendientes}</Badge>}
        </button>
      </div>

      {tab === "comentarios" ? (
        <div className="flex flex-col gap-3">
          {cargandoComentarios && <p className="text-center text-[var(--text-tertiary)]">Cargando...</p>}
          {comentarios.map((c) => {
            const estado = c.estado ?? "aprobado";
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{c.nombre}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">en «{c.blogs?.titulo || "Artículo eliminado"}»</span>
                      <Badge tone={estado === "aprobado" ? "lime" : "gray"}>{estado}</Badge>
                    </div>
                    <p className="mb-1 text-sm text-[var(--text-secondary)]">{c.comentario}</p>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {new Date(c.creado_en).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {estado !== "aprobado" && (
                      <Button variant="secondary" className="text-xs" onClick={() => moderarComentario(c.id, "aprobado")}>
                        Aprobar
                      </Button>
                    )}
                    <Button variant="danger" className="text-xs" onClick={() => borrarComentario(c.id)}>
                      Borrar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {!cargandoComentarios && comentarios.length === 0 && (
            <p className="py-10 text-center text-[var(--text-tertiary)]">Todavía no hay comentarios.</p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
            <StatCard label="Publicados" value={blogs.filter((b) => b.estado === "Publicado").length} />
            <StatCard label="Borradores" value={blogs.filter((b) => b.estado === "Borrador").length} />
            <StatCard label="Programados" value={blogs.filter((b) => b.estado === "Programado").length} />
            <StatCard label="Vistas totales" value={blogs.reduce((acc, b) => acc + (b.vistas ?? 0), 0)} />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(["todos", "Publicado", "Borrador", "Programado"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold ${
                    filtro === f ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
                  }`}
                >
                  {f === "todos" ? "Todos" : f}
                </button>
              ))}
            </div>
            <Button onClick={abrirNuevo}>+ Nueva entrada</Button>
          </div>

          <div className="flex flex-col gap-3">
            {filtrados.map((post) => (
              <Card key={post.id} className="flex items-center gap-4">
                <div className="h-[70px] w-[100px] shrink-0 overflow-hidden rounded-[var(--radius-s)] bg-[var(--surface-sunken)]">
                  {post.imagen_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imagen_url} alt={post.titulo} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge>{post.estado}</Badge>
                    <span className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">{post.categoria}</span>
                  </div>
                  <p className="truncate font-bold text-[var(--text-primary)]">{post.titulo}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {post.autor || "Equipo"} · {(post.vistas ?? 0).toLocaleString("es-AR")} vistas
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" className="text-xs" onClick={() => abrirEdicion(post)}>
                    Editar
                  </Button>
                  <Button variant="danger" className="text-xs" onClick={() => eliminar(post.id)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
            {filtrados.length === 0 && (
              <p className="py-10 text-center text-[var(--text-tertiary)]">No hay artículos con este filtro.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
