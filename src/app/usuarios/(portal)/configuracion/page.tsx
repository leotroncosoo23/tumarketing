"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUsuarioPortal } from "../layout";

type Perfil = {
  nombre: string;
  email: string;
  nombre_negocio: string;
  instagram_handle: string;
};

type Preferencias = {
  novedades_proyecto: boolean;
  mensajes_equipo: boolean;
  novedades_promos: boolean;
};

function Toggle({ activo, onChange }: { activo: boolean; onChange: (valor: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!activo)}
      className={`w-11 h-6 rounded-full p-0.5 flex shrink-0 transition-colors ${activo ? "bg-[#ccff00] justify-end" : "bg-neutral-800 justify-start"}`}
      aria-pressed={activo}
    >
      <span className="w-5 h-5 rounded-full bg-white" />
    </button>
  );
}

export default function ConfiguracionPage() {
  const { perfil } = useUsuarioPortal();
  const [form, setForm] = useState<Perfil>({ nombre: "", email: "", nombre_negocio: "", instagram_handle: "" });
  const [prefs, setPrefs] = useState<Preferencias>({ novedades_proyecto: true, mensajes_equipo: true, novedades_promos: false });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const [usuarioRes, prefsRes] = await Promise.all([
        supabase.from("usuarios").select("nombre, email, nombre_negocio, instagram_handle").eq("id", perfil.id).maybeSingle(),
        supabase.from("preferencias_notificacion").select("novedades_proyecto, mensajes_equipo, novedades_promos").eq("usuario_id", perfil.id).maybeSingle(),
      ]);

      if (usuarioRes.data) {
        setForm({
          nombre: usuarioRes.data.nombre || "",
          email: usuarioRes.data.email || "",
          nombre_negocio: usuarioRes.data.nombre_negocio || "",
          instagram_handle: usuarioRes.data.instagram_handle || "",
        });
      }
      if (prefsRes.data) setPrefs(prefsRes.data);
      setCargando(false);
    };
    cargar();
  }, [perfil.id]);

  const guardar = async () => {
    setGuardando(true);
    const [resUsuario, resPrefs] = await Promise.all([
      supabase
        .from("usuarios")
        .update({ nombre: form.nombre.trim(), nombre_negocio: form.nombre_negocio.trim() || null, instagram_handle: form.instagram_handle.trim() || null })
        .eq("id", perfil.id),
      supabase.from("preferencias_notificacion").upsert([{ usuario_id: perfil.id, ...prefs }], { onConflict: "usuario_id" }),
    ]);
    setGuardando(false);

    if (resUsuario.error || resPrefs.error) {
      alert("Error al guardar: " + (resUsuario.error?.message || resPrefs.error?.message));
      return;
    }
    alert("Cambios guardados.");
  };

  if (cargando) return <p className="text-neutral-400">Cargando...</p>;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-black mb-1">Configuración</h1>
      <p className="text-neutral-400 text-sm mb-8">Tus datos, tu negocio y tus preferencias de notificación.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Nombre completo</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Email</label>
          <input value={form.email} disabled className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-500 outline-none cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Nombre del negocio</label>
          <input
            value={form.nombre_negocio}
            onChange={(e) => setForm({ ...form, nombre_negocio: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Instagram</label>
          <input
            value={form.instagram_handle}
            onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })}
            placeholder="@tunegocio"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
          />
        </div>
      </div>

      <h3 className="text-lg font-black mb-4">Notificaciones</h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white">Novedades de tu proyecto</p>
            <p className="text-xs text-neutral-500">Avisos cuando cambia el estado de una etapa</p>
          </div>
          <Toggle activo={prefs.novedades_proyecto} onChange={(v) => setPrefs({ ...prefs, novedades_proyecto: v })} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white">Mensajes del equipo</p>
            <p className="text-xs text-neutral-500">Notificaciones de chat nuevas</p>
          </div>
          <Toggle activo={prefs.mensajes_equipo} onChange={(v) => setPrefs({ ...prefs, mensajes_equipo: v })} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white">Novedades y promociones</p>
            <p className="text-xs text-neutral-500">Ofertas y contenido de Tu Marketing</p>
          </div>
          <Toggle activo={prefs.novedades_promos} onChange={(v) => setPrefs({ ...prefs, novedades_promos: v })} />
        </div>
      </div>

      <button
        onClick={guardar}
        disabled={guardando}
        className="bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#b8e600] transition-colors disabled:opacity-40"
      >
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </>
  );
}
