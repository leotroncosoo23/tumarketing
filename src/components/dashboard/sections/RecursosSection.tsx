"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Input, Textarea, Select, Badge, StatCard } from "@/components/dashboard/ui";

export type Recurso = {
  id: string;
  titulo: string;
  slug: string;
  tipo: "Gratis" | "Pago";
  precio: number | null;
  formato: string | null;
  icono: string | null;
  imagen_url: string | null;
  archivo_url: string | null;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  beneficios: string | null;
  estado: "Publicado" | "Borrador";
  creado_en: string;
  descargas?: number;
};

const VACIO: Omit<Recurso, "id" | "creado_en" | "descargas"> = {
  titulo: "",
  slug: "",
  tipo: "Gratis",
  precio: null,
  formato: "",
  icono: "📄",
  imagen_url: "",
  archivo_url: "",
  descripcion_corta: "",
  descripcion_larga: "",
  beneficios: "",
  estado: "Publicado",
};

const FORMATOS_SUGERIDOS = ["Google Sheets", "PDF Interactivo", "Notion Template", "Looker Studio", "Ebook PDF", "Figma / Canva"];

function money(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export default function RecursosSection({ initial }: { initial: Recurso[] }) {
  const [recursos, setRecursos] = useState<Recurso[]>(initial);
  const [filtro, setFiltro] = useState<"todos" | Recurso["estado"]>("todos");
  const [vista, setVista] = useState<"lista" | "editor">("lista");
  const [editando, setEditando] = useState<Recurso | null>(null);
  const [draft, setDraft] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoImagenContenido, setSubiendoImagenContenido] = useState(false);
  const contenidoRef = useRef<HTMLTextAreaElement>(null);

  const refrescarRecursos = async () => {
    const { data } = await supabase
      .from("recursos")
      .select("*, recursos_descargas(count)")
      .order("creado_en", { ascending: false });
    setRecursos(
      ((data as unknown as (Recurso & { recursos_descargas?: { count: number }[] })[]) || []).map((r) => ({
        ...r,
        descargas: r.recursos_descargas?.[0]?.count ?? 0,
      }))
    );
  };

  const abrirNuevo = () => {
    setEditando(null);
    setDraft(VACIO);
    setVista("editor");
  };

  const abrirEdicion = (r: Recurso) => {
    setEditando(r);
    setDraft({
      titulo: r.titulo,
      slug: r.slug,
      tipo: r.tipo,
      precio: r.precio,
      formato: r.formato || "",
      icono: r.icono || "📄",
      imagen_url: r.imagen_url || "",
      archivo_url: r.archivo_url || "",
      descripcion_corta: r.descripcion_corta || "",
      descripcion_larga: r.descripcion_larga || "",
      beneficios: r.beneficios || "",
      estado: r.estado,
    });
    setVista("editor");
  };

  const handleTitulo = (titulo: string) => {
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setDraft((d) => ({ ...d, titulo, slug: editando ? d.slug : slug }));
  };

  const subirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const insertarEnContenido = (texto: string) => {
    const textarea = contenidoRef.current;
    if (!textarea) {
      setDraft((prev) => ({ ...prev, descripcion_larga: (prev.descripcion_larga || "") + texto }));
      return;
    }
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    setDraft((prev) => ({
      ...prev,
      descripcion_larga: (prev.descripcion_larga || "").slice(0, inicio) + texto + (prev.descripcion_larga || "").slice(fin),
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
      precio: draft.tipo === "Pago" && draft.precio ? Number(draft.precio) : null,
    };
    const { error } = editando
      ? await supabase.from("recursos").update(payload).eq("id", editando.id)
      : await supabase.from("recursos").insert([payload]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setVista("lista");
      await refrescarRecursos();
    }
    setGuardando(false);
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Borrar este recurso para siempre?")) return;
    const { error } = await supabase.from("recursos").delete().eq("id", id);
    if (error) return alert("Error al borrar: " + error.message);
    refrescarRecursos();
  };

  const filtrados = recursos.filter((r) => filtro === "todos" || r.estado === filtro);

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
            <Input label="Título del recurso" value={draft.titulo} onChange={(e) => handleTitulo(e.target.value)} />
            <Input label="Slug (URL)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            <Textarea
              label="Descripción corta (tarjeta y subtítulo)"
              rows={2}
              value={draft.descripcion_corta || ""}
              onChange={(e) => setDraft({ ...draft, descripcion_corta: e.target.value })}
            />
            <Textarea
              label="¿Qué te llevás? (una línea por beneficio)"
              rows={4}
              value={draft.beneficios || ""}
              onChange={(e) => setDraft({ ...draft, beneficios: e.target.value })}
              placeholder={"200 hooks listos para usar\nHooks para Reels, TikTok y Shorts"}
            />

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">
                  Desarrollo (info completa del recurso)
                </span>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInsertarImagenContenido}
                    disabled={subiendoImagenContenido}
                    className="hidden"
                    id="imagen-contenido-recurso"
                  />
                  <label
                    htmlFor="imagen-contenido-recurso"
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
                value={draft.descripcion_larga || ""}
                onChange={(e) => setDraft({ ...draft, descripcion_larga: e.target.value })}
                placeholder="Contale al usuario todo sobre el recurso. Dejá una línea en blanco entre párrafos."
              />
            </div>
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-4">
              <Select label="Estado" value={draft.estado} onChange={(e) => setDraft({ ...draft, estado: e.target.value as Recurso["estado"] })}>
                <option value="Publicado">🟢 Publicado (visible)</option>
                <option value="Borrador">🟠 Borrador (oculto)</option>
              </Select>
              <Select label="Tipo" value={draft.tipo} onChange={(e) => setDraft({ ...draft, tipo: e.target.value as Recurso["tipo"] })}>
                <option value="Gratis">🎁 Gratis (pide email)</option>
                <option value="Pago">💎 Pago (WhatsApp)</option>
              </Select>
              {draft.tipo === "Pago" && (
                <Input
                  label="Precio (AR$)"
                  type="number"
                  value={draft.precio ?? ""}
                  onChange={(e) => setDraft({ ...draft, precio: e.target.value ? Number(e.target.value) : null })}
                />
              )}
              <Input
                label="Formato"
                list="formatos-sugeridos"
                value={draft.formato || ""}
                onChange={(e) => setDraft({ ...draft, formato: e.target.value })}
                placeholder="Ej: Google Sheets"
              />
              <datalist id="formatos-sugeridos">
                {FORMATOS_SUGERIDOS.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
              <Input
                label="Ícono (emoji)"
                value={draft.icono || ""}
                onChange={(e) => setDraft({ ...draft, icono: e.target.value })}
                maxLength={4}
              />
              <Input
                label="Link de descarga (Drive, Notion, PDF...)"
                value={draft.archivo_url || ""}
                onChange={(e) => setDraft({ ...draft, archivo_url: e.target.value })}
                placeholder="https://..."
              />
            </Card>
            <Card>
              <h3 className="mb-3 text-sm font-bold text-[var(--text-primary)]">Imagen / mockup</h3>
              <div className="mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-[var(--radius-m)] bg-[var(--surface-sunken)]">
                {draft.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imagen_url} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--text-tertiary)]">Sin imagen</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={subirImagen} disabled={subiendoImagen} id="imagen-recurso" className="hidden" />
              <label
                htmlFor="imagen-recurso"
                className="block cursor-pointer rounded-[var(--radius-m)] border border-[var(--border-subtle)] py-2.5 text-center text-sm text-[var(--text-secondary)] hover:border-[var(--accent)]"
              >
                {subiendoImagen ? "Subiendo..." : "Subir imagen"}
              </label>
            </Card>
            <Button onClick={guardar} disabled={guardando || !draft.titulo.trim()}>
              {guardando ? "Guardando..." : editando ? "Actualizar recurso" : "Publicar recurso"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="tm-display text-2xl font-bold text-[var(--text-primary)]">Guías y Recursos</h1>
        <p className="text-[var(--text-secondary)]">Lead magnets gratis o pagos que le ofrecés a tu comunidad en /recursos.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Publicados" value={recursos.filter((r) => r.estado === "Publicado").length} />
        <StatCard label="Borradores" value={recursos.filter((r) => r.estado === "Borrador").length} />
        <StatCard label="Gratis" value={recursos.filter((r) => r.tipo === "Gratis").length} />
        <StatCard label="Descargas totales" value={recursos.reduce((acc, r) => acc + (r.descargas ?? 0), 0)} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["todos", "Publicado", "Borrador"] as const).map((f) => (
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
        <Button onClick={abrirNuevo}>+ Nuevo recurso</Button>
      </div>

      <div className="flex flex-col gap-3">
        {filtrados.map((r) => (
          <Card key={r.id} className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-s)] bg-[var(--surface-sunken)] text-2xl">
              {r.icono || "📄"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge tone={r.estado === "Publicado" ? "lime" : "gray"}>{r.estado}</Badge>
                <Badge tone={r.tipo === "Pago" ? undefined : "lime"}>
                  {r.tipo === "Pago" ? `💎 ${money(Number(r.precio || 0))}` : "🎁 Gratis"}
                </Badge>
                <span className="text-xs text-[var(--text-tertiary)]">📥 {r.descargas ?? 0} descargas</span>
              </div>
              <p className="truncate font-bold text-[var(--text-primary)]">{r.titulo}</p>
              <span className="text-xs text-[var(--text-tertiary)]">{r.formato}</span>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" className="text-xs" onClick={() => abrirEdicion(r)}>
                Editar
              </Button>
              <Button variant="danger" className="text-xs" onClick={() => eliminar(r.id)}>
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <p className="py-10 text-center text-[var(--text-tertiary)]">No hay recursos con este filtro.</p>
        )}
      </div>
    </div>
  );
}
