import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/url-sitio";

// El panel, el portal de clientes y las páginas post-pago no se indexan.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/usuarios", "/auth", "/api", "/login", "/estado-pago", "/pago-exitoso", "/pago-exitoso-paypal", "/de-creador-a-dueno/checkout", "/de-creador-a-dueno/gracias"],
    },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
