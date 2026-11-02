import type { MetadataRoute } from "next";
import { SERVICIOS_LANDING } from "@/lib/servicios-landing";
import { URL_SITIO } from "@/lib/url-sitio";

// Páginas públicas fijas. Los blogs y recursos cargados desde el panel todavía no se listan acá.
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = ["", "/servicios", ...SERVICIOS_LANDING.map((s) => s.href), "/de-creador-a-dueno", "/nosotros", "/recursos", "/blog", "/guias", "/newsletter", "/links", "/terminos-y-condiciones", "/politica-de-privacidad"];
  return rutas.map((ruta) => ({ url: `${URL_SITIO}${ruta}` }));
}
