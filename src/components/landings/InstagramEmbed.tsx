"use client";

import { useEffect, useRef, useState } from "react";
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

// El header (usuario + "View profile") y el pie (like/comentario/"Add a
// comment") del embed de Instagram miden lo mismo en píxeles sin importar el
// ancho renderizado (326–658px, el rango que soporta su script) — medido a
// mano en dos anchos distintos y confirmado que no varía. Lo único que
// escala con el ancho es el video. Por eso NO usamos una altura de recorte
// fija: medimos la altura real del iframe en cada momento (abajo, con
// ResizeObserver) y le restamos estos dos valores constantes.
const HEADER_ALTO = 55;
const FOOTER_ALTO = 154;

// Embed oficial de Instagram (instagram.com/embed.js): la misma pieza que
// ofrece Instagram para insertar un reel/post real en un sitio de terceros.
// El iframe que genera es cross-origin, así que no podemos tocar su
// contenido interno — lo que hacemos es recortar el iframe COMPLETO desde
// afuera (overflow:hidden + margin-top negativo) para que solo se vea la
// franja del video, ocultando el header y el pie (likes/comentarios).
export default function InstagramEmbed({ url, acento = "fuchsia" }: InstagramEmbedProps) {
  const colores = ACCENTS[acento];
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [altoVideo, setAltoVideo] = useState<number | null>(null);

  useEffect(() => {
    let observer: ResizeObserver | null = null;
    let intervalo: ReturnType<typeof setInterval> | null = null;

    const medir = (iframe: HTMLIFrameElement) => {
      const altoTotal = iframe.getBoundingClientRect().height;
      if (altoTotal > 0) {
        setAltoVideo(Math.max(0, altoTotal - HEADER_ALTO - FOOTER_ALTO));
      }
    };

    const observarIframe = () => {
      const iframe = contenedorRef.current?.querySelector<HTMLIFrameElement>("iframe.instagram-media");
      if (!iframe) return false;
      medir(iframe);
      observer = new ResizeObserver(() => medir(iframe));
      observer.observe(iframe);
      return true;
    };

    const procesarEmbeds = () => {
      window.instgrm?.Embeds.process();
      // Instagram tarda un instante en reemplazar el blockquote por el
      // iframe (y en ajustar su tamaño final), así que reintentamos hasta
      // encontrarlo en vez de asumir que ya está.
      if (!observarIframe()) {
        intervalo = setInterval(() => {
          if (observarIframe() && intervalo) {
            clearInterval(intervalo);
            intervalo = null;
          }
        }, 200);
      }
    };

    if (window.instgrm) {
      procesarEmbeds();
    } else {
      const scriptExistente = document.getElementById(SCRIPT_ID);
      if (scriptExistente) {
        scriptExistente.addEventListener("load", procesarEmbeds);
      } else {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.addEventListener("load", procesarEmbeds);
        document.body.appendChild(script);
      }
    }

    return () => {
      observer?.disconnect();
      if (intervalo) clearInterval(intervalo);
    };
  }, [url]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <div className={`absolute -inset-x-6 -inset-y-6 ${colores.glow} blur-[70px] rounded-full pointer-events-none`} />

      <div className={`relative bg-white/5 backdrop-blur-xl border ${colores.border} rounded-[2rem] p-3 md:p-4 shadow-2xl`}>
        <div
          ref={contenedorRef}
          className="ig-solo-video flex justify-center overflow-hidden rounded-[1.5rem]"
          style={altoVideo ? { height: altoVideo } : { minHeight: 320 }}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ background: "#000", border: 0, borderRadius: "1.5rem", margin: 0, width: "100%", maxWidth: 400 }}
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
