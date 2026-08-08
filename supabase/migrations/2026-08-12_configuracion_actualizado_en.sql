-- ConfiguracionSection.tsx ya guarda "actualizado_en" al hacer submit del
-- formulario de Agencia, pero la columna nunca se creó en la tabla real
-- "configuracion" — de ahí el error "Could not find the 'actualizado_en'
-- column" al intentar guardar (por ejemplo, al cargar el número de WhatsApp).
alter table configuracion add column if not exists actualizado_en timestamptz;
