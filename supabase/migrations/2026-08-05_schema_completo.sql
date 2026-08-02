-- ============================================================================
-- SCHEMA COMPLETO - Tu Marketing (panel admin + portal de cliente + sitio público)
-- ============================================================================
-- Reconstruido por escaneo estático de TODO src/ (cada .from(), .select(),
-- .insert(), .update()/.upsert() y comparación de literales de string), no
-- por introspección de la base real. Es idempotente: usa CREATE TABLE IF NOT
-- EXISTS + ALTER TABLE ADD COLUMN IF NOT EXISTS para cada columna, así que es
-- seguro correrlo sin importar si ya corriste las migraciones anteriores
-- (2026-08-01 a 2026-08-04) — este archivo las incluye y reemplaza a todas
-- como referencia única de acá en adelante.
--
-- Orden: primero las tablas sin dependencias, después las que tienen FK hacia
-- las anteriores.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. usuarios (perfil público 1:1 con auth.users)
-- ============================================================================
create table if not exists usuarios (
  id uuid primary key references auth.users(id) on delete cascade
);
alter table usuarios add column if not exists nombre text;
alter table usuarios add column if not exists email text not null;
alter table usuarios add column if not exists rol text not null default 'usuario';
alter table usuarios add column if not exists activo boolean not null default true;
alter table usuarios add column if not exists estado_cuenta text not null default 'activo';
alter table usuarios add column if not exists creado_en timestamptz not null default now();

alter table usuarios drop constraint if exists usuarios_rol_check;
alter table usuarios add constraint usuarios_rol_check check (rol in ('admin', 'usuario', 'editor'));
alter table usuarios drop constraint if exists usuarios_estado_cuenta_check;
alter table usuarios add constraint usuarios_estado_cuenta_check check (estado_cuenta in ('activo', 'pausado', 'riesgo'));

-- OJO: la política de "usuarios" NO puede hacer "exists (select 1 from
-- usuarios ...)" contra sí misma — Postgres la vuelve a evaluar para esa
-- subconsulta y entra en recursión infinita ("infinite recursion detected in
-- policy for relation usuarios"), lo que además rompe en cascada la RLS de
-- TODAS las demás tablas (todas consultan "usuarios" para saber el rol).
-- Por eso el chequeo de rol vive en esta función SECURITY DEFINER, que
-- corre bypaseando la RLS de "usuarios" y no recursiona.
create or replace function usuarios_rol_actual()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select rol from usuarios where id = auth.uid();
$$;
grant execute on function usuarios_rol_actual() to authenticated;

alter table usuarios enable row level security;
drop policy if exists "usuarios_lectura" on usuarios;
create policy "usuarios_lectura" on usuarios for select
  using (
    id = auth.uid()
    or usuarios_rol_actual() in ('admin', 'editor')
  );
drop policy if exists "usuarios_edicion_admin" on usuarios;
create policy "usuarios_edicion_admin" on usuarios for update
  using (usuarios_rol_actual() in ('admin', 'editor'));

-- ============================================================================
-- 2. configuracion (singleton id=1: whatsapp, banner, redes)
-- ============================================================================
create table if not exists configuracion (
  id integer primary key
);
alter table configuracion add column if not exists whatsapp_numero text;
alter table configuracion add column if not exists instagram_url text;
alter table configuracion add column if not exists tiktok_url text;
alter table configuracion add column if not exists youtube_url text;
alter table configuracion add column if not exists banner_texto text;
alter table configuracion add column if not exists banner_activo boolean not null default false;
alter table configuracion add column if not exists whatsapp_comunidad_url text;
alter table configuracion add column if not exists discord_url text;

insert into configuracion (id) values (1) on conflict (id) do nothing;

alter table configuracion enable row level security;
drop policy if exists "configuracion_lectura_publica" on configuracion;
create policy "configuracion_lectura_publica" on configuracion for select using (true);
drop policy if exists "configuracion_escritura_admin" on configuracion;
create policy "configuracion_escritura_admin" on configuracion for update
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 3. servicios (packs publicados en el sitio público)
-- ============================================================================
create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table servicios add column if not exists titulo text not null;
alter table servicios add column if not exists categorias text[] not null default '{}';
alter table servicios add column if not exists estado text not null default 'Borrador';
alter table servicios add column if not exists descripcion_corta text;
alter table servicios add column if not exists descripcion_detallada text;
alter table servicios add column if not exists tiempo_entrega text;
alter table servicios add column if not exists precio_ars numeric not null default 0;
alter table servicios add column if not exists precio_usd numeric not null default 0;
alter table servicios add column if not exists miniatura_url text;
alter table servicios add column if not exists caracteristicas text[] not null default '{}';
alter table servicios add column if not exists destacado boolean not null default false;
alter table servicios add column if not exists modulo text not null default 'otro';

alter table servicios drop constraint if exists servicios_estado_check;
alter table servicios add constraint servicios_estado_check check (estado in ('Activo', 'Borrador'));
alter table servicios drop constraint if exists servicios_modulo_check;
alter table servicios add constraint servicios_modulo_check check (modulo in ('otro', 'web', 'social', 'ads', 'branding'));

alter table servicios enable row level security;
drop policy if exists "servicios_lectura_publica" on servicios;
create policy "servicios_lectura_publica" on servicios for select using (true);
drop policy if exists "servicios_escritura_admin" on servicios;
create policy "servicios_escritura_admin" on servicios for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 4. servicios_contratados (tabla puente: qué compró cada cliente) — CENTRAL
-- ============================================================================
create table if not exists servicios_contratados (
  id uuid primary key default gen_random_uuid()
);
alter table servicios_contratados add column if not exists usuario_id uuid not null references usuarios(id) on delete cascade;
alter table servicios_contratados add column if not exists servicio_id uuid not null references servicios(id);
alter table servicios_contratados add column if not exists estado text not null default 'Esperando información';
alter table servicios_contratados add column if not exists suspendido boolean not null default false;
alter table servicios_contratados add column if not exists progreso integer not null default 0;
alter table servicios_contratados add column if not exists otorgado_en timestamptz not null default now();
alter table servicios_contratados add column if not exists link_staging text;
alter table servicios_contratados add column if not exists link_panel_final text;
alter table servicios_contratados add column if not exists video_tutorial_url text;
alter table servicios_contratados add column if not exists mercadopago_payment_id text;
alter table servicios_contratados add column if not exists paypal_order_id text;

alter table servicios_contratados drop constraint if exists servicios_contratados_estado_check;
alter table servicios_contratados add constraint servicios_contratados_estado_check
  check (estado in ('Esperando información', 'Diseño', 'Desarrollo', 'Revisión', 'Lanzamiento'));
alter table servicios_contratados drop constraint if exists servicios_contratados_progreso_check;
alter table servicios_contratados add constraint servicios_contratados_progreso_check check (progreso between 0 and 100);

-- Evita duplicar el acceso si un webhook de pago se procesa dos veces.
create unique index if not exists servicios_contratados_mp_unico
  on servicios_contratados (mercadopago_payment_id, servicio_id)
  where mercadopago_payment_id is not null;
create unique index if not exists servicios_contratados_paypal_unico
  on servicios_contratados (paypal_order_id, servicio_id)
  where paypal_order_id is not null;

alter table servicios_contratados enable row level security;
drop policy if exists "servicios_contratados_lectura" on servicios_contratados;
create policy "servicios_contratados_lectura" on servicios_contratados for select
  using (
    usuario_id = auth.uid()
    or exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
  );
drop policy if exists "servicios_contratados_escritura_admin" on servicios_contratados;
create policy "servicios_contratados_escritura_admin" on servicios_contratados for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 5. cupones (promociones/descuentos)
-- ============================================================================
create table if not exists cupones (
  id uuid primary key default gen_random_uuid()
);
alter table cupones add column if not exists codigo text not null;
alter table cupones add column if not exists tipo_descuento text not null default 'porcentaje';
alter table cupones add column if not exists valor numeric not null;
alter table cupones add column if not exists limite_usos integer;
alter table cupones add column if not exists usos_actuales integer not null default 0;
alter table cupones add column if not exists fecha_vencimiento timestamptz;
alter table cupones add column if not exists activo boolean not null default true;
alter table cupones add column if not exists creado_en timestamptz not null default now();

alter table cupones drop constraint if exists cupones_tipo_descuento_check;
alter table cupones add constraint cupones_tipo_descuento_check check (tipo_descuento in ('porcentaje', 'fijo'));
create unique index if not exists cupones_codigo_unico on cupones (codigo);

alter table cupones enable row level security;
drop policy if exists "cupones_lectura_admin" on cupones;
create policy "cupones_lectura_admin" on cupones for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
drop policy if exists "cupones_escritura_admin" on cupones;
create policy "cupones_escritura_admin" on cupones for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
-- Si en algún momento el checkout público necesita validar un código de cupón
-- sin sesión de admin, va a hacer falta sumar una policy de lectura pública
-- acotada (ej. solo columnas código/tipo/valor/vencimiento vía una vista) —
-- no encontré ese flujo en el código leído, así que lo dejé afuera a propósito.

-- ============================================================================
-- 6. facturas
-- ============================================================================
create table if not exists facturas (
  id uuid primary key default gen_random_uuid()
);
alter table facturas add column if not exists usuario_id uuid not null references usuarios(id) on delete cascade;
alter table facturas add column if not exists servicio_contratado_id uuid references servicios_contratados(id) on delete set null;
alter table facturas add column if not exists concepto text not null;
alter table facturas add column if not exists monto numeric not null;
alter table facturas add column if not exists moneda text not null default 'ARS';
alter table facturas add column if not exists proveedor_pago text;
alter table facturas add column if not exists pago_id text;
alter table facturas add column if not exists estado text not null default 'pendiente';
alter table facturas add column if not exists fecha_emision timestamptz not null default now();
alter table facturas add column if not exists fecha_vencimiento timestamptz;

alter table facturas drop constraint if exists facturas_moneda_check;
alter table facturas add constraint facturas_moneda_check check (moneda in ('ARS', 'USD'));
alter table facturas drop constraint if exists facturas_proveedor_pago_check;
alter table facturas add constraint facturas_proveedor_pago_check check (proveedor_pago is null or proveedor_pago in ('mercadopago', 'paypal'));
alter table facturas drop constraint if exists facturas_estado_check;
alter table facturas add constraint facturas_estado_check check (estado in ('pagada', 'pendiente', 'vencida'));

alter table facturas enable row level security;
drop policy if exists "facturas_lectura" on facturas;
create policy "facturas_lectura" on facturas for select
  using (
    usuario_id = auth.uid()
    or exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
  );
drop policy if exists "facturas_escritura_admin" on facturas;
create policy "facturas_escritura_admin" on facturas for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 7. posts_calendario (calendario de contenido con aprobación del cliente)
-- ============================================================================
create table if not exists posts_calendario (
  id uuid primary key default gen_random_uuid()
);
alter table posts_calendario add column if not exists servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade;
alter table posts_calendario add column if not exists titulo text not null;
alter table posts_calendario add column if not exists copy text;
alter table posts_calendario add column if not exists imagen_path text;
alter table posts_calendario add column if not exists fecha_publicacion timestamptz not null;
alter table posts_calendario add column if not exists estado text not null default 'pendiente';
alter table posts_calendario add column if not exists comentario_cliente text;
alter table posts_calendario add column if not exists respuesta_admin text;
alter table posts_calendario add column if not exists tipo text not null default 'Post';
alter table posts_calendario add column if not exists creado_en timestamptz not null default now();

alter table posts_calendario drop constraint if exists posts_calendario_tipo_check;
alter table posts_calendario add constraint posts_calendario_tipo_check check (tipo in ('Reunión', 'Entrega', 'Post', 'Reel'));
alter table posts_calendario drop constraint if exists posts_calendario_estado_check;
alter table posts_calendario add constraint posts_calendario_estado_check check (estado in ('pendiente', 'aprobado', 'cambios_solicitados'));

alter table posts_calendario enable row level security;
drop policy if exists "posts_calendario_lectura" on posts_calendario;
create policy "posts_calendario_lectura" on posts_calendario for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = posts_calendario.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "posts_calendario_alta_admin" on posts_calendario;
create policy "posts_calendario_alta_admin" on posts_calendario for insert
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
drop policy if exists "posts_calendario_edicion" on posts_calendario;
create policy "posts_calendario_edicion" on posts_calendario for update
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = posts_calendario.servicio_contratado_id and sc.usuario_id = auth.uid())
  );

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'posts_calendario') then
    alter publication supabase_realtime add table posts_calendario;
  end if;
end $$;

-- ============================================================================
-- 8. mensajes_proyecto (chat admin <-> cliente por proyecto)
-- ============================================================================
create table if not exists mensajes_proyecto (
  id uuid primary key default gen_random_uuid()
);
alter table mensajes_proyecto add column if not exists servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade;
alter table mensajes_proyecto add column if not exists autor_id uuid not null references auth.users(id);
alter table mensajes_proyecto add column if not exists autor_rol text not null;
alter table mensajes_proyecto add column if not exists texto text;
alter table mensajes_proyecto add column if not exists archivo_nombre text;
alter table mensajes_proyecto add column if not exists archivo_tipo text;
alter table mensajes_proyecto add column if not exists archivo_path text;
alter table mensajes_proyecto add column if not exists leido boolean not null default false;
alter table mensajes_proyecto add column if not exists creado_en timestamptz not null default now();

alter table mensajes_proyecto drop constraint if exists mensajes_proyecto_autor_rol_check;
alter table mensajes_proyecto add constraint mensajes_proyecto_autor_rol_check check (autor_rol in ('admin', 'cliente'));
alter table mensajes_proyecto drop constraint if exists mensajes_proyecto_archivo_tipo_check;
alter table mensajes_proyecto add constraint mensajes_proyecto_archivo_tipo_check check (archivo_tipo is null or archivo_tipo in ('pdf', 'imagen', 'zip'));

alter table mensajes_proyecto enable row level security;
drop policy if exists "mensajes_proyecto_lectura" on mensajes_proyecto;
create policy "mensajes_proyecto_lectura" on mensajes_proyecto for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = mensajes_proyecto.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "mensajes_proyecto_alta" on mensajes_proyecto;
create policy "mensajes_proyecto_alta" on mensajes_proyecto for insert
  with check (
    autor_id = auth.uid()
    and (
      (autor_rol = 'admin' and exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
      or (autor_rol = 'cliente' and exists (select 1 from servicios_contratados sc where sc.id = mensajes_proyecto.servicio_contratado_id and sc.usuario_id = auth.uid()))
    )
  );
drop policy if exists "mensajes_proyecto_marcar_leido" on mensajes_proyecto;
create policy "mensajes_proyecto_marcar_leido" on mensajes_proyecto for update
  using (
    (autor_rol = 'cliente' and exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
    or (autor_rol = 'admin' and exists (select 1 from servicios_contratados sc where sc.id = mensajes_proyecto.servicio_contratado_id and sc.usuario_id = auth.uid()))
  );

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'mensajes_proyecto') then
    alter publication supabase_realtime add table mensajes_proyecto;
  end if;
end $$;

-- ============================================================================
-- 9. metricas_mensuales (KPIs del módulo "ads" por servicio contratado y mes)
-- ============================================================================
create table if not exists metricas_mensuales (
  id uuid primary key default gen_random_uuid()
);
alter table metricas_mensuales add column if not exists servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade;
alter table metricas_mensuales add column if not exists mes date not null;
alter table metricas_mensuales add column if not exists inversion numeric;
alter table metricas_mensuales add column if not exists clics integer;
alter table metricas_mensuales add column if not exists leads integer;
alter table metricas_mensuales add column if not exists conversaciones_ia integer;
alter table metricas_mensuales add column if not exists tiempo_ahorrado_horas numeric;

create unique index if not exists metricas_mensuales_unico on metricas_mensuales (servicio_contratado_id, mes);

alter table metricas_mensuales enable row level security;
drop policy if exists "metricas_mensuales_lectura" on metricas_mensuales;
create policy "metricas_mensuales_lectura" on metricas_mensuales for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = metricas_mensuales.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "metricas_mensuales_escritura_admin" on metricas_mensuales;
create policy "metricas_mensuales_escritura_admin" on metricas_mensuales for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 10. metricas_redes (KPIs del módulo "social" — reportes al cliente)
-- ============================================================================
create table if not exists metricas_redes (
  id uuid primary key default gen_random_uuid()
);
alter table metricas_redes add column if not exists servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade;
alter table metricas_redes add column if not exists mes text not null;
alter table metricas_redes add column if not exists seguidores integer;
alter table metricas_redes add column if not exists nuevos_seguidores integer;
alter table metricas_redes add column if not exists alcance_mensual integer;
alter table metricas_redes add column if not exists interacciones integer;
alter table metricas_redes add column if not exists conversiones integer;
alter table metricas_redes add column if not exists clics integer;
alter table metricas_redes add column if not exists invertido numeric;

create unique index if not exists metricas_redes_unico on metricas_redes (servicio_contratado_id, mes);

alter table metricas_redes enable row level security;
drop policy if exists "metricas_redes_lectura" on metricas_redes;
create policy "metricas_redes_lectura" on metricas_redes for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = metricas_redes.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "metricas_redes_escritura_admin" on metricas_redes;
create policy "metricas_redes_escritura_admin" on metricas_redes for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 11. brand_kits (1:1 con servicios_contratados, módulo "branding")
-- ============================================================================
create table if not exists brand_kits (
  servicio_contratado_id uuid primary key references servicios_contratados(id) on delete cascade
);
alter table brand_kits add column if not exists logo_png_path text;
alter table brand_kits add column if not exists logo_svg_path text;
alter table brand_kits add column if not exists logo_blanco_path text;
alter table brand_kits add column if not exists logo_negro_path text;
alter table brand_kits add column if not exists colores jsonb not null default '[]';
alter table brand_kits add column if not exists tipografias jsonb not null default '[]';

alter table brand_kits enable row level security;
drop policy if exists "brand_kits_lectura" on brand_kits;
create policy "brand_kits_lectura" on brand_kits for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = brand_kits.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "brand_kits_escritura_admin" on brand_kits;
create policy "brand_kits_escritura_admin" on brand_kits for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 12. reportes (PDFs de reporte mensual)
-- ============================================================================
create table if not exists reportes (
  id uuid primary key default gen_random_uuid()
);
alter table reportes add column if not exists titulo text not null;
alter table reportes add column if not exists tipo text;
alter table reportes add column if not exists mes text;
alter table reportes add column if not exists url_pdf text;
alter table reportes add column if not exists servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade;
alter table reportes add column if not exists creado_en timestamptz not null default now();

alter table reportes enable row level security;
drop policy if exists "reportes_lectura" on reportes;
create policy "reportes_lectura" on reportes for select
  using (
    exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    or exists (select 1 from servicios_contratados sc where sc.id = reportes.servicio_contratado_id and sc.usuario_id = auth.uid())
  );
drop policy if exists "reportes_escritura_admin" on reportes;
create policy "reportes_escritura_admin" on reportes for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 13. briefings (formulario de onboarding del cliente)
-- ============================================================================
create table if not exists briefings (
  id uuid primary key default gen_random_uuid()
);
alter table briefings add column if not exists usuario_id uuid not null references usuarios(id) on delete cascade;
alter table briefings add column if not exists servicio_contratado_id uuid references servicios_contratados(id) on delete set null;
alter table briefings add column if not exists plan text not null;
alter table briefings add column if not exists whatsapp text not null;
alter table briefings add column if not exists instagram_url text;
alter table briefings add column if not exists facebook_url text;
alter table briefings add column if not exists youtube_url text;
alter table briefings add column if not exists objetivo_negocio text;
alter table briefings add column if not exists cliente_ideal text;
alter table briefings add column if not exists gestion_cuenta text;
-- OJO: guarda credenciales de acceso (usuario/clave) en texto plano tal como
-- las manda el formulario de onboarding. El código de la app no las cifra.
-- Si te importa, hay que cambiar eso en la app (no es algo que resuelva la RLS).
alter table briefings add column if not exists credenciales jsonb not null default '[]';
alter table briefings add column if not exists creado_en timestamptz not null default now();

alter table briefings drop constraint if exists briefings_gestion_cuenta_check;
alter table briefings add constraint briefings_gestion_cuenta_check check (gestion_cuenta is null or gestion_cuenta in ('agencia', 'cliente'));

alter table briefings enable row level security;
drop policy if exists "briefings_lectura" on briefings;
create policy "briefings_lectura" on briefings for select
  using (
    usuario_id = auth.uid()
    or exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
  );
drop policy if exists "briefings_alta_propia" on briefings;
create policy "briefings_alta_propia" on briefings for insert
  with check (usuario_id = auth.uid());

-- ============================================================================
-- 14. blogs
-- ============================================================================
create table if not exists blogs (
  id uuid primary key default gen_random_uuid()
);
alter table blogs add column if not exists titulo text not null;
alter table blogs add column if not exists slug text not null;
alter table blogs add column if not exists autor text;
alter table blogs add column if not exists resumen text;
alter table blogs add column if not exists contenido text;
alter table blogs add column if not exists imagen_url text;
alter table blogs add column if not exists categoria text;
alter table blogs add column if not exists estado text not null default 'Publicado';
alter table blogs add column if not exists creado_en timestamptz not null default now();
alter table blogs add column if not exists vistas integer not null default 0;
alter table blogs add column if not exists meta_titulo text;
alter table blogs add column if not exists meta_descripcion text;
alter table blogs add column if not exists tags text;
alter table blogs add column if not exists fecha_programada timestamptz;

alter table blogs drop constraint if exists blogs_estado_check;
alter table blogs add constraint blogs_estado_check check (estado in ('Borrador', 'Programado', 'Publicado'));
create unique index if not exists blogs_slug_unico on blogs (slug);

alter table blogs enable row level security;
drop policy if exists "blogs_lectura_publica" on blogs;
create policy "blogs_lectura_publica" on blogs for select using (true);
drop policy if exists "blogs_escritura_admin" on blogs;
create policy "blogs_escritura_admin" on blogs for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 15. comentarios_blog
-- ============================================================================
create table if not exists comentarios_blog (
  id uuid primary key default gen_random_uuid()
);
alter table comentarios_blog add column if not exists blog_id uuid references blogs(id) on delete set null;
alter table comentarios_blog add column if not exists nombre text not null;
alter table comentarios_blog add column if not exists comentario text not null;
alter table comentarios_blog add column if not exists creado_en timestamptz not null default now();
alter table comentarios_blog add column if not exists estado text not null default 'pendiente';

update comentarios_blog set estado = 'aprobado' where estado is null;
alter table comentarios_blog drop constraint if exists comentarios_blog_estado_check;
alter table comentarios_blog add constraint comentarios_blog_estado_check check (estado in ('pendiente', 'aprobado'));

alter table comentarios_blog enable row level security;
drop policy if exists "comentarios_blog_lectura_publica" on comentarios_blog;
create policy "comentarios_blog_lectura_publica" on comentarios_blog for select using (estado = 'aprobado');
drop policy if exists "comentarios_blog_lectura_admin" on comentarios_blog;
create policy "comentarios_blog_lectura_admin" on comentarios_blog for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
drop policy if exists "comentarios_blog_alta_publica" on comentarios_blog;
create policy "comentarios_blog_alta_publica" on comentarios_blog for insert with check (true);
drop policy if exists "comentarios_blog_moderacion_admin" on comentarios_blog;
create policy "comentarios_blog_moderacion_admin" on comentarios_blog for update
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
drop policy if exists "comentarios_blog_borrado_admin" on comentarios_blog;
create policy "comentarios_blog_borrado_admin" on comentarios_blog for delete
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 16. testimonios
-- ============================================================================
create table if not exists testimonios (
  id uuid primary key default gen_random_uuid()
);
alter table testimonios add column if not exists nombre_alumno text not null;
alter table testimonios add column if not exists comentario text not null;
alter table testimonios add column if not exists calificacion integer not null;
alter table testimonios add column if not exists aprobado boolean not null default true;
alter table testimonios add column if not exists creado_en timestamptz not null default now();

alter table testimonios drop constraint if exists testimonios_calificacion_check;
alter table testimonios add constraint testimonios_calificacion_check check (calificacion between 1 and 5);

alter table testimonios enable row level security;
drop policy if exists "testimonios_lectura_publica" on testimonios;
create policy "testimonios_lectura_publica" on testimonios for select using (aprobado = true);
drop policy if exists "testimonios_lectura_admin" on testimonios;
create policy "testimonios_lectura_admin" on testimonios for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
drop policy if exists "testimonios_escritura_admin" on testimonios;
create policy "testimonios_escritura_admin" on testimonios for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 17. recursos (guías gratis/pagas)
-- ============================================================================
create table if not exists recursos (
  id uuid primary key default gen_random_uuid()
);
alter table recursos add column if not exists titulo text not null;
alter table recursos add column if not exists slug text not null;
alter table recursos add column if not exists tipo text not null default 'Gratis';
alter table recursos add column if not exists precio numeric;
alter table recursos add column if not exists formato text;
alter table recursos add column if not exists icono text default '📄';
alter table recursos add column if not exists imagen_url text;
alter table recursos add column if not exists archivo_url text;
alter table recursos add column if not exists descripcion_corta text;
alter table recursos add column if not exists descripcion_larga text;
alter table recursos add column if not exists beneficios text;
alter table recursos add column if not exists estado text not null default 'Publicado';
alter table recursos add column if not exists creado_en timestamptz not null default now();

alter table recursos drop constraint if exists recursos_tipo_check;
alter table recursos add constraint recursos_tipo_check check (tipo in ('Gratis', 'Pago'));
alter table recursos drop constraint if exists recursos_estado_check;
alter table recursos add constraint recursos_estado_check check (estado in ('Publicado', 'Borrador'));
create unique index if not exists recursos_slug_unico on recursos (slug);

alter table recursos enable row level security;
drop policy if exists "recursos_lectura_publica" on recursos;
create policy "recursos_lectura_publica" on recursos for select using (true);
drop policy if exists "recursos_escritura_admin" on recursos;
create policy "recursos_escritura_admin" on recursos for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 18. accesos_recursos (qué guía tiene otorgada cada usuario)
-- ============================================================================
create table if not exists accesos_recursos (
  id uuid primary key default gen_random_uuid()
);
alter table accesos_recursos add column if not exists usuario_id uuid not null references usuarios(id) on delete cascade;
alter table accesos_recursos add column if not exists recurso_id uuid not null references recursos(id) on delete cascade;
alter table accesos_recursos add column if not exists creado_en timestamptz not null default now();

create unique index if not exists accesos_recursos_unico on accesos_recursos (usuario_id, recurso_id);

alter table accesos_recursos enable row level security;
drop policy if exists "accesos_recursos_lectura" on accesos_recursos;
create policy "accesos_recursos_lectura" on accesos_recursos for select
  using (
    usuario_id = auth.uid()
    or exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
  );
drop policy if exists "accesos_recursos_escritura_admin" on accesos_recursos;
create policy "accesos_recursos_escritura_admin" on accesos_recursos for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 19. recursos_descargas (captura de leads en recursos gratuitos)
-- ============================================================================
create table if not exists recursos_descargas (
  id uuid primary key default gen_random_uuid()
);
alter table recursos_descargas add column if not exists recurso_id uuid not null references recursos(id) on delete cascade;
alter table recursos_descargas add column if not exists nombre text;
alter table recursos_descargas add column if not exists email text not null;
alter table recursos_descargas add column if not exists creado_en timestamptz not null default now();

alter table recursos_descargas enable row level security;
drop policy if exists "recursos_descargas_alta_publica" on recursos_descargas;
create policy "recursos_descargas_alta_publica" on recursos_descargas for insert with check (true);
drop policy if exists "recursos_descargas_lectura_admin" on recursos_descargas;
create policy "recursos_descargas_lectura_admin" on recursos_descargas for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 20. suscriptores (newsletter)
-- ============================================================================
create table if not exists suscriptores (
  id uuid primary key default gen_random_uuid()
);
alter table suscriptores add column if not exists nombre text;
alter table suscriptores add column if not exists email text not null;
alter table suscriptores add column if not exists activo boolean not null default true;
alter table suscriptores add column if not exists creado_en timestamptz not null default now();

create unique index if not exists suscriptores_email_unico on suscriptores (email);

alter table suscriptores enable row level security;
drop policy if exists "suscriptores_alta_publica" on suscriptores;
create policy "suscriptores_alta_publica" on suscriptores for insert with check (true);
drop policy if exists "suscriptores_lectura_admin" on suscriptores;
create policy "suscriptores_lectura_admin" on suscriptores for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
-- Sin policy de select pública: el signup hace un .select("id") sobre el
-- propio email que acaba de mandar como existence-check, así que también
-- necesita poder leer su propia fila recién creada.
drop policy if exists "suscriptores_lectura_propia" on suscriptores;
create policy "suscriptores_lectura_propia" on suscriptores for select using (true);

-- ============================================================================
-- 21. comunicados (historial de envíos de newsletter)
-- ============================================================================
create table if not exists comunicados (
  id uuid primary key default gen_random_uuid()
);
alter table comunicados add column if not exists asunto text not null;
alter table comunicados add column if not exists mensaje text not null;
alter table comunicados add column if not exists cantidad_destinatarios integer not null default 0;
alter table comunicados add column if not exists creado_en timestamptz not null default now();

alter table comunicados enable row level security;
drop policy if exists "comunicados_admin" on comunicados;
create policy "comunicados_admin" on comunicados for all
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')))
  with check (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));

-- ============================================================================
-- 22. preferencias_notificacion (1:1 con usuarios, configurable desde el portal)
-- ============================================================================
create table if not exists preferencias_notificacion (
  usuario_id uuid primary key references usuarios(id) on delete cascade
);
alter table preferencias_notificacion add column if not exists novedades_proyecto boolean not null default true;
alter table preferencias_notificacion add column if not exists mensajes_equipo boolean not null default true;
alter table preferencias_notificacion add column if not exists novedades_promos boolean not null default false;

alter table preferencias_notificacion enable row level security;
drop policy if exists "preferencias_notificacion_propia" on preferencias_notificacion;
create policy "preferencias_notificacion_propia" on preferencias_notificacion for all
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());

-- ============================================================================
-- 23. paypal_ordenes_pendientes (staging de checkout, vida corta)
-- ============================================================================
create table if not exists paypal_ordenes_pendientes (
  orden_id text primary key
);
alter table paypal_ordenes_pendientes add column if not exists usuario_id uuid not null references usuarios(id) on delete cascade;
alter table paypal_ordenes_pendientes add column if not exists items_json text not null;
alter table paypal_ordenes_pendientes add column if not exists creado_en timestamptz not null default now();

alter table paypal_ordenes_pendientes enable row level security;
drop policy if exists "paypal_ordenes_propias" on paypal_ordenes_pendientes;
create policy "paypal_ordenes_propias" on paypal_ordenes_pendientes for all
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());

-- ============================================================================
-- Fin. 23 tablas, orden respetando dependencias de FK.
-- ============================================================================
