# Skill: Panel de Administración y CMS Interno

## Seguridad y Control de Acceso (RBAC)
- **Protección de Rutas:** Todas las rutas bajo `src/app/admin/` deben estar estrictamente protegidas. Utilizar el Middleware de Next.js para verificar la sesión de Supabase Auth antes de renderizar cualquier componente.
- **Validación de Rol:** No basta con estar autenticado. Se debe verificar que el usuario tenga el rol de administrador (ej. `rol: 'admin'` en la tabla de perfiles) antes de permitir operaciones de escritura o lectura en el panel.

## Gestión de Contenido (Cursos, Guías y Blogs)
- **Subida de Archivos (Storage):** Para subir videos de clases, imágenes de portada o PDFs, interactuar directamente con Supabase Storage. Implementar indicadores de carga (progress bars) en el frontend de React para mejorar la experiencia al subir archivos pesados.
- **Editor de Blogs:** Para el sector de blogs, el formulario de creación debe estar preparado para procesar Markdown o integrar un editor de texto enriquecido (Rich Text Editor). Guardar el contenido procesado y estructurado en la base de datos para facilitar el SEO posterior.
- **Validación de Formularios:** Utilizar librerías como Zod o React Hook Form para validar exhaustivamente todos los datos (títulos, precios, descripciones) antes de enviarlos a las Server Actions de Next.js.

## Gestión de Alumnos y Ventas
- **Visualización de Datos:** Para la lista de alumnos y el historial de ventas, construir tablas con Tailwind CSS que incluyan paginación y búsqueda en el servidor (Server-side filtering) para no sobrecargar el navegador cuando la base de datos crezca.
- **Acciones de Administrador:** El panel debe permitir revocar accesos, emitir reembolsos (conectando con la lógica de webhooks de Mercado Pago/Stripe/PayPal) y habilitar cursos manualmente a usuarios específicos si es necesario.