// Dominio público del sitio (metadatos, sitemap y robots). Sale de NEXTAUTH_URL,
// la misma variable que usan los pagos y los emails: para cambiar de dominio
// alcanza con actualizarla en el hosting.
export const URL_SITIO = (process.env.NEXTAUTH_URL || "https://www.tumarketing.agency").replace(/\/$/, "");
