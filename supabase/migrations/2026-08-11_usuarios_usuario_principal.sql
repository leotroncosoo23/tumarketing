-- Onboarding manual (sin API de Meta ni OAuth): el cliente escribe a mano el
-- @usuario de su cuenta principal la primera vez que entra al panel.
alter table usuarios add column if not exists usuario_principal text;
