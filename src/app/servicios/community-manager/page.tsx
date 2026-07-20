"use client";

import { CalendarCheck, MessageCircle, BarChart3, Sparkles, CalendarX, MessageCircleOff, TrendingDown, HelpCircle, PhoneCall, ClipboardList, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landings/LandingHero";
import LandingProblema from "@/components/landings/LandingProblema";
import LandingSolucion from "@/components/landings/LandingSolucion";
import InstagramEmbed from "@/components/landings/InstagramEmbed";
import LandingFeatures from "@/components/landings/LandingFeatures";
import LandingSocialProofCasos from "@/components/landings/LandingSocialProofCasos";
import LandingComparativa from "@/components/landings/LandingComparativa";
import LandingProceso from "@/components/landings/LandingProceso";
import LandingPerfil from "@/components/landings/LandingPerfil";
import LandingFAQ from "@/components/landings/LandingFAQ";
import LandingCTA from "@/components/landings/LandingCTA";

export default function CommunityManagerPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="fuchsia"
        mockup="feed"
        kicker="Redes Sociales · Community Manager"
        tituloPre="Gestión Profesional de"
        tituloDestacado="tus Redes"
        tituloPost="Sociales"
        subtitulo="Planificamos, publicamos y respondemos por tu marca todos los días, con una estrategia de contenido pensada para generar comunidad y ventas."
        ctaLabel="Cotizar gestión de mis redes"
        ctaHref="#cotizar"
      />

      <LandingProblema
        acento="fuchsia"
        eyebrow="El problema real"
        titulo="Tener redes sociales no es lo mismo que tener una estrategia"
        puntos={[
          { icon: CalendarX, texto: "Publicás cuando te acordás, sin un calendario ni una línea editorial." },
          { icon: MessageCircleOff, texto: "Los mensajes y comentarios se acumulan sin respuesta durante días." },
          { icon: TrendingDown, texto: "El alcance viene cayendo y no sabés bien por qué." },
          { icon: HelpCircle, texto: "No tenés forma de saber qué contenido realmente funciona para tu marca." },
        ]}
      />

      <LandingSolucion
        acento="fuchsia"
        visual={<InstagramEmbed url="https://www.instagram.com/reel/DW9TsB3J2xx/" />}
        eyebrow="La solución"
        titulo="Gestión con estrategia, no publicaciones al azar"
        descripcion="Nos encargamos de la planificación, la comunidad y la medición para que tus redes trabajen todos los días por tu marca."
        items={[
          "Calendario de contenido planificado mes a mes",
          "Gestión de mensajes y comentarios en tiempo y forma",
          "Reportes mensuales claros sobre alcance e interacción",
          "Línea editorial coherente con la identidad de tu marca",
        ]}
      />

      <LandingFeatures
        acento="fuchsia"
        titulo="Tus redes, en piloto automático y con estrategia"
        subtitulo="Planificación, comunidad y resultados medibles"
        items={[
          {
            icon: CalendarCheck,
            titulo: "Calendario de Contenido",
            texto:
              "Publicaciones planificadas mes a mes, alineadas a las fechas y objetivos de tu negocio, sin publicar a último momento.",
          },
          {
            icon: MessageCircle,
            titulo: "Gestión de la Comunidad",
            texto:
              "Respondemos mensajes y comentarios en tiempo y forma, cuidando el tono de tu marca en cada interacción con tus seguidores.",
          },
          {
            icon: BarChart3,
            titulo: "Reportes de Resultados",
            texto:
              "Informes mensuales claros sobre alcance, interacción y crecimiento, para saber exactamente qué está funcionando.",
          },
        ]}
      />

      <LandingSocialProofCasos
        acento="fuchsia"
        titulo="Comunidades que hicimos crecer de verdad"
        subtitulo="Números reales de clientes reales. Nada de vanity metrics."
        casos={["alojamiento", "camping"]}
      />

      <LandingComparativa
        acento="fuchsia"
        titulo="¿Publicar sin plan o gestionar con estrategia?"
        subtitulo="La diferencia entre subir contenido al azar y construir una marca."
        malaEtiqueta="Publicar sin Estrategia"
        malaSubEtiqueta="Cuenta manejada 'cuando hay tiempo'"
        malaPuntos={[
          { label: "Consistencia", texto: "Publicaciones esporádicas que la audiencia no espera." },
          { label: "Interacción", texto: "Comentarios y mensajes sin responder a tiempo." },
          { label: "Contenido", texto: "Ideas repetidas sin un hilo conductor de marca." },
          { label: "Resultados", texto: "Imposible saber qué funciona y qué no." },
        ]}
        buenaEtiqueta="Gestión Profesional"
        buenaSubEtiqueta="Estrategia + calendario + datos"
        buenaPuntos={[
          { label: "Consistencia", texto: "Publicaciones planificadas con frecuencia constante." },
          { label: "Interacción", texto: "Comunidad atendida y cuidada en cada respuesta." },
          { label: "Contenido", texto: "Línea editorial coherente con la identidad de tu marca." },
          { label: "Resultados", texto: "Reportes mensuales que muestran el crecimiento real." },
        ]}
      />

      <LandingProceso
        acento="fuchsia"
        titulo="De tu marca dormida a una comunidad activa, en 3 pasos"
        subtitulo="Sin vueltas ni procesos eternos"
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Analizamos tu marca, tu audiencia actual y qué objetivo querés lograr con tus redes.",
          },
          {
            icon: ClipboardList,
            titulo: "Estrategia y calendario",
            texto: "Armamos la línea editorial y el calendario de contenido del mes, alineados a tu negocio.",
          },
          {
            icon: Rocket,
            titulo: "Gestión y resultados",
            texto: "Publicamos, gestionamos la comunidad y te mandamos el reporte con los resultados reales.",
          },
        ]}
      />

      <LandingPerfil
        acento="fuchsia"
        badge="Dirección de Marketing"
        badgeIcon={Sparkles}
        titulo="Estrategia comercial detrás de cada publicación."
        nombre="Natasha"
        cargo="Co-fundadora & Directora de Marketing Digital"
        bio="Especialista en adquisición de tráfico, pauta digital y optimización de conversión. Su enfoque está en entender la psicología del consumidor para diseñar estrategias y contenido de alto impacto que multiplican las ventas."
        skills={["Meta Ads", "Branding", "CRO", "Estrategia Comercial"]}
        imagen="/natasha-nosotros.png"
      />

      <LandingFAQ
        acento="fuchsia"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de delegar sus redes"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Ahí completás el onboarding de tu marca y monitoreás en tiempo real el calendario y los resultados de tus redes.",
          },
          {
            pregunta: "¿Qué medios de pago aceptan?",
            respuesta:
              "Todos los pagos se procesan a través de MercadoPago: podés pagar con saldo en cuenta, débito o tarjeta de crédito, aprovechando las cuotas disponibles. Si estás fuera de Argentina, escribinos por WhatsApp para coordinar otra forma de pago.",
          },
          {
            pregunta: "¿Puedo pedir ajustes en el contenido planificado?",
            respuesta:
              "Sí. Revisamos el calendario de contenido con vos antes de publicar y ajustamos lo que haga falta para que cada pieza represente bien a tu marca.",
          },
          {
            pregunta: "¿Trabajan con marcas de otros países?",
            respuesta:
              "Sí, gestionamos redes de marcas de toda Latinoamérica y del exterior, coordinando todo a través de nuestro Panel de Cliente sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="fuchsia"
        titulo="¿Listo para que tus redes trabajen para tu negocio?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos cómo está tu marca hoy y te armamos la estrategia de contenido que necesita."
        mensajeWhatsapp="¡Hola! Quiero cotizar la gestión de mis redes sociales (Community Manager) 🚀"
        ctaLabel="Cotizar gestión de mis redes"
      />

      <Footer />
    </main>
  );
}
