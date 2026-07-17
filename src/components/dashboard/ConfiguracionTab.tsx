"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

export default function ConfiguracionTab() {
  const [config, setConfig] = useState<Configuracion>(CONFIG_VACIA);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setCargando(true);
      const { data, error } = await supabase
        .from("configuracion")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error al traer configuración:", error.message);
      } else if (data) {
        // Completamos con "" cualquier columna que haya quedado en NULL en la base
        // (inputs controlados no aceptan null como value).
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
    };
    fetchConfig();
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setGuardadoOk(false);

    const { error } = await supabase
      .from("configuracion")
      .update({
        whatsapp_numero: config.whatsapp_numero.trim(),
        instagram_url: config.instagram_url.trim(),
        tiktok_url: config.tiktok_url.trim(),
        youtube_url: config.youtube_url.trim(),
        banner_texto: config.banner_texto.trim(),
        banner_activo: config.banner_activo,
        whatsapp_comunidad_url: config.whatsapp_comunidad_url.trim(),
        discord_url: config.discord_url.trim(),
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setGuardadoOk(true);
      setTimeout(() => setGuardadoOk(false), 2500);
    }
    setGuardando(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black">⚙️ Configuración del Sitio</h1>
        <p className="text-neutral-400 text-sm">
          Cambios que se reflejan al instante en la web pública. No hace falta tocar código.
        </p>
      </div>

      {cargando ? (
        <div className="p-12 text-center text-neutral-400">Cargando configuración...</div>
      ) : (
        <form onSubmit={handleGuardar} className="space-y-8">
          {/* WHATSAPP */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">
              📱 WhatsApp
            </h3>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
              Número (con código de país, sin espacios ni símbolos)
            </label>
            <input
              type="text"
              value={config.whatsapp_numero}
              onChange={(e) =>
                setConfig({ ...config, whatsapp_numero: e.target.value })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              placeholder="Ej: 5492944123456"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Este número alimenta el botón flotante de WhatsApp de toda la web.
            </p>
          </div>

          {/* REDES SOCIALES */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">
              🔗 Redes Sociales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={config.instagram_url}
                  onChange={(e) =>
                    setConfig({ ...config, instagram_url: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://instagram.com/tu_usuario"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={config.tiktok_url}
                  onChange={(e) =>
                    setConfig({ ...config, tiktok_url: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://tiktok.com/@tu_usuario"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={config.youtube_url}
                  onChange={(e) =>
                    setConfig({ ...config, youtube_url: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://youtube.com/@tu_canal"
                />
              </div>
            </div>
          </div>

          {/* BANNER */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#ccff00]">📢 Banner de Anuncios</h3>

              {/* Switch */}
              <button
                type="button"
                onClick={() =>
                  setConfig({ ...config, banner_activo: !config.banner_activo })
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  config.banner_activo ? "bg-[#ccff00]" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    config.banner_activo ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
              Texto del banner
            </label>
            <input
              type="text"
              value={config.banner_texto}
              onChange={(e) =>
                setConfig({ ...config, banner_texto: e.target.value })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
              placeholder="🔥 CyberMonday: 30% OFF en todos los cursos"
            />
            <p className="text-xs text-neutral-500 mt-2">
              {config.banner_activo
                ? "🟢 El banner está visible en la web pública ahora mismo."
                : "🔴 El banner está apagado. Prendé el switch para mostrarlo."}
            </p>

            {/* Preview */}
            {config.banner_activo && config.banner_texto && (
              <div className="mt-4 bg-[#ccff00] text-black text-sm font-bold text-center py-2 rounded-lg">
                {config.banner_texto}
              </div>
            )}
          </div>

          {/* COMUNIDAD DE ALUMNOS */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-[#ccff00] border-b border-neutral-800 pb-4 mb-6">
              👥 Comunidad de Alumnos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  Link del grupo de WhatsApp
                </label>
                <input
                  type="url"
                  value={config.whatsapp_comunidad_url}
                  onChange={(e) =>
                    setConfig({ ...config, whatsapp_comunidad_url: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                  Link de invitación a Discord
                </label>
                <input
                  type="url"
                  value={config.discord_url}
                  onChange={(e) =>
                    setConfig({ ...config, discord_url: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]"
                  placeholder="https://discord.gg/..."
                />
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              Estos links aparecen en la sección &quot;Soporte / Comunidad&quot; de la plataforma de alumnos. Dejalo vacío para que ese botón no se muestre.
            </p>
          </div>

          {/* GUARDAR */}
          <div className="flex justify-end items-center gap-4">
            {guardadoOk && (
              <span className="text-[#ccff00] text-sm font-bold">
                ✅ Guardado
              </span>
            )}
            <button
              type="submit"
              disabled={guardando}
              className="bg-[#ccff00] text-black font-black px-8 py-3 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-105 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "💾 Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}