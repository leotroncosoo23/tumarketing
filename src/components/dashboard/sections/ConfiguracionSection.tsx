"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Button, Input, Select, Accordion } from "@/components/dashboard/ui";

type Configuracion = {
  id: number;
  whatsapp_numero: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  banner_texto: string;
  banner_activo: boolean;
  whatsapp_comunidad_url: string;
  discord_url: string;
};

const CONFIG_VACIA: Configuracion = {
  id: 1,
  whatsapp_numero: "",
  instagram_url: "",
  tiktok_url: "",
  youtube_url: "",
  banner_texto: "",
  banner_activo: false,
  whatsapp_comunidad_url: "",
  discord_url: "",
};

type Miembro = { id: string; nombre: string | null; email: string; rol: string };

const ROLES_ACCORDION = [
  { q: "Admin", a: "Acceso total: clientes, facturación, configuración de equipo y publicación de blog." },
  { q: "Editor de contenido", a: "Puede gestionar el calendario, mensajes y el blog, sin acceso a facturación ni configuración de cuenta." },
];

export default function ConfiguracionSection() {
  const [tab, setTab] = useState<"agencia" | "equipo">("agencia");
  const [config, setConfig] = useState<Configuracion>(CONFIG_VACIA);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);

  const [equipo, setEquipo] = useState<Miembro[]>([]);
  const [mostrarInvitar, setMostrarInvitar] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [rolNuevo, setRolNuevo] = useState("editor");
  const [invitando, setInvitando] = useState(false);

  useEffect(() => {
    supabase
      .from("configuracion")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setConfig({
            id: data.id,
            whatsapp_numero: data.whatsapp_numero ?? "",
            instagram_url: data.instagram_url ?? "",
            tiktok_url: data.tiktok_url ?? "",
            youtube_url: data.youtube_url ?? "",
            banner_texto: data.banner_texto ?? "",
            banner_activo: data.banner_activo ?? false,
            whatsapp_comunidad_url: data.whatsapp_comunidad_url ?? "",
            discord_url: data.discord_url ?? "",
          });
        }
        setCargando(false);
      });
  }, []);

  const cargarEquipo = async () => {
    const { data } = await supabase.from("usuarios").select("id, nombre, email, rol").in("rol", ["admin", "editor"]);
    setEquipo(data || []);
  };

  useEffect(() => {
    if (tab === "equipo") cargarEquipo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const guardarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setGuardadoOk(false);
    const { error } = await supabase
      .from("configuracion")
      .update({ ...config, actualizado_en: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setGuardadoOk(true);
      setTimeout(() => setGuardadoOk(false), 2500);
    }
    setGuardando(false);
  };

  const invitarMiembro = async () => {
    if (!nombreNuevo.trim() || !emailNuevo.trim()) return;
    setInvitando(true);
    const password = Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 90 + 10);
    try {
      const res = await fetch("/api/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNuevo.trim(), nombre: nombreNuevo.trim(), password, rol: rolNuevo }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.error);
      } else {
        alert(`Miembro creado. Contraseña temporal: ${password}`);
        setNombreNuevo("");
        setEmailNuevo("");
        setMostrarInvitar(false);
        cargarEquipo();
      }
    } catch (err) {
      alert("Error de conexión: " + (err instanceof Error ? err.message : "desconocido"));
    }
    setInvitando(false);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTab("agencia")}
          className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold ${
            tab === "agencia" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
          }`}
        >
          Agencia
        </button>
        <button
          onClick={() => setTab("equipo")}
          className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold ${
            tab === "equipo" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "bg-[var(--surface-card)] text-[var(--text-secondary)]"
          }`}
        >
          Equipo
        </button>
      </div>

      {tab === "agencia" ? (
        cargando ? (
          <p className="text-center text-[var(--text-tertiary)]">Cargando...</p>
        ) : (
          <form onSubmit={guardarConfig} className="max-w-xl">
            <Card className="flex flex-col gap-4">
              <Input
                label="WhatsApp (con código de país)"
                value={config.whatsapp_numero}
                onChange={(e) => setConfig({ ...config, whatsapp_numero: e.target.value })}
                placeholder="5492944123456"
              />
              <Input
                label="Instagram"
                value={config.instagram_url}
                onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
              />
              <Input
                label="TikTok"
                value={config.tiktok_url}
                onChange={(e) => setConfig({ ...config, tiktok_url: e.target.value })}
              />
              <Input
                label="YouTube"
                value={config.youtube_url}
                onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
              />
              <Input
                label="Texto del banner"
                value={config.banner_texto}
                onChange={(e) => setConfig({ ...config, banner_texto: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={config.banner_activo}
                  onChange={(e) => setConfig({ ...config, banner_activo: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Banner activo en el sitio
              </label>
              <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
                {guardadoOk && <span className="text-sm font-semibold text-[var(--accent)]">Guardado</span>}
                <Button type="submit" disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </Card>
          </form>
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)]">Equipo</h3>
              <Button variant="secondary" onClick={() => setMostrarInvitar((v) => !v)}>
                + Invitar miembro
              </Button>
            </div>
            {mostrarInvitar && (
              <div className="mb-4 flex flex-col gap-3 rounded-[var(--radius-m)] border border-[var(--border-subtle)] p-4">
                <Input value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} placeholder="Nombre" />
                <Input type="email" value={emailNuevo} onChange={(e) => setEmailNuevo(e.target.value)} placeholder="Email" />
                <Select value={rolNuevo} onChange={(e) => setRolNuevo(e.target.value)}>
                  <option value="editor">Editor de contenido</option>
                  <option value="admin">Admin</option>
                </Select>
                <Button onClick={invitarMiembro} disabled={invitando || !nombreNuevo.trim() || !emailNuevo.trim()}>
                  {invitando ? "Creando..." : "Crear miembro"}
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {equipo.map((m) => (
                <div key={m.id} className="flex items-center gap-3 border-t border-[var(--border-subtle)] py-2.5 first:border-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--black-4)] text-xs font-bold text-[var(--accent)]">
                    {(m.nombre || m.email).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{m.nombre || m.email}</p>
                    <p className="text-xs capitalize text-[var(--text-tertiary)]">{m.rol === "admin" ? "Admin" : "Editor de contenido"}</p>
                  </div>
                </div>
              ))}
              {equipo.length === 0 && <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">Sin miembros de equipo todavía.</p>}
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 font-bold text-[var(--text-primary)]">¿Cómo funcionan los roles?</h3>
            <Accordion items={ROLES_ACCORDION} />
          </Card>
        </div>
      )}
    </div>
  );
}
