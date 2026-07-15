# Skill: Contenido, SEO y Marketing (Blogs y Recursos)

## Estrategia de Renderizado (Next.js)
- **Server-Side Rendering (SSR) y Static Site Generation (SSG):** Todas las páginas públicas de blogs, guías gratuitas y landing pages de cursos DEBEN ser renderizadas en el servidor. Utilizar la API de Next.js (`generateMetadata`) para asegurar que los motores de búsqueda puedan leer el contenido de inmediato.
- **Rutas Dinámicas Optimizadas:** Para las rutas como `/blog/[slug]`, pre-renderizar el contenido siempre que sea posible para lograr tiempos de carga ultrarrápidos y un mejor puntaje en Core Web Vitals de Google.

## Optimización de Metadatos y Social Sharing (Open Graph)
- **Rich Snippets:** Cada página pública debe generar dinámicamente sus meta tags de Open Graph (`og:title`, `og:image`, `og:description`) y Twitter Cards. Esto garantiza que cuando los enlaces se compartan en Instagram, TikTok o X, la tarjeta de vista previa se vea profesional y atractiva para maximizar el CTR (Click-Through Rate).
- **Integración Multimedia:** El motor del blog o las landing pages debe estar preparado para incrustar de forma nativa y responsiva iframes o componentes de video de plataformas externas como YouTube, TikTok o Kick, manteniendo el rendimiento de la página (lazy loading).

## Estructura Semántica e Indexación
- **Jerarquía HTML:** Respetar estrictamente la semántica web. Debe haber un único `<h1>` por página, seguido de un uso lógico de `<h2>` y `<h3>` para estructurar los artículos y descripciones de cursos.
- **Sitemap y Robots:** Estructurar el código para que sea fácil generar el `sitemap.xml` dinámico y gestionar el `robots.txt`, asegurando que las páginas privadas (como `/admin` o el reproductor de clases del alumno) estén excluidas de la indexación.