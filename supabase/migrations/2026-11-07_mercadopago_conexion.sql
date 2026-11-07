-- Conexión OAuth con la cuenta de Mercado Pago que cobra (fila única id=1).
-- La dueña de la cuenta autoriza una sola vez desde un link que genera el
-- panel (Configuración > Pagos) y acá queda guardado el token con el que el
-- sitio crea los cobros a su nombre. El token se renueva solo antes de vencer
-- (ver src/lib/mercadopago-oauth.ts).

create table if not exists mercadopago_conexion (
  id integer primary key default 1 check (id = 1),
  mp_user_id text not null,
  mp_nickname text,
  mp_email text,
  access_token text not null,
  refresh_token text not null,
  public_key text,
  live_mode boolean not null default true,
  expira_en timestamptz not null,
  conectado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Sin policies a propósito: contiene credenciales, así que nadie la puede leer
-- ni escribir desde el navegador (ni siquiera un admin). Solo el servidor, con
-- la service role key. El panel consulta el estado mediante un Server Action
-- que nunca devuelve los tokens.
alter table mercadopago_conexion enable row level security;
