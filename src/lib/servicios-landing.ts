import {
  MessageCircleHeart,
  Megaphone,
  Code2,
  CalendarDays,
  Phone,
  FileText,
  Rocket,
  type LucideIcon,
} from "lucide-react";

// Fuente única de los 3 servicios que vende la agencia (CM, Pauta y Web & Apps).
// Alimenta la home, /servicios, cada landing (/servicios/<slug>), el menú y /links.
// El color de cada servicio sigue la paleta de la marca: rosa = redes,
// violeta = pauta, azul = web/software.

// Calendario de la asesoría 1:1 de 15 min (se embebe con CalendarioInline).
export const CAL_LINK = "natasha-hqosbf/15min";

export type ServicioSlug = "community-manager" | "publicidad" | "paginas-web";

export type ServicioLanding = {
  slug: ServicioSlug;
  href: string;
  icon: LucideIcon;
  /** Color hex del servicio; se pasa como variable CSS --acc. */
  acento: string;
  categoria: string;
  nombre: string;
  corto: string;
  ideal: string;
  prueba?: { numero: string; etiqueta: string };
  titular: string;
  bajada: string;
  dolores: string[];
  incluye: string[];
  resultados: string[];
  plataformas: string[];
  faq: { pregunta: string; respuesta: string }[];
};

export const SERVICIOS_LANDING: ServicioLanding[] = [
  {
    slug: "community-manager",
    href: "/servicios/community-manager",
    icon: MessageCircleHeart,
    acento: "#ff4fd8",
    categoria: "Redes sociales",
    nombre: "Community Management",
    corto: "Gestionamos tus redes de punta a punta: estrategia, contenido, publicación y comunidad.",
    ideal: "Querés crecer en redes y vender más sin pasarte el día pensando qué publicar.",
    prueba: { numero: "+488%", etiqueta: "cuentas alcanzadas · Camping y Motorhome" },
    titular: "Tus redes trabajando para vender, no solo para estar.",
    bajada:
      "Planificamos, creamos y publicamos por vos. Vos te enfocás en tu negocio; nosotras en que cada publicación sume alcance, seguidores, consultas y ventas.",
    dolores: [
      "Publicás cuando podés y sin estrategia clara.",
      "Tenés seguidores pero no se convierten en clientes.",
      "Tu perfil no transmite lo que vale tu marca.",
    ],
    incluye: [
      "Estrategia mensual según tus objetivos",
      "Calendario de contenido y copy de cada publicación",
      "Reels, historias y carruseles (guion, grabación y edición)",
      "Diseño de feed coherente con tu marca",
      "Optimización de perfil: bio, destacadas y link",
      "Gestión de comunidad y reporte mensual de métricas",
    ],
    resultados: ["Crecimiento orgánico sostenido", "Perfil que transmite confianza", "Más consultas y ventas"],
    plataformas: ["Instagram", "TikTok", "Facebook"],
    faq: [
      {
        pregunta: "¿Cuánto tarda en verse resultados?",
        respuesta:
          "Hay clientes que vieron reels de +19K views en la 2da semana. El crecimiento sólido se consolida entre el mes 2 y 3 de trabajo constante.",
      },
      {
        pregunta: "¿Tengo que grabar yo?",
        respuesta: "Depende del plan. Podemos trabajar con material tuyo, guiarte con guiones o producir el contenido nosotras.",
      },
      {
        pregunta: "¿Hay permanencia mínima?",
        respuesta: "Te lo contamos en la llamada según tu caso; armamos la propuesta a medida.",
      },
    ],
  },
  {
    slug: "publicidad",
    href: "/servicios/publicidad",
    icon: Megaphone,
    acento: "#a970ff",
    categoria: "Pauta digital",
    nombre: "Pauta en Meta & Google",
    corto: "Campañas en Meta Ads y Google Ads optimizadas para traer clientes, no solo likes.",
    ideal: "Querés que cada peso invertido en anuncios vuelva en clientes reales.",
    prueba: { numero: "Meta + Google", etiqueta: "campañas medidas con reportes semanales" },
    titular: "Cada peso invertido en pauta, medido y trabajando para vender.",
    bajada:
      "Creamos y optimizamos campañas en Meta y Google que llevan a tu público ideal a comprarte, escribirte o agendar.",
    dolores: [
      "Pusiste plata en “promocionar” y no viste ventas.",
      "No sabés a quién apuntar ni cuánto invertir.",
      "Tus anuncios se ven como anuncios y nadie los mira.",
    ],
    incluye: [
      "Configuración de Business Manager, píxel, Google Ads y conversiones",
      "Estrategia de embudo: frío, tibio y remarketing",
      "Creativos de anuncios (estáticos y video)",
      "Campañas de búsqueda en Google para captar a quien ya te está buscando",
      "Segmentación y pruebas A/B",
      "Optimización semanal y reporte de costo por resultado",
    ],
    resultados: ["Más ventas y leads calificados", "Costo por resultado más bajo", "Decisiones basadas en datos"],
    plataformas: ["Meta Ads", "Instagram", "Facebook", "Google Ads"],
    faq: [
      {
        pregunta: "¿Cuánto tengo que invertir en publicidad?",
        respuesta: "Depende del objetivo y rubro. En la llamada te recomendamos un presupuesto inicial realista.",
      },
      {
        pregunta: "¿El presupuesto de pauta está incluido?",
        respuesta: "No, la inversión en plataformas es aparte y la pagás directo a Meta o Google.",
      },
      {
        pregunta: "¿En cuánto tiempo se optimiza?",
        respuesta: "Las primeras 2 semanas son de aprendizaje; desde ahí escalamos lo que funciona.",
      },
    ],
  },
  {
    slug: "paginas-web",
    href: "/servicios/paginas-web",
    icon: Code2,
    acento: "#3b9dff",
    categoria: "Web & Apps",
    nombre: "Desarrollo Web & Apps",
    corto: "Webs, landings, tiendas online, apps y sistemas a medida pensados para vender y automatizar.",
    ideal: "Necesitás una web, tienda o sistema que venda y trabaje por vos 24/7.",
    prueba: { numero: "4 webs", etiqueta: "lanzadas en Argentina y Chile" },
    titular: "La web y la tecnología que tu negocio necesita para escalar.",
    bajada:
      "Combinamos marketing y programación: sitios, tiendas online, apps y sistemas a medida conectados a tu estrategia de ventas.",
    dolores: [
      "No tenés web o la que tenés quedó vieja.",
      "Vendés por DM y se te pierden pedidos.",
      "Hacés a mano tareas que podrían ser automáticas.",
    ],
    incluye: [
      "Sitios web y landing pages orientadas a conversión",
      "Tiendas online con pagos (Mercado Pago / PayPal)",
      "Apps y sistemas a medida",
      "Paneles de gestión y automatizaciones",
      "Integración con WhatsApp, agenda, redes y campañas",
      "SEO básico, métricas y soporte después de la entrega",
    ],
    resultados: ["Más consultas y ventas online", "Menos tareas manuales", "Un sistema que crece con vos"],
    plataformas: ["Web", "eCommerce", "Apps", "Sistemas"],
    faq: [
      {
        pregunta: "¿Puedo editarla yo después?",
        respuesta: "Sí, te la entregamos lista para que puedas actualizar textos e imágenes.",
      },
      {
        pregunta: "¿Pueden hacer algo totalmente a medida?",
        respuesta: "Sí: primero entendemos tu proceso y después desarrollamos.",
      },
      {
        pregunta: "¿Cuánto tarda y cuánto cuesta?",
        respuesta: "Depende del alcance. Después de la llamada te enviamos una propuesta con tiempos e inversión.",
      },
    ],
  },
];

export function servicioPorSlug(slug: ServicioSlug): ServicioLanding {
  return SERVICIOS_LANDING.find((s) => s.slug === slug)!;
}

// "Cómo trabajamos": del primer contacto a los resultados.
export type Paso = { icon: LucideIcon; titulo: string; texto: string; badge?: string; color: string };

export const PASOS: Paso[] = [
  { icon: CalendarDays, titulo: "Agendás tu llamada", texto: "Elegís día y horario en 30 segundos, sin vueltas.", badge: "Gratis", color: "#ccff00" },
  { icon: Phone, titulo: "Asesoría 1:1 de 15 min", texto: "Analizamos tu marca en vivo y detectamos qué está frenando tus ventas.", color: "#ff4fd8" },
  { icon: FileText, titulo: "Propuesta personalizada", texto: "Te enviamos un plan a medida con estrategia, entregables e inversión.", color: "#a970ff" },
  { icon: Rocket, titulo: "Arrancamos y medimos", texto: "Si te cierra, ponemos todo en marcha y te mostramos resultados reales.", color: "#3b9dff" },
];
