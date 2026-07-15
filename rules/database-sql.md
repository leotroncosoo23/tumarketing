# Skill: Base de Datos, Backend y Modelado (Supabase & PostgreSQL)

## Stack y Herramientas
- Proveedor: Supabase.
- Base de Datos: PostgreSQL.
- Cliente: `@supabase/supabase-js` (o `@supabase/ssr` en Next.js para Server Components).

## Reglas de Arquitectura con Supabase
- **Autenticación:** Utilizar siempre Supabase Auth para el manejo de sesiones de administradores y alumnos.
- **Seguridad (RLS):** Toda consulta a la base de datos debe tener en cuenta el Row Level Security (RLS) de Supabase. El código debe asumir que un alumno solo puede leer los cursos que compró y el administrador tiene acceso total.
- **Storage:** Para los recursos gratuitos, blogs y guías, utilizar Supabase Storage. Generar URLs públicas para recursos gratuitos y URLs firmadas (signed URLs) para los recursos de pago.

## Convenciones de Nombrado
- Tablas: Usar minúsculas y plural (ej. `usuarios`, `cursos`, `compras`).
- Columnas: Usar snake_case (ej. `fecha_creacion`, `usuario_id`).

## Estructura Core del Negocio (Marketing y Cursos)
Tener en cuenta este modelo mental al generar consultas:
1. **Usuarios:** Gestionados principalmente por Supabase Auth, pero con una tabla pública `perfiles` o `usuarios` atada al `auth.uid()` para guardar el rol (`admin` o `alumno`).
2. **Productos:** Tabla para cursos y guías (`tipo: 'curso' | 'guia_gratis' | 'guia_pago'`). 
3. **Compras/Accesos:** Tabla puente vital. Relaciona el ID del usuario con el ID del producto.
4. **Progreso:** Tabla para rastrear qué módulos completó el alumno (necesario para certificados).

## Calidad de Código
- Manejar siempre los errores de Supabase explícitamente (ej. `if (error) throw new Error(...)`).
- Utilizar Server Actions en Next.js para realizar inserciones o actualizaciones (ej. procesar un pago o crear un blog) de forma segura en el servidor.