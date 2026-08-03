-- La tabla "servicios" real tiene una columna "categoria" (singular, texto)
-- que quedó de una versión anterior de la app, de antes de que existiera
-- "categorias" (plural, array) que es la que usa todo el código actual
-- (panel de admin, /servicios, /servicios/[id]). No hay una sola referencia
-- a "categoria" singular en todo el repo para esta tabla — es una columna
-- muerta, pero como sigue siendo NOT NULL, cualquier alta nueva desde el
-- panel falla con "null value in column categoria violates not-null
-- constraint" porque el INSERT nunca la completa.
alter table servicios drop column if exists categoria;
