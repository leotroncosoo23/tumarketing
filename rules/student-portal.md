# Skill: Portal de Alumnos, Carrito y LMS (Learning Management System)

## Estado y Carrito de Compras
- **Manejo de Estado:** Utilizar un estado global ligero (ej. Zustand o React Context) para el carrito, asegurando que el ícono del carrito se actualice instantáneamente sin recargar la página.
- **Seguridad en el Checkout:** Los cálculos de precios y totales NUNCA deben depender exclusivamente del cliente. Siempre validar el monto final a través de Next.js Server Actions antes de enviar a la pasarela de pagos.
- **Webhooks:** La habilitación de cursos o guías debe ocurrir únicamente tras recibir y validar el webhook de pago exitoso de la pasarela, actualizando la tabla puente en Supabase.

## Experiencia del Alumno (Visualizador de Cursos)
- **Interfaz Cero Distracciones:** El layout para ver las clases debe diferenciarse del resto de la web. Ocultar el navbar promocional y mostrar un reproductor de video optimizado con un temario lateral (sidebar).
- **Protección de Contenido:** Los videos y materiales premium no deben estar expuestos en URLs públicas. Utilizar Supabase Signed URLs (URLs firmadas con tiempo de expiración) para que solo el alumno autenticado pueda verlos o descargarlos.
- **Progreso en Background:** Cuando un alumno marca una clase como "completada", la actualización en la base de datos de Supabase debe hacerse de forma silenciosa (optimistic UI) para no interrumpir su experiencia de visualización.

## Recursos y Certificaciones
- **Descargas:** Antes de servir un PDF o recurso de pago, el componente debe verificar contra Supabase si el `auth.uid()` tiene un registro válido en la tabla de compras para ese producto.
- **Certificados:** El componente o botón para generar el certificado de finalización debe permanecer bloqueado o invisible hasta que el progreso del alumno en la base de datos alcance el 100% para ese curso específico.

## Integración de Pasarelas de Pago y Multi-Moneda
- **Lógica Multi-Moneda:** El frontend debe ser capaz de mostrar precios dinámicos. Si el usuario paga en moneda local, se prioriza Mercado Pago. Si es tráfico internacional (dólares), se habilitan las opciones de Stripe y PayPal.
- **Botones de Checkout:** Los componentes de pago (`checkout`) deben renderizar condicionalmente el SDK o botón correspondiente (Mercado Pago Brick, Stripe Elements o PayPal Buttons) según la elección del usuario, manteniendo una UI limpia.
- **Webhooks Unificados:** El backend (Next.js Server Actions o Route Handlers) debe contar con un sistema robusto para recibir webhooks de Mercado Pago, Stripe y PayPal. 
- **Trazabilidad:** Al procesar un pago exitoso, la inserción en la tabla `compras` de Supabase debe registrar qué pasarela se utilizó (ej. `proveedor_pago: 'mercadopago' | 'stripe' | 'paypal'`) y el ID de transacción original para facilitar devoluciones o auditorías.