-- La tabla "mensajes_proyecto" (chat admin <-> cliente por proyecto) tampoco
-- existe en este proyecto de Supabase. Columnas tomadas de src/lib/mensajes.ts
-- y la lógica real de src/lib/mensajes-actions.ts (enviarMensaje/marcarMensajesLeidos).
-- La RLS de abajo implementa exactamente la regla que ya describía el comentario
-- de marcarMensajesLeidos: cada rol solo puede marcar como leídos los mensajes
-- del OTRO rol, dentro de su propio proyecto.

create table if not exists mensajes_proyecto (
  id uuid primary key default gen_random_uuid(),
  servicio_contratado_id uuid not null references servicios_contratados(id) on delete cascade,
  autor_id uuid not null references auth.users(id),
  autor_rol text not null check (autor_rol in ('admin', 'cliente')),
  texto text,
  archivo_nombre text,
  archivo_tipo text check (archivo_tipo in ('pdf', 'imagen', 'zip')),
  archivo_path text,
  leido boolean not null default false,
  creado_en timestamptz not null default now()
);

alter table mensajes_proyecto enable row level security;

-- Lectura: admin/editor ven todo; el cliente solo los mensajes de su propio proyecto.
drop policy if exists "mensajes_proyecto_lectura" on mensajes_proyecto;
create policy "mensajes_proyecto_lectura"
  on mensajes_proyecto for select
  using (
    exists (
      select 1 from usuarios
      where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')
    )
    or exists (
      select 1 from servicios_contratados sc
      where sc.id = mensajes_proyecto.servicio_contratado_id
        and sc.usuario_id = auth.uid()
    )
  );

-- Alta: cada uno solo puede publicar como sí mismo (autor_id = auth.uid()),
-- y el cliente solo dentro de su propio proyecto.
drop policy if exists "mensajes_proyecto_alta" on mensajes_proyecto;
create policy "mensajes_proyecto_alta"
  on mensajes_proyecto for insert
  with check (
    autor_id = auth.uid()
    and (
      (
        autor_rol = 'admin'
        and exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
      )
      or (
        autor_rol = 'cliente'
        and exists (
          select 1 from servicios_contratados sc
          where sc.id = mensajes_proyecto.servicio_contratado_id
            and sc.usuario_id = auth.uid()
        )
      )
    )
  );

-- Edición (marcar leído): admin/editor marcan mensajes de "cliente"; el cliente
-- marca mensajes de "admin" en su propio proyecto. Nunca los propios.
drop policy if exists "mensajes_proyecto_marcar_leido" on mensajes_proyecto;
create policy "mensajes_proyecto_marcar_leido"
  on mensajes_proyecto for update
  using (
    (
      autor_rol = 'cliente'
      and exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor'))
    )
    or (
      autor_rol = 'admin'
      and exists (
        select 1 from servicios_contratados sc
        where sc.id = mensajes_proyecto.servicio_contratado_id
          and sc.usuario_id = auth.uid()
      )
    )
  );

-- Sin esto, los canales realtime (badge de no leídos, chat en vivo) quedan
-- suscritos pero nunca reciben eventos. Envuelto en DO porque "ADD TABLE" no
-- admite IF NOT EXISTS y correr esta migración dos veces rompería con un error.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'mensajes_proyecto'
  ) then
    alter publication supabase_realtime add table mensajes_proyecto;
  end if;
end $$;
