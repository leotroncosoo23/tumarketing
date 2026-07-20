"use client";

import { Camera, Clapperboard, Palette, Sparkles, ImageOff, Hourglass, EyeOff, Frown, PhoneCall, ClipboardList, Rocket } from "lucide-react";
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

export default function CreacionEdicionPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="fuchsia"
        mockup="reel"
        kicker="Redes Sociales · Creación y Edición"
        tituloPre="Contenido y Edición que"
        tituloDestacado="Detiene"
        tituloPost="el Scroll"
        subtitulo="Fotografía, video y diseño gráfico pensados para tu marca, con una edición profesional que hace que tu contenido se vea (y venda) distinto."
        ctaLabel="Cotizar mi contenido"
        ctaHref="#cotizar"
      />

      <LandingProblema
        acento="fuchsia"
        eyebrow="El problema real"
        titulo="Un buen producto con mal contenido pasa desapercibido"
        puntos={[
          { icon: ImageOff, texto: "Tu contenido se ve igual que el de cualquier otro perfil del rubro." },
          { icon: Hourglass, texto: "Grabás con el celular pero no sabés editarlo para que enganche." },
          { icon: EyeOff, texto: "Publicás y nadie se detiene a mirarlo más de dos segundos." },
          { icon: Frown, texto: "No tenés un estilo visual consistente que se reconozca de un vistazo." },
        ]}
      />

      <LandingSolucion
        acento="fuchsia"
        visual={<InstagramEmbed url="https://www.instagram.com/p/DZ5KzKaxUNB/" acento="fuchsia" />}
        eyebrow="La solución"
        titulo="No apuntamos a likes: apuntamos a que te compartan y te guarden"
        descripcion="Un like es fácil. Lo que de verdad le importa a Instagram (y a tu negocio) es que compartan tu contenido, lo guarden y se queden mirándolo hasta el final. Producimos y editamos pensando en esas métricas, no en la vanidad de un corazón."
        items={[
          "Fotografía y producción pensada para tu marca",
          "Edición de video y reels con ritmo que retiene la atención hasta el final",
          "Diseño gráfico con identidad visual propia",
          "Piezas pensadas para generar guardados y compartidos, no solo likes",
        ]}
      />

      <LandingFeatures
        acento="fuchsia"
        titulo="Contenido que representa a tu marca"
        subtitulo="Producción, edición y diseño en un solo lugar"
        items={[
          {
            icon: Camera,
            titulo: "Fotografía y Producción",
            texto:
              "Sesiones de producto, local o equipo pensadas para transmitir la identidad de tu marca en cada publicación.",
          },
          {
            icon: Clapperboard,
            titulo: "Edición de Video y Reels",
            texto:
              "Cortes dinámicos, ritmo y texto en pantalla para contenido audiovisual que retiene la atención hasta el final.",
          },
          {
            icon: Palette,
            titulo: "Diseño Gráfico para Redes",
            texto:
              "Piezas gráficas con identidad propia (colores, tipografías, estilo) para que tu perfil se reconozca de un vistazo.",
          },
        ]}
      />

      <LandingSocialProofCasos
        acento="fuchsia"
        titulo="Contenido que sí generó resultados"
        subtitulo="Números reales de clientes reales. Nada de vanity metrics."
        casos={["alojamiento"]}
      />

      <LandingComparativa
        acento="fuchsia"
        titulo="¿Contenido genérico o contenido de marca?"
        subtitulo="La diferencia entre pasar desapercibido y quedarse en la mente del cliente."
        malaEtiqueta="Contenido Genérico"
        malaSubEtiqueta="Plantillas de stock"
        malaPuntos={[
          { label: "Identidad", texto: "Se parece al de cualquier otra cuenta del rubro." },
          { label: "Calidad", texto: "Fotos y videos caseros, sin edición profesional." },
          { label: "Consistencia", texto: "Cada publicación con un estilo distinto." },
          { label: "Recordación", texto: "El usuario lo scrollea sin detenerse." },
        ]}
        buenaEtiqueta="Contenido de Marca"
        buenaSubEtiqueta="Producción + edición profesional"
        buenaPuntos={[
          { label: "Identidad", texto: "Estilo visual propio y reconocible en cada pieza." },
          { label: "Calidad", texto: "Fotografía y video con producción y edición cuidada." },
          { label: "Consistencia", texto: "Misma línea gráfica en todas las publicaciones." },
          { label: "Recordación", texto: "Contenido que detiene el scroll y queda en la memoria." },
        ]}
      />

      <LandingProceso
        acento="fuchsia"
        titulo="De la idea a la pieza publicada, en 3 pasos"
        subtitulo="Sin vueltas ni procesos eternos"
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Entendemos tu marca, tu estilo visual y qué tipo de contenido necesitás producir.",
          },
          {
            icon: ClipboardList,
            titulo: "Producción y edición",
            texto: "Coordinamos la sesión o el material a editar, y trabajamos la pieza con nuestra edición profesional.",
          },
          {
            icon: Rocket,
            titulo: "Entrega lista para publicar",
            texto: "Te entregamos el contenido terminado, listo para subir a tus redes sin retoques adicionales.",
          },
        ]}
      />

      <LandingPerfil
        acento="fuchsia"
        badge="Dirección de Marketing"
        badgeIcon={Sparkles}
        titulo="Cada pieza pensada para transmitir tu marca."
        nombre="Natasha"
        cargo="Co-fundadora & Directora de Marketing Digital"
        bio="Especialista en adquisición de tráfico, pauta digital y optimización de conversión. Su enfoque está en entender la psicología del consumidor para diseñar contenido y campañas de alto impacto que multiplican las ventas."
        skills={["Meta Ads", "Branding", "CRO", "Estrategia Comercial"]}
        imagen="/natasha-nosotros.png"
      />

      <LandingFAQ
        acento="fuchsia"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de pedir contenido"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Ahí coordinás el material o la sesión de producción y ves el progreso de tu contenido en tiempo real.",
          },
          {
            pregunta: "¿Qué medios de pago aceptan?",
            respuesta:
              "Todos los pagos se procesan a través de MercadoPago: podés pagar con saldo en cuenta, débito o tarjeta de crédito, aprovechando las cuotas disponibles. Si estás fuera de Argentina, escribinos por WhatsApp para coordinar otra forma de pago.",
          },
          {
            pregunta: "¿Puedo pedir ajustes en la edición final?",
            respuesta:
              "Sí. Establecemos instancias de revisión antes de la entrega final y garantizamos ajustes dentro del alcance definido en la etapa de onboarding, para que la pieza quede como la imaginaste.",
          },
          {
            pregunta: "¿Trabajan con marcas de otros países?",
            respuesta:
              "Sí, producimos y editamos contenido para marcas de toda Latinoamérica y del exterior, coordinando el material a través de nuestro Panel de Cliente sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="fuchsia"
        titulo="¿Listo para que tu marca se vea (y se sienta) distinta?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos qué contenido necesitás y te armamos la propuesta de producción y edición."
        mensajeWhatsapp="¡Hola! Quiero cotizar creación y edición de contenido para mis redes 🚀"
        ctaLabel="Cotizar mi contenido"
      />

      <Footer />
    </main>
  );
}
