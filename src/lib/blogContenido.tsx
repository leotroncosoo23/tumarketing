import { obtenerUrlEmbed } from "@/lib/media";

// El editor del panel inserta bloques [img]url[/img] y [video]url[/video] entre los párrafos.
// Acá separamos el contenido guardado en texto plano y renderizamos cada bloque según corresponda.
export function renderizarContenidoBlog(contenido: string) {
  const bloques = contenido.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return bloques.map((bloque, i) => {
    const imgMatch = bloque.match(/^\[img\](.+?)\[\/img\]$/i);
    if (imgMatch) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={imgMatch[1].trim()}
          alt=""
          className="w-full rounded-2xl my-2 border border-neutral-800"
        />
      );
    }

    const videoMatch = bloque.match(/^\[video\](.+?)\[\/video\]$/i);
    if (videoMatch) {
      const embed = obtenerUrlEmbed(videoMatch[1].trim());
      if (!embed) return null;
      return (
        <div key={i} className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 my-2 bg-neutral-900">
          <iframe
            src={embed}
            title="Video del artículo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }

    return (
      <p key={i} className="text-neutral-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
        {bloque}
      </p>
    );
  });
}
