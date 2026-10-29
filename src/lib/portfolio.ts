import type { ServicioSlug } from "@/lib/servicios-landing";

// Casos del portfolio (home y landings). Datos reales pasados por Natasha:
// no inventar cifras acá. Videos e imágenes viven en /public/portfolio.
export type Proyecto = {
  cliente: string;
  rubro: string;
  necesidad: string;
  estrategia: string;
  trabajo: string[];
  plataformas: string[];
  servicios: ServicioSlug[];
  video?: string;
  poster?: string;
  /** Captura para casos sin video (webs). */
  imagen?: string;
  /** Segundo video que se muestra como pestaña dentro del caso. */
  comparar?: { src: string; etiqueta: string };
  etiquetaVideo?: string;
  url?: string;
  resultados?: { numero: string; etiqueta: string }[];
  logros?: string[];
};

const p = (archivo: string) => `/portfolio/${archivo}`;

export const PROYECTOS: Proyecto[] = [
  {
    cliente: "Zapatería Alex",
    rubro: "Zapatería & Oficio artesanal",
    video: p("zap-alex.mp4"),
    poster: p("zap-alex.jpg"),
    necesidad: "Tenían 500 seguidores y una imagen que no mostraba el valor de su oficio.",
    estrategia:
      "Community management completo: renovamos la identidad del perfil y sostuvimos contenido constante mostrando el proceso artesanal, que retiene por curiosidad y transmite calidad.",
    trabajo: ["Community management", "Identidad visual del perfil", "Grabación de proceso", "Edición de reels"],
    plataformas: ["Instagram", "Reels"],
    resultados: [
      { numero: "+10K", etiqueta: "seguidores" },
      { numero: "500 → 10K", etiqueta: "crecimiento orgánico" },
    ],
    servicios: [],
  },
  {
    cliente: "Treve Americano",
    rubro: "Indumentaria outdoor & nieve",
    video: p("treve-americano.mp4"),
    poster: p("treve-americano.jpg"),
    necesidad: "Necesitaban un video UGC que funcionara como anuncio para vender en temporada.",
    estrategia:
      "Creamos un UGC dinámico recorriendo la tienda y destacando marcas y prendas clave. La marca lo usó como anuncio y se convirtió en su pieza más vista.",
    trabajo: ["Guion UGC", "Grabación en local", "Edición para anuncio", "Copy de venta"],
    plataformas: ["Instagram", "Meta Ads"],
    resultados: [{ numero: "+300K", etiqueta: "views con pauta" }],
    servicios: [],
  },
  {
    cliente: "Lavadero",
    rubro: "Lavadero industrial",
    video: p("lavadero.mp4"),
    poster: p("lavadero.jpg"),
    necesidad: "Dar a conocer un servicio B2B poco visible y generar consultas de empresas.",
    estrategia: "Mostrar el proceso real del servicio con textos claros y llamativos que explican el beneficio.",
    trabajo: ["Grabación de proceso", "Edición de reels", "Subtítulos animados"],
    plataformas: ["Instagram", "Reels"],
    resultados: [{ numero: "+22K", etiqueta: "views en un video" }],
    servicios: [],
  },
  {
    cliente: "Sol — Entrenadora Personal",
    rubro: "Fitness & Entrenamiento",
    video: p("sol-entrenadora.mp4"),
    poster: p("sol-entrenadora.jpg"),
    necesidad: "Posicionarse como referente y atraer alumnas nuevas desde redes.",
    estrategia:
      "Contenido educativo de técnica (“Cómo hacer…”) con edición clara: aporta valor, se guarda y se comparte. Resultados en apenas la 2da semana de trabajo.",
    trabajo: ["Community management", "Plan semanal de contenido", "Edición de reels educativos", "Copy y portadas"],
    plataformas: ["Instagram", "Reels"],
    resultados: [
      { numero: "+19K", etiqueta: "views en un video" },
      { numero: "+20", etiqueta: "seguidores con ese reel" },
    ],
    logros: ["Resultados en la 2da semana de trabajo"],
    servicios: [],
  },
  {
    cliente: "Home Deko",
    rubro: "Emprendimiento familiar · Hogar & Deco",
    video: p("home-deko.mp4"),
    poster: p("home-deko.jpg"),
    necesidad: "Contar la historia detrás del emprendimiento y generar cercanía con su comunidad.",
    estrategia:
      "Formato vlog con storytelling: la familia, el día a día y el trabajo detrás de cada pedido para conectar y generar confianza.",
    trabajo: ["Community management", "Guion y storytelling", "Edición de vlog", "Subtítulos dinámicos"],
    plataformas: ["Instagram", "Reels"],
    resultados: [
      { numero: "+11K", etiqueta: "views en cada video" },
      { numero: "+22K", etiqueta: "pico en un reel" },
      { numero: "+10", etiqueta: "seguidores netos en la 1ra semana" },
    ],
    servicios: ["community-manager"],
  },
  {
    cliente: "Camping y Motorhome",
    rubro: "Turismo & Aire libre",
    video: p("camping-motorhome.mp4"),
    poster: p("camping-motorhome.jpg"),
    necesidad: "Su perfil no transmitía sus valores ni llegaba a gente nueva.",
    estrategia:
      "Reordenamos el perfil con contenido alineado a su cliente potencial y una línea visual coherente, mostrando el lugar y la experiencia.",
    trabajo: ["Community management", "Rediseño del feed", "Plan de contenido", "Análisis de métricas"],
    plataformas: ["Instagram", "Reels"],
    resultados: [
      { numero: "+488,8%", etiqueta: "cuentas alcanzadas" },
      { numero: "+5,5K", etiqueta: "views" },
      { numero: "+32", etiqueta: "seguidores nuevos" },
      { numero: "112", etiqueta: "visitas al perfil" },
    ],
    logros: ["Sus valores se transmiten", "Contenido alineado a su cliente potencial", "Mejor coherencia visual"],
    servicios: ["community-manager"],
  },
  {
    cliente: "Umami",
    rubro: "Gastronomía",
    video: p("umami.mp4"),
    poster: p("umami.jpg"),
    necesidad: "Despertar antojo y llevar más pedidos al local en poco tiempo.",
    estrategia:
      "Community management de 1 mes con reels de producto que dan hambre: planos cercanos, ritmo ágil y textos que invitan a pedir.",
    trabajo: ["Community management (1 mes)", "Producción de contenido", "Edición de reels", "Copy de venta"],
    plataformas: ["Instagram", "Reels"],
    resultados: [
      { numero: "+6K", etiqueta: "visitas en un video" },
      { numero: "+17", etiqueta: "seguidores nuevos con ese reel" },
    ],
    servicios: ["community-manager"],
  },
  {
    cliente: "Stylo Chamal",
    rubro: "Tienda de indumentaria",
    video: p("stylo-chamal.mp4"),
    poster: p("stylo-chamal-feed.jpg"),
    necesidad: "El perfil no mostraba bien la variedad de productos ni guiaba a la compra.",
    estrategia:
      "Rediseñamos el feed con portadas y textos de marca para mostrar más productos de mejor manera y ordenar el contenido como un embudo de venta.",
    trabajo: ["Community management", "Diseño de portadas", "Contenido de producto", "Embudo de venta en el perfil"],
    plataformas: ["Instagram", "Reels"],
    logros: ["Coherencia visual", "Más productos mostrados de mejor manera", "Mejor distribución del embudo de venta"],
    servicios: ["community-manager"],
  },
  {
    cliente: "Be Free",
    rubro: "Peluquería & Coloristas · Buenos Aires",
    video: p("be-free.mp4"),
    poster: p("be-free.jpg"),
    comparar: { src: p("be-free-antes-despues.mp4"), etiqueta: "Antes / Después" },
    necesidad: "Atraer clientas nuevas y transmitir la experiencia del salón.",
    estrategia:
      "Reordenamos el perfil (bio, destacadas y línea visual) para que quede claro a quién le hablan, con contenido a cámara cercano que genera confianza antes de la primera visita.",
    trabajo: ["Optimización de perfil", "Guion", "Edición de reels", "Subtítulos con estilo de marca"],
    plataformas: ["Instagram", "Reels"],
    logros: ["Coherencia visual", "Más claridad sobre su cliente", "Contenido alineado a la marca"],
    servicios: ["community-manager"],
  },
  {
    cliente: "Dr. Emiliano Toltl",
    rubro: "Salud · Medicina capilar",
    video: p("emiliano-toltl.mp4"),
    poster: p("emiliano-toltl.jpg"),
    necesidad: "Comunicar contenido médico de forma clara y atractiva para posicionarse como referente en salud capilar.",
    estrategia:
      "Edición educativa con gancho inicial fuerte (“2 causas de la caída del pelo”), subtítulos dinámicos y ritmo ágil para que un tema técnico se entienda y se vea hasta el final.",
    trabajo: ["Edición de video", "Subtítulos dinámicos", "Gancho y estructura", "Ritmo y sonido"],
    plataformas: ["Instagram", "Reels"],
    servicios: [],
  },
  {
    cliente: "Nahuel",
    rubro: "Entrenamiento & Bienestar",
    video: p("nahuel.mp4"),
    poster: p("nahuel.jpg"),
    necesidad: "Necesitaba edición profesional para sus videos a cámara.",
    estrategia: "Edición dinámica con subtítulos animados y ritmo que sostiene la atención y refuerza su mensaje.",
    trabajo: ["Edición de video", "Subtítulos animados", "Ritmo y sonido"],
    plataformas: ["Instagram", "Reels"],
    servicios: [],
  },
  {
    cliente: "Dani",
    rubro: "Profesora de español online",
    video: p("dani-web.mp4"),
    poster: p("dani-web.jpg"),
    etiquetaVideo: "Web",
    comparar: { src: p("dani.mp4"), etiqueta: "Contenido" },
    necesidad:
      "Una web para vender sus clases de español a viajeros de habla inglesa y convertir a sus seguidores en alumnos.",
    estrategia:
      "Landing en inglés con storytelling personal (“I used to hide under my desk…”), su método explicado paso a paso y llamados a la acción claros, sumado a contenido a cámara para redes.",
    trabajo: ["Diseño y desarrollo web", "Copy en inglés orientado a conversión", "Versión mobile", "Edición de videos UGC"],
    plataformas: ["Web", "Instagram", "TikTok"],
    servicios: ["paginas-web"],
  },
  // Webs: completar "url" con el link de cada sitio para mostrar el botón "Ver sitio".
  {
    cliente: "Delphi",
    rubro: "Centro clínico · Concepción, Chile",
    imagen: p("delphi.jpg"),
    necesidad: "Un sitio moderno que transmitiera confianza y facilitara a los pacientes reservar su turno.",
    estrategia:
      "Web clara y humana, con la identidad de la clínica, áreas y servicios ordenados y el botón “Agendar hora” siempre a mano, más WhatsApp directo.",
    trabajo: ["Diseño y desarrollo web", "Áreas y servicios", "Agenda de turnos online", "Blog", "Integración con WhatsApp"],
    plataformas: ["Web", "Mobile"],
    servicios: ["paginas-web"],
  },
  {
    cliente: "Entiendados",
    rubro: "Celulares y accesorios · Palermo, Argentina",
    imagen: p("entiendados.jpg"),
    necesidad: "Vender fundas y accesorios online a todo el país, también a mayoristas.",
    estrategia:
      "Tienda online con búsqueda por producto y por modelo de celular, envíos a todo el país, catálogo mayorista y conexión con Instagram y WhatsApp.",
    trabajo: ["Tienda online (eCommerce)", "Búsqueda por modelo de celular", "Catálogo mayorista", "Envíos a todo el país", "Integración con Instagram y WhatsApp"],
    plataformas: ["eCommerce", "Mobile"],
    servicios: ["paginas-web"],
  },
  {
    cliente: "Amura Suites",
    rubro: "Hotel · Pinamar, Argentina",
    imagen: p("amura.jpg"),
    necesidad: "Transmitir la experiencia del hotel y recibir reservas directas, sin depender solo de plataformas.",
    estrategia:
      "Sitio elegante y visual que invita a “sentir la experiencia Amura”, con galería, consulta de disponibilidad y WhatsApp para reservar.",
    trabajo: ["Diseño y desarrollo web", "Galería", "Consulta de disponibilidad y reservas", "Integración con WhatsApp"],
    plataformas: ["Web", "Mobile"],
    servicios: ["paginas-web"],
  },
];
