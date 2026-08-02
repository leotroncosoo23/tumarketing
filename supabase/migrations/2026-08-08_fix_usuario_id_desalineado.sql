-- FIX puntual: la fila de "usuarios" para troncosoleojob@gmail.com quedó con
-- un id distinto al de su usuario real en auth.users (76e3510a... vs
-- 3549c52a...). No se puede actualizar "usuarios.id" en caliente porque otras
-- tablas ya tienen filas que apuntan al id viejo (acá lo confirmamos con
-- servicios_contratados, puede haber más).
--
-- Paso 1: le agregamos ON UPDATE CASCADE a cada FK hacia usuarios(id) que
-- pueda estar involucrada — así, cuando actualicemos usuarios.id en el paso 2,
-- Postgres actualiza solo el usuario_id en todas las tablas relacionadas.
-- Envuelto en chequeos de to_regclass() por si alguna de estas tablas
-- todavía no existe en tu proyecto.

do $$
begin
  if to_regclass('public.servicios_contratados') is not null then
    alter table servicios_contratados drop constraint if exists servicios_contratados_usuario_id_fkey;
    alter table servicios_contratados add constraint servicios_contratados_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;

  if to_regclass('public.facturas') is not null then
    alter table facturas drop constraint if exists facturas_usuario_id_fkey;
    alter table facturas add constraint facturas_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;

  if to_regclass('public.accesos_recursos') is not null then
    alter table accesos_recursos drop constraint if exists accesos_recursos_usuario_id_fkey;
    alter table accesos_recursos add constraint accesos_recursos_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;

  if to_regclass('public.briefings') is not null then
    alter table briefings drop constraint if exists briefings_usuario_id_fkey;
    alter table briefings add constraint briefings_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;

  if to_regclass('public.preferencias_notificacion') is not null then
    alter table preferencias_notificacion drop constraint if exists preferencias_notificacion_usuario_id_fkey;
    alter table preferencias_notificacion add constraint preferencias_notificacion_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;

  if to_regclass('public.paypal_ordenes_pendientes') is not null then
    alter table paypal_ordenes_pendientes drop constraint if exists paypal_ordenes_pendientes_usuario_id_fkey;
    alter table paypal_ordenes_pendientes add constraint paypal_ordenes_pendientes_usuario_id_fkey
      foreign key (usuario_id) references usuarios(id) on delete cascade on update cascade;
  end if;
end $$;

-- Paso 2: ahora sí, alinear el id con el de auth.users. Cascadea solo a las
-- tablas de arriba, que ya quedaron con ON UPDATE CASCADE.
update usuarios
set id = '3549c52a-c9ac-4b2c-a7c8-245a1e1703f0'
where email = 'troncosoleojob@gmail.com';
