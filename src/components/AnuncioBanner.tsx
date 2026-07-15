"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ConfigBanner = {
  banner_texto: string;
  banner_activo: boolean;
};

export default function AnuncioBanner() {
  const [config, setConfig] = useState<ConfigBanner | null>(null);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracion")
        .select("banner_texto, banner_activo")
        .eq("id", 1)
        .single();

      if (data) setConfig(data as ConfigBanner);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config?.banner_texto && sessionStorage.getItem("banner_cerrado") === config.banner_texto) {
      setCerrado(true);
    }
  }, [config?.banner_texto]);

  if (!config?.banner_activo || !config.banner_texto || cerrado) return null;

  const cerrarBanner = () => {
    sessionStorage.setItem("banner_cerrado", config.banner_texto);
    setCerrado(true);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500">
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-anuncio-marquee">
            {[0, 1].map((grupo) => (
              <div key={grupo} className="flex shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-6 py-2.5 whitespace-nowrap text-black font-bold text-sm tracking-wide"
                  >
                    <span className="text-base animate-pulse">⚡</span>
                    {config.banner_texto}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={cerrarBanner}
          aria-label="Cerrar anuncio"
          className="shrink-0 px-4 py-2.5 text-black/60 hover:text-black hover:bg-black/10 transition-colors"
        >
          ✕
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes anuncio-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-anuncio-marquee {
          width: max-content;
          animation: anuncio-marquee-scroll 22s linear infinite;
        }
        .animate-anuncio-marquee:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </div>
  );
}
