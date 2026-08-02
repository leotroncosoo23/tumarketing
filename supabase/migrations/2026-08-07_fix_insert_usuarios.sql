-- FIX: falta la política de INSERT en "usuarios".
--
-- 2026-08-05_schema_completo.sql le agregó RLS a "usuarios" con política de
-- lectura y de edición, pero nunca una de alta. Con RLS activada, cualquier
-- operación sin una política que la cubra se rechaza por default — así que
-- crearPerfilUsuario() (src/lib/usuarios.ts), que inserta la fila del usuario
-- después de aceptar términos en /auth/bienvenida (tanto para alta con Google
-- como con email+contraseña), nunca podía escribir.

drop policy if exists "usuarios_alta_propia" on usuarios;
create policy "usuarios_alta_propia" on usuarios for insert
  with check (id = auth.uid());
