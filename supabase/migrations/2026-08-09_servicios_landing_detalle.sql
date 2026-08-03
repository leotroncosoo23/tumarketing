-- Nueva landing de detalle de servicio: agrega a "servicios" lo necesario
-- para que el tagline, los beneficios ("Lo que ganás") y el tipo de pago se
-- carguen por servicio desde el panel de administración (no hardcodeados).

alter table servicios add column if not exists tagline text;
alter table servicios add column if not exists tipo_pago text not null default 'unico';
alter table servicios add column if not exists beneficios jsonb not null default '[]';

alter table servicios drop constraint if exists servicios_tipo_pago_check;
alter table servicios add constraint servicios_tipo_pago_check check (tipo_pago in ('unico', 'mensual'));
