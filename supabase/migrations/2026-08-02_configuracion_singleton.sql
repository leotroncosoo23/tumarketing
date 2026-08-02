-- Tabla "configuracion" (singleton, fila única id=1): whatsapp flotante, banner
-- de anuncio y redes sociales. La consumen componentes públicos (WhatsAppFloat,
-- AnuncioBanner, CTAContacto, LandingCTA, ContratarServicioButton, /recursos/[slug])
-- y se edita desde Configuración > Agencia en el panel. No es parte del rediseño
-- del panel: existía antes, esto solo la crea si en este proyecto de Supabase
-- todavía no existe (PGRST205 "table not found in schema cache").

create table if not exists configuracion (
  id integer primary key,
  whatsapp_numero text,
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  banner_texto text,
  banner_activo boolean not null default false,
  whatsapp_comunidad_url text,
  discord_url text
);

insert into configuracion (id)
values (1)
on conflict (id) do nothing;

alter table configuracion enable row level security;

drop policy if exists "configuracion_lectura_publica" on configuracion;
create policy "configuracion_lectura_publica"
  on configuracion for select
  using (true);

drop policy if exists "configuracion_escritura_admin" on configuracion;
create policy "configuracion_escritura_admin"
  on configuracion for update
  using (
    exists (
      select 1 from usuarios
      where usuarios.id = auth.uid()
        and usuarios.rol in ('admin', 'editor')
    )
  );
