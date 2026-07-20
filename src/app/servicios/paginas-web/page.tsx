"use client";

import {
  Gauge,
  Search,
  PenTool,
  Cpu,
  LayoutTemplate,
  Lock,
  Hourglass,
  PhoneCall,
  Rocket,
  GraduationCap,
  ShieldCheck,
  Wallet,
  Atom,
  Terminal,
  Server,
  Wind,
  Database,
  Wrench,
  Mail,
  Headset,
  MessageCircle,
  ClipboardList,
  Code2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landings/LandingHero";
import LandingTecnologias from "@/components/landings/LandingTecnologias";
import LandingProblema from "@/components/landings/LandingProblema";
import LandingSolucion from "@/components/landings/LandingSolucion";
import LandingFeatures from "@/components/landings/LandingFeatures";
import LandingIncluye from "@/components/landings/LandingIncluye";
import LandingSocialProofTecnico from "@/components/landings/LandingSocialProofTecnico";
import LandingComparativaTabla from "@/components/landings/LandingComparativaTabla";
import LandingProceso from "@/components/landings/LandingProceso";
import LandingPerfil from "@/components/landings/LandingPerfil";
import LandingFAQ from "@/components/landings/LandingFAQ";
import LandingCTA from "@/components/landings/LandingCTA";

export default function PaginasWebPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="cyan"
        mockup="browser"
        kicker="Software · Páginas Web"
        tituloPre="Páginas Web que"
        tituloDestacado="Convierten Visitas"
        tituloPost="en Clientes"
        subtitulo="No usamos plantillas lentas. Diseñamos y programamos sitios de alto rendimiento con React y Next.js para que nunca pierdas un cliente por tiempos de carga."
        ctaLabel="Cotizar mi página web"
        ctaHref="#cotizar"
      />

      <LandingTecnologias
        acento="cyan"
        titulo="Tecnologías que usamos"
        subtitulo="El mismo stack con el que construimos y mantenemos nuestra propia plataforma"
        tecnologias={[
          { icon: Atom, nombre: "React" },
          { icon: Terminal, nombre: "Next.js" },
          { icon: Server, nombre: "Node.js" },
          { icon: Wind, nombre: "Tailwind CSS" },
          { icon: Database, nombre: "SQL" },
        ]}
      />

      <LandingProblema
        acento="cyan"
        eyebrow="El problema real"
        titulo="Si tu web no vende, no es mala suerte: es el diseño."
        puntos={[
          { icon: Hourglass, texto: "Tarda varios segundos en cargar y perdés visitas antes de que termine de abrir." },
          { icon: LayoutTemplate, texto: "Se ve igual que la plantilla de WordPress o Wix de cualquier competidor." },
          { icon: Search, texto: "No aparece en Google porque nunca se pensó su estructura para SEO." },
          { icon: Lock, texto: "Dependés de un tercero para cualquier cambio, y cada edición demora días." },
        ]}
      />

      <LandingSolucion
        acento="cyan"
        mockup="browser"
        eyebrow="La solución"
        titulo="Un sitio programado a medida, no armado con plantillas"
        descripcion="Construimos tu página desde cero, pensada para tu marca y tu objetivo comercial, con el mismo stack que usan las plataformas más rápidas del mercado."
        items={[
          "Diseño 100% a medida, sin plantillas genéricas",
          "Código optimizado con React y Next.js para carga instantánea",
          "Estructura y metadatos configurados para SEO desde el día uno",
          "Panel simple para que puedas pedirnos cambios sin fricción",
        ]}
      />

      <LandingFeatures
        acento="cyan"
        titulo="Todo lo que necesita tu sitio para vender"
        subtitulo="Diseño, velocidad y posicionamiento trabajando juntos"
        items={[
          {
            icon: PenTool,
            titulo: "Diseño 100% a Medida",
            texto:
              "Cada sitio se diseña desde cero para tu marca: sin plantillas genéricas, con una estructura pensada para convertir visitas en consultas y ventas.",
          },
          {
            icon: Gauge,
            titulo: "Velocidad de Carga Real",
            texto:
              "Código optimizado que carga en segundos, no en minutos. Mejor experiencia para tus visitantes y mejor ranking en Google.",
          },
          {
            icon: Search,
            titulo: "SEO Técnico Incluido",
            texto:
              "Estructura, metadatos y rendimiento configurados desde el primer día para que Google encuentre y posicione tu página.",
          },
        ]}
      />

      <LandingIncluye
        acento="cyan"
        eyebrow="Sin sorpresas"
        titulo="Todo lo que incluye tu página web"
        subtitulo="No te dejamos solo después de la entrega: nos ocupamos de que todo siga funcionando."
        items={[
          { icon: Server, titulo: "Servicio de Hosting" },
          { icon: Wrench, titulo: "Mantenimiento Web" },
          { icon: Mail, titulo: "Mails Corporativos" },
          { icon: Headset, titulo: "Soporte Técnico" },
          { icon: ShieldCheck, titulo: "Backups Automáticos" },
          { icon: MessageCircle, titulo: "Botón de WhatsApp Integrado" },
        ]}
        nota="Todo esto queda gestionado por nosotros: no necesitás contratar ni administrar nada por tu cuenta."
      />

      <LandingSocialProofTecnico
        acento="cyan"
        titulo="Por qué confiar tu web a este equipo"
        subtitulo="Sin casos de software inventados: esto es lo que sí podemos mostrar."
        credenciales={[
          {
            icon: GraduationCap,
            titulo: "Formación universitaria",
            texto: "Analista programador con formación académica en desarrollo de software, no un curso online de fin de semana.",
          },
          {
            icon: ShieldCheck,
            titulo: "Stack en producción",
            texto: "React, Next.js, Node.js y SQL: el mismo stack que corre este sitio y el resto de nuestra plataforma, todos los días.",
          },
          {
            icon: Wallet,
            titulo: "Integraciones reales",
            texto: "Pagos con Mercado Pago y PayPal ya integrados y funcionando en nuestra propia plataforma de venta de servicios.",
          },
        ]}
      />

      <LandingComparativaTabla
        acento="cyan"
        titulo="¿Por qué elegirnos?"
        subtitulo="Nosotros vs. freelancer vs. hacerlo vos mismo con un constructor web."
        columnaNosotros="Nosotros"
        filas={[
          { label: "Diseño profesional a medida", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
          { label: "Código propio (React/Next.js), sin builders", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
          { label: "SEO técnico incluido", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
          { label: "Hosting, mail y backups gestionados", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
          { label: "Soporte continuo post-lanzamiento", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
          { label: "Podés editar el contenido vos mismo", nosotros: "si", freelancer: "parcial", vosMismo: "si" },
          { label: "Arquitectura que escala con tu negocio", nosotros: "si", freelancer: "parcial", vosMismo: "no" },
        ]}
      />

      <LandingSolucion
        acento="cyan"
        mockup="code"
        invertido
        eyebrow="Desarrollo a medida"
        titulo="No solo diseñamos. Programamos."
        descripcion="Cuando tu proyecto lo necesita, vamos más allá del diseño: construimos software a medida sobre tu propia página."
        items={[
          "Sitios construidos desde cero con React y Next.js, sin constructores genéricos",
          "Integraciones a medida con pagos, formularios y herramientas externas",
          "Código limpio y versionado que queda documentado, no atado a un editor visual",
          "Arquitectura pensada para crecer: de una landing simple a un sistema completo",
        ]}
      />

      <LandingProceso
        acento="cyan"
        titulo="De la idea a tu web publicada"
        subtitulo="Un proceso claro, sin sorpresas. El tiempo exacto se define en la llamada de diagnóstico, según la complejidad del proyecto."
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Charlamos sobre tu negocio, tu objetivo y qué necesita tu página para cumplirlo.",
          },
          {
            icon: ClipboardList,
            titulo: "Propuesta y arquitectura",
            texto: "Definimos el alcance, las secciones y la estructura exacta de tu sitio.",
          },
          {
            icon: PenTool,
            titulo: "Diseño UX/UI a medida",
            texto: "Diseñamos cada pantalla pensada para convertir visitas en clientes.",
          },
          {
            icon: Code2,
            titulo: "Desarrollo y contenido",
            texto: "Programamos el sitio y cargamos tus textos e imágenes definitivos.",
          },
          {
            icon: Rocket,
            titulo: "Revisión y lanzamiento",
            texto: "Ajustamos los últimos detalles junto a vos y publicamos tu web.",
          },
        ]}
      />

      <LandingPerfil
        acento="cyan"
        badge="Liderazgo técnico"
        badgeIcon={Cpu}
        titulo="Código limpio, arquitecturas que escalan."
        nombre="Leonardo Troncoso"
        cargo="Líder de Desarrollo / Analista Programador"
        bio="Nuestra área tecnológica no improvisa. Combinamos sólida formación académica universitaria con el dominio de tecnologías Full Stack de vanguardia. Nos aseguramos de que tu página esté construida con código eficiente, para que no solo rinda al máximo hoy, sino que soporte todo el crecimiento de tu negocio mañana."
        skills={["React", "Next.js", "Node.js", "SQL"]}
        imagen="/leotroncoso.jpg"
      />

      <LandingFAQ
        acento="cyan"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de empezar un sitio web"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Desde ahí vas a poder cargar toda la información de tu negocio, completar el onboarding con nuestro equipo y ver en tiempo real el progreso exacto del desarrollo de tu web.",
          },
          {
            pregunta: "¿Qué medios de pago aceptan?",
            respuesta:
              "Todos los pagos se procesan a través de MercadoPago: podés pagar con saldo en cuenta, débito o tarjeta de crédito, aprovechando las cuotas disponibles. Si estás fuera de Argentina y querés coordinar otra forma de pago, escribinos por WhatsApp y lo vemos juntos.",
          },
          {
            pregunta: "¿El hosting, el mail y el mantenimiento están incluidos?",
            respuesta:
              "Sí. Tu página incluye hosting, mantenimiento, casillas de mail corporativo, soporte técnico y backups automáticos: no tenés que contratar ni administrar nada por tu cuenta.",
          },
          {
            pregunta: "¿Puedo pedir ajustes después de la entrega?",
            respuesta:
              "Absolutamente. Nuestro objetivo es que tu página supere tus expectativas. Establecemos instancias de revisión durante el desarrollo y garantizamos ajustes finales dentro del alcance definido en la etapa de onboarding.",
          },
          {
            pregunta: "¿Mi página va a aparecer en Google?",
            respuesta:
              "Configuramos toda la base técnica de SEO (velocidad, estructura, metadatos) para que Google pueda indexar y posicionar tu página correctamente. Alcanzar los primeros resultados también depende de la competencia de tu rubro y del contenido, pero la base técnica queda resuelta desde el lanzamiento.",
          },
          {
            pregunta: "¿Trabajan con clientes de otros países?",
            respuesta:
              "¡Por supuesto! Aunque nuestras raíces y nuestro equipo base están en la Patagonia, construimos plataformas para marcas de toda Latinoamérica y del exterior, coordinando todo a través de nuestro Panel de Cliente sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="cyan"
        titulo="¿Listo para tener una página que realmente venda?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos qué necesita tu negocio y te armamos la propuesta exacta para tu página web."
        mensajeWhatsapp="¡Hola! Quiero cotizar el diseño de una página web para mi negocio 🚀"
        ctaLabel="Cotizar mi página web"
      />

      <Footer />
    </main>
  );
}
