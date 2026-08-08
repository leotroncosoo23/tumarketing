-- Ventas de infoproductos independientes (ej: "De Creador/a a Dueño/a"), que
-- no pasan por el carrito ni requieren cuenta de usuario — por eso viven en su
-- propia tabla, separada de "facturas" (que exige usuario_id not null,
-- pensado para clientes ya registrados en la plataforma).
create table if not exists ventas_infoproductos (
  id uuid primary key default gen_random_uuid()
);
alter table ventas_infoproductos add column if not exists producto text not null default 'de-creador-a-dueno';
alter table ventas_infoproductos add column if not exists nombre text not null;
alter table ventas_infoproductos add column if not exists email text not null;
alter table ventas_infoproductos add column if not exists telefono text;
alter table ventas_infoproductos add column if not exists monto_usd numeric not null;
alter table ventas_infoproductos add column if not exists estado text not null default 'pendiente';
alter table ventas_infoproductos add column if not exists paypal_order_id text;
alter table ventas_infoproductos add column if not exists creado_en timestamptz not null default now();

alter table ventas_infoproductos drop constraint if exists ventas_infoproductos_estado_check;
alter table ventas_infoproductos add constraint ventas_infoproductos_estado_check check (estado in ('pendiente', 'pagado'));
create unique index if not exists ventas_infoproductos_paypal_order_id_unico on ventas_infoproductos (paypal_order_id);

-- Sin policies públicas a propósito: se escribe siempre con el cliente admin
-- (service role) desde los Server Actions, nunca directo desde el navegador
-- del comprador (que ni siquiera tiene sesión en este flujo).
alter table ventas_infoproductos enable row level security;
drop policy if exists "ventas_infoproductos_lectura_admin" on ventas_infoproductos;
create policy "ventas_infoproductos_lectura_admin" on ventas_infoproductos for select
  using (exists (select 1 from usuarios where usuarios.id = auth.uid() and usuarios.rol in ('admin', 'editor')));
