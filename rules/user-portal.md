# Skill: Portal de Usuarios y Carrito

## Estado y Carrito de Compras
- **Manejo de Estado:** Utilizar un estado global ligero (ej. Zustand o React Context) para el carrito, asegurando que el ícono del carrito se actualice instantáneamente sin recargar la página.
- **Seguridad en el Checkout:** Los cálculos de precios y totales NUNCA deben depender exclusivamente del cliente. Siempre validar el monto final a través de Next.js Server Actions antes de enviar a la pasarela de pagos.
- **Webhooks:** La activación de un servicio contratado debe ocurrir únicamente tras recibir y validar el webhook de pago exitoso de la pasarela, actualizando la tabla puente en Supabase.

## Experiencia del Usuario (Portal de Servicios)
- **Seguimiento de Proyectos:** Cada servicio contratado tiene una vista de progreso (timeline de estado) y un chat directo con el equipo, sin exponer información de otros usuarios.
- **Protección de Contenido:** Los archivos y entregables compartidos con el usuario no deben estar expuestos en URLs públicas. Utilizar Supabase Signed URLs (URLs firmadas con tiempo de expiración) para que solo el usuario autenticado pueda verlos o descargarlos.
- **Actualizaciones en Background:** Cambios de estado de un servicio (por ejemplo, marcar un paso como completado) deben reflejarse en la base de datos de forma silenciosa (optimistic UI) para no interrumpir la experiencia del usuario.

## Recursos y Facturación
- **Descargas:** Antes de servir un PDF o recurso de pago, el componente debe verificar contra Supabase si el `auth.uid()` tiene un registro válido en la tabla de compras para ese producto.
- **Facturas:** El usuario debe poder ver el historial de facturas de cada servicio contratado y descargar el comprobante en PDF.

## Integración de Pasarelas de Pago y Multi-Moneda
- **Lógica Multi-Moneda:** El frontend debe ser capaz de mostrar precios dinámicos. Si el usuario paga en moneda local, se prioriza Mercado Pago. Si es tráfico internacional (dólares), se habilitan las opciones de PayPal.
- **Botones de Checkout:** Los componentes de pago (`checkout`) deben renderizar condicionalmente el SDK o botón correspondiente (Mercado Pago Brick o PayPal Buttons) según la elección del usuario, manteniendo una UI limpia.
- **Webhooks Unificados:** El backend (Next.js Server Actions o Route Handlers) debe contar con un sistema robusto para recibir webhooks de Mercado Pago y PayPal.
- **Trazabilidad:** Al procesar un pago exitoso, la inserción en la tabla `facturas` de Supabase debe registrar qué pasarela se utilizó (ej. `proveedor_pago: 'mercadopago' | 'paypal'`) y el ID de transacción original para facilitar devoluciones o auditorías.
