-- FIX URGENTE: "infinite recursion detected in policy for relation usuarios"
--
-- Causa: las políticas "usuarios_lectura"/"usuarios_edicion_admin" (creadas en
-- 2026-08-05_schema_completo.sql) consultan la propia tabla "usuarios" desde
-- adentro de su propia política:
--   using (id = auth.uid() or exists (select 1 from usuarios u where ...))
-- Postgres, para evaluar esa política sobre una fila, necesita evaluar el
-- exists(), que a su vez dispara la MISMA política sobre "usuarios" de nuevo,
-- para siempre. Como el resto de las tablas (facturas, servicios_contratados,
-- posts_calendario, etc.) también consultan "usuarios" para saber si sos
-- admin/editor, esa recursión rota tumbaba en cascada la RLS de todo el
-- sistema — por eso el login se cortaba justo al leer el perfil.
--
-- Fix estándar de Postgres/Supabase: mover el chequeo de rol a una función
-- SECURITY DEFINER. Al correr con los privilegios de quien la creó (vos,
-- en el SQL Editor, con permisos de owner) esa consulta interna no vuelve a
-- disparar la política de "usuarios", así que no hay recursión.

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

drop policy if exists "usuarios_lectura" on usuarios;
create policy "usuarios_lectura" on usuarios for select
  using (
    id = auth.uid()
    or usuarios_rol_actual() in ('admin', 'editor')
  );

drop policy if exists "usuarios_edicion_admin" on usuarios;
create policy "usuarios_edicion_admin" on usuarios for update
  using (usuarios_rol_actual() in ('admin', 'editor'));

-- No hace falta tocar ninguna política de las otras 22 tablas: todas
-- consultan "usuarios" con un exists() normal (no recursivo en sí mismo),
-- así que una vez que la política DE "usuarios" deja de recursionar, esas
-- consultas vuelven a funcionar solas.
