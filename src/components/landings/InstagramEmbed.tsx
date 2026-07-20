"use client";

import { useEffect } from "react";
import { ACCENTS, type Acento } from "./accents";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type InstagramEmbedProps = {
  url: string;
  acento?: Acento;
};

const SCRIPT_ID = "instagram-embed-script";

// Ancho fijo del embed: si cambia, hay que volver a calibrar HEADER_ALTO /
// CROP_ALTO de abajo (se midieron a mano para este ancho exacto).
const EMBED_ANCHO = 400;
const HEADER_ALTO = 55; // franja superior (usuario + "View profile") a recortar
const CROP_ALTO = 497; // alto visible resultante: solo el video, sin header ni pie

// Embed oficial de Instagram (instagram.com/embed.js): la misma pieza que
// ofrece Instagram para insertar un reel/post real en un sitio de terceros.
// El iframe que genera es cross-origin, así que no podemos tocar su
// contenido interno — lo que hacemos es recortar el iframe COMPLETO desde
// afuera (overflow:hidden + margin-top negativo) para que solo se vea la
// franja del video, ocultando el header y el pie (likes/comentarios).
// Es un recorte a medida (no algo que ofrezca Instagram): si Instagram
// cambia su template de embed, estos números habría que reajustarlos.
export default function InstagramEmbed({ url, acento = "fuchsia" }: InstagramEmbedProps) {
  const colores = ACCENTS[acento];

  useEffect(() => {
    const procesarEmbeds = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      procesarEmbeds();
      return;
    }

    const scriptExistente = document.getElementById(SCRIPT_ID);
    if (scriptExistente) {
      scriptExistente.addEventListener("load", procesarEmbeds);
      return () => scriptExistente.removeEventListener("load", procesarEmbeds);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", procesarEmbeds);
    document.body.appendChild(script);
  }, [url]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <div className={`absolute -inset-x-6 -inset-y-6 ${colores.glow} blur-[70px] rounded-full pointer-events-none`} />

      <div className={`relative bg-white/5 backdrop-blur-xl border ${colores.border} rounded-[2rem] p-3 md:p-4 shadow-2xl`}>
        <div
          className="ig-solo-video flex justify-center overflow-hidden rounded-[1.5rem]"
          style={{ height: CROP_ALTO }}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ background: "#000", border: 0, borderRadius: "1.5rem", margin: 0, width: EMBED_ANCHO }}
          />
        </div>
      </div>

      <style>{`
        .ig-solo-video iframe.instagram-media {
          margin-top: -${HEADER_ALTO}px !important;
        }
      `}</style>
    </div>
  );
}
