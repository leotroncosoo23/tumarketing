// Fuente única de verdad para todos los precios de "De Creador/a a Dueño/a":
// landing, checkout y el monto real que se cobra en PayPal (infoproducto-checkout.ts)
// importan todos de acá. Antes estaban duplicados en 3 lugares distintos —
// cambiar un precio significaba acordarse de tocar los 3, con riesgo real de
// que quedaran desincronizados (la landing mostrando un valor y cobrando otro).

export const VALOR_SISTEMA = 37;

export const BONOS = [
  {
    numero: "01",
    titulo: "Guía de métricas",
    descripcion: "Dejá de publicar a ciegas: aprendé a leer tus números y saber exactamente qué está funcionando.",
    imagen: "/promptlistos.png",
    valor: 9,
  },
  {
    numero: "02",
    titulo: "Optimización de perfil nivel PRO",
    descripcion: "Todo lo que necesitás para que, apenas alguien entre a tu perfil, quiera comprarte.",
    imagen: "/optimizacion-de-perfil.png",
    valor: 15,
  },
  {
    numero: "03",
    titulo: "Cierre de ventas por mensaje",
    descripcion: "La próxima vez que te escriban, vas a saber exactamente qué responder para cerrar la venta.",
    imagen: "/cerrar-ventas.png",
    valor: 12,
  },
  {
    numero: "04",
    titulo: 'Ebook "Pensar como dueño/a de Negocio"',
    descripcion: "Una mirada más profunda sobre mentalidad, decisiones y estructura para escalar y empezar a delegar.",
    imagen: "/pensa-como-dueño.png",
    valor: 10,
  },
];

export const VALOR_TOTAL = VALOR_SISTEMA + BONOS.reduce((acc, b) => acc + b.valor, 0);

export const PRECIO_LANZAMIENTO = 16;
// Coincide a propósito con VALOR_TOTAL: el "precio de después" es el valor
// real de todo lo que se lleva (sistema + bonos), no un número aparte que
// pueda quedar desalineado del desglose que se muestra arriba en la oferta.
export const PRECIO_REGULAR = VALOR_TOTAL;
