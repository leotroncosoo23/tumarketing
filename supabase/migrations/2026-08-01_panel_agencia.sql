-- Migración para el nuevo Panel de Agencia (tema oscuro + lima).
-- Todo aditivo (IF NOT EXISTS), no borra ni modifica datos existentes.
-- Pegar y correr completo en el SQL Editor de Supabase.

-- 1. Blog: SEO + vistas + programación
alter table blogs add column if not exists vistas integer not null default 0;
alter table blogs add column if not exists meta_titulo text;
alter table blogs add column if not exists meta_descripcion text;
alter table blogs add column if not exists tags text;
alter table blogs add column if not exists fecha_programada timestamptz;

-- 2. Comentarios de blog: moderación (backfill a 'aprobado' para no ocultar histórico)
alter table comentarios_blog add column if not exists estado text not null default 'pendiente';
update comentarios_blog set estado = 'aprobado' where estado = 'pendiente';
alter table comentarios_blog drop constraint if exists comentarios_blog_estado_check;
alter table comentarios_blog add constraint comentarios_blog_estado_check check (estado in ('pendiente','aprobado'));

-- 3. Usuarios: estado de cuenta (manual en v1, no inferido de facturas vencidas)
alter table usuarios add column if not exists estado_cuenta text not null default 'activo';
alter table usuarios drop constraint if exists usuarios_estado_cuenta_check;
alter table usuarios add constraint usuarios_estado_cuenta_check check (estado_cuenta in ('activo','pausado','riesgo'));

-- 4. Usuarios: permitir rol 'editor' (equipo con permisos limitados).
--    Antes de correr esto, confirmá el nombre real del constraint con:
--      select conname from pg_constraint where conrelid = 'usuarios'::regclass;
--    Si el nombre difiere de "usuarios_rol_check", ajustalo en la línea de abajo.
alter table usuarios drop constraint if exists usuarios_rol_check;
alter table usuarios add constraint usuarios_rol_check check (rol in ('admin','usuario','editor'));

-- 5. Proyectos: progreso manual (0-100)
alter table servicios_contratados add column if not exists progreso integer not null default 0;
alter table servicios_contratados drop constraint if exists servicios_contratados_progreso_check;
alter table servicios_contratados add constraint servicios_contratados_progreso_check check (progreso between 0 and 100);

-- 6. Calendario: tipo de evento
alter table posts_calendario add column if not exists tipo text not null default 'Post';
alter table posts_calendario drop constraint if exists posts_calendario_tipo_check;
alter table posts_calendario add constraint posts_calendario_tipo_check check (tipo in ('Reunión','Entrega','Post','Reel'));

-- 7. Reportes/métricas: red de seguridad si no están migradas aún en producción
--    (el código del portal de cliente ya advertía que "reportes" podría no existir)
create table if not exists reportes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  tipo text,
  mes text,
  url_pdf text,
  servicio_contratado_id uuid not null references servicios_contratados(id),
  creado_en timestamptz not null default now()
);

create table if not exists metricas_redes (
  id uuid primary key default gen_random_uuid(),
  mes text not null,
  alcance_mensual integer,
  interacciones integer,
  conversiones integer,
  servicio_contratado_id uuid not null references servicios_contratados(id),
  unique (servicio_contratado_id, mes)
);
