-- La tabla "posts_calendario" nunca se creó en este proyecto de Supabase.
-- La migración 2026-08-01_panel_agencia.sql ya la altera (agrega "tipo"),
-- pero asumía que la tabla ya existía. Este script la crea desde cero con
-- todas las columnas que el código realmente usa:
--   - Calendario del panel admin (dashboard-queries.ts: getEventosCalendario)
--   - Detalle de cliente (ClientesSection.tsx: "próxima entrega")
--   - Gestión del módulo "social" (GestionModuloPanel.tsx: alta/respuesta de posts)
--   - Aprobación del cliente en el portal (posts-actions.ts, ModuloProyecto.tsx)
-- Si ya corriste 2026-08-01_panel_agencia.sql antes que esta, no pasa nada:
-- sus ALTER TABLE son "IF NOT EXISTS" / redefinen el mismo constraint.

create table if not exists posts_calendario (
  id uuid primary key default gen_random_uuid(),
  servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade,
  titulo text not null,
  copy text,
  imagen_path text,
  fecha_publicacion timestamptz not null,
  estado text not null default 'pendiente',
  comentario_cliente text,
  respuesta_admin text,
  tipo text not null default 'Post',
  creado_en timestamptz not null default now()
);

alter table posts_calendario drop constraint if exists posts_calendario_tipo_check;
alter table posts_calendario add constraint posts_calendario_tipo_check
  check (tipo in ('Reunión','Entrega','Post','Reel'));

alter table posts_calendario enable row level security;

-- Lectura: el dueño del proyecto (cliente) o cualquier admin/editor.
drop policy if exists "posts_calendario_lectura" on posts_calendario;
create policy "posts_calendario_lectura"
  on posts_calendario for select
  using (
    exists (
      select 1 from servicios_contratados sc
      where sc.id = posts_calendario.servicio_contratado_id
        and sc.usuario_id = auth.uid()
    )
    or exists (
      select 1 from usuarios
      where usuarios.id = auth.uid()
        and usuarios.rol in ('admin', 'editor')
    )
  );

-- Alta: solo admin/editor programan posts nuevos.
drop policy if exists "posts_calendario_alta_admin" on posts_calendario;
create policy "posts_calendario_alta_admin"
  on posts_calendario for insert
  with check (
    exists (
      select 1 from usuarios
      where usuarios.id = auth.uid()
        and usuarios.rol in ('admin', 'editor')
    )
  );

-- Edición: admin/editor (responder, reprogramar) o el dueño del proyecto
-- (aprobar / pedir cambios desde el portal).
drop policy if exists "posts_calendario_edicion" on posts_calendario;
create policy "posts_calendario_edicion"
  on posts_calendario for update
  using (
    exists (
      select 1 from servicios_contratados sc
      where sc.id = posts_calendario.servicio_contratado_id
        and sc.usuario_id = auth.uid()
    )
    or exists (
      select 1 from usuarios
      where usuarios.id = auth.uid()
        and usuarios.rol in ('admin', 'editor')
    )
  );
