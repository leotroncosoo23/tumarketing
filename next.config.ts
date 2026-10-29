import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Landings que se unificaron en los 3 servicios actuales (CM, Pauta, Web & Apps).
  // Permanentes para no perder el posicionamiento de las URLs viejas.
  async redirects() {
    return [
      { source: "/servicios/apps", destination: "/servicios/paginas-web", permanent: true },
      { source: "/servicios/ecommerce", destination: "/servicios/paginas-web", permanent: true },
      { source: "/servicios/creacion-edicion", destination: "/servicios/community-manager", permanent: true },
    ];
  },
};

export default nextConfig;
