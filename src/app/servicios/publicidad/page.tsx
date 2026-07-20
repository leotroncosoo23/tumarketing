"use client";

import { Target, TrendingUp, ThumbsUp, Sparkles, MousePointerClick, Wallet, EyeOff, UserX, PhoneCall, ClipboardList, Rocket, Flame, Snowflake, RefreshCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landings/LandingHero";
import LandingImagenFlotante from "@/components/landings/LandingImagenFlotante";
import LandingProblema from "@/components/landings/LandingProblema";
import LandingSolucion from "@/components/landings/LandingSolucion";
import InstagramEmbed from "@/components/landings/InstagramEmbed";
import LandingFeatures from "@/components/landings/LandingFeatures";
import LandingIncluye from "@/components/landings/LandingIncluye";
import LandingSocialProofCasos from "@/components/landings/LandingSocialProofCasos";
import LandingComparativa from "@/components/landings/LandingComparativa";
import LandingProceso from "@/components/landings/LandingProceso";
import LandingPerfil from "@/components/landings/LandingPerfil";
import LandingFAQ from "@/components/landings/LandingFAQ";
import LandingCTA from "@/components/landings/LandingCTA";

export default function PublicidadPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="fuchsia"
        visual={
          <LandingImagenFlotante
            src="/hero-publicidad.png"
            alt="Panel de resultados de campañas de publicidad: alcance, interacciones, clicks y conversiones"
            aspect="aspect-[3/2]"
            acento="fuchsia"
            badges={[
              { icon: Target, texto: "Segmentado", posicion: "top-right" },
              { icon: TrendingUp, texto: "Optimizando en vivo", posicion: "bottom-left" },
            ]}
          />
        }
        kicker="Redes Sociales · Publicidad"
        tituloPre="Publicidad Digital que"
        tituloDestacado="Genera Ventas"
        tituloPost="no Solo Likes"
        subtitulo="Campañas de Meta Ads segmentadas y optimizadas para convertir, con tu presupuesto invertido donde realmente está tu cliente."
        ctaLabel="Cotizar mi campaña"
        ctaHref="#cotizar"
      />

      <LandingProblema
        acento="fuchsia"
        eyebrow="El problema real"
        titulo="Los ads no son magia: son un amplificador"
        puntos={[
          { icon: MousePointerClick, texto: "Le diste 'promocionar' a una publicación y no se tradujo en ninguna venta." },
          { icon: EyeOff, texto: "Si tu contenido no logra que la gente mire hasta el final, entre a tu perfil o te escriba, ponerle presupuesto arriba no lo va a arreglar." },
          { icon: Wallet, texto: "No sabés bien en qué se te está yendo el presupuesto de publicidad." },
          { icon: UserX, texto: "Tu anuncio le llega a cualquiera, no a la persona que realmente te compraría." },
        ]}
      />

      <LandingSolucion
        acento="fuchsia"
        invertido
        visual={<InstagramEmbed url="https://www.instagram.com/p/DY5mZmLRlrP/" acento="fuchsia" />}
        eyebrow="La solución"
        titulo="Primero mensaje. Después estrategia. Después anuncios."
        descripcion="Meta Ads no inventa interés: solo le muestra más tu contenido a más personas. Por eso, antes de pautar, nos aseguramos de que tu mensaje ya funcione — ese orden cambia todo."
        items={[
          "Campañas segmentadas en Meta Ads, no botones de 'promocionar'",
          "Optimización continua según el rendimiento real de cada campaña",
          "Remarketing a quienes ya mostraron interés en tu marca",
          "Reportes claros de costo por resultado, no solo alcance",
        ]}
      />

      <LandingFeatures
        acento="fuchsia"
        titulo="Pauta con estrategia, no botones de 'promocionar'"
        subtitulo="Metemos presupuesto solo detrás de lo que ya demostró que funciona"
        items={[
          {
            icon: ThumbsUp,
            titulo: "Meta Ads",
            texto:
              "Campañas en Facebook e Instagram segmentadas por intereses, ubicación y comportamiento para llegar a quien realmente puede comprarte.",
          },
          {
            icon: Flame,
            titulo: "Amplificamos lo que ya funciona",
            texto:
              "Meta Ads no inventa interés: identificamos qué contenido ya genera clicks, mensajes o visitas a tu perfil, y le ponemos presupuesto atrás para que llegue a más gente.",
          },
          {
            icon: TrendingUp,
            titulo: "Optimización de Conversión",
            texto:
              "Monitoreo constante de cada campaña para reasignar presupuesto hacia lo que mejor está funcionando y mejorar el retorno.",
          },
        ]}
      />

      <LandingIncluye
        acento="fuchsia"
        eyebrow="Antes de invertir"
        titulo="Mini glosario que sí tenés que conocer"
        subtitulo="Los términos básicos para entender en qué se te va la plata"
        items={[
          { icon: MousePointerClick, titulo: "CTR", descripcion: "Gente que hizo click en tu anuncio." },
          { icon: Target, titulo: "Conversión", descripcion: "La acción que buscabas lograr con la campaña." },
          { icon: Wallet, titulo: "CPM", descripcion: "Cuánto cuesta mostrar el anuncio mil veces." },
          { icon: Snowflake, titulo: "Público frío", descripcion: "Gente que todavía no te conoce." },
          { icon: RefreshCcw, titulo: "Retargeting", descripcion: "Volver a mostrarle contenido a quien ya interactuó." },
        ]}
        nota="Nosotros miramos estos números todos los días para vos: no hace falta que te vuelvas experto, solo que sepas qué estamos optimizando."
      />

      <LandingSocialProofCasos
        acento="fuchsia"
        titulo="Marcas que hicimos crecer de verdad"
        subtitulo="Números reales de clientes reales. Nada de vanity metrics."
        casos={["calzado", "camping"]}
      />

      <LandingComparativa
        acento="fuchsia"
        titulo="¿Promocionar publicaciones o pautar con estrategia?"
        subtitulo="La diferencia entre gastar presupuesto y invertirlo."
        malaEtiqueta="Botón de 'Promocionar'"
        malaSubEtiqueta="Boost sin segmentación"
        malaPuntos={[
          { label: "Alcance", texto: "Le llega a cualquiera, no a tu cliente ideal." },
          { label: "Medición", texto: "Sin datos claros de retorno sobre la inversión." },
          { label: "Optimización", texto: "El presupuesto corre igual, funcione o no." },
          { label: "Objetivo", texto: "Piensa en likes, no en ventas." },
        ]}
        buenaEtiqueta="Campañas Profesionales"
        buenaSubEtiqueta="Meta Ads con estrategia"
        buenaPuntos={[
          { label: "Alcance", texto: "Segmentado por intereses, ubicación y comportamiento real." },
          { label: "Medición", texto: "Reportes claros de costo por resultado y retorno." },
          { label: "Optimización", texto: "Ajustes constantes según el rendimiento de cada campaña." },
          { label: "Objetivo", texto: "Piensa en consultas y ventas concretas para tu negocio." },
        ]}
      />

      <LandingProceso
        acento="fuchsia"
        titulo="De la idea a tu primera campaña activa, en 3 pasos"
        subtitulo="Sin vueltas ni procesos eternos"
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Definimos tu objetivo comercial, tu cliente ideal y el presupuesto con el que vamos a trabajar.",
          },
          {
            icon: ClipboardList,
            titulo: "Estrategia y segmentación",
            texto: "Armamos la campaña, la segmentación y las piezas creativas necesarias para lanzar.",
          },
          {
            icon: Rocket,
            titulo: "Lanzamiento y optimización",
            texto: "Publicamos la campaña y la optimizamos en base a datos reales, no a corazonadas.",
          },
        ]}
      />

      <LandingPerfil
        acento="fuchsia"
        badge="Dirección de Marketing"
        badgeIcon={Sparkles}
        titulo="Cada peso invertido, con un objetivo comercial claro."
        nombre="Natasha"
        cargo="Co-fundadora & Directora de Marketing Digital"
        bio="Especialista en adquisición de tráfico, pauta digital y optimización de conversión. Su enfoque está en entender la psicología del consumidor para diseñar campañas de alto impacto que multiplican las ventas."
        skills={["Meta Ads", "Branding", "CRO", "Estrategia Comercial"]}
        imagen="/natasha-nosotros.png"
      />

      <LandingFAQ
        acento="fuchsia"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de invertir en pauta"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Ahí completás el onboarding de tu marca y monitoreás en tiempo real el rendimiento de tu campaña.",
          },
          {
            pregunta: "¿Qué medios de pago aceptan?",
            respuesta:
              "Todos los pagos de nuestro servicio se procesan a través de MercadoPago, con débito, crédito y cuotas disponibles. El presupuesto de pauta en Meta se gestiona aparte, directamente en la plataforma.",
          },
          {
            pregunta: "¿Puedo pedir ajustes en la campaña ya lanzada?",
            respuesta:
              "Sí. Monitoreamos el rendimiento constantemente y ajustamos segmentación, presupuesto y creatividades según los resultados reales, dentro del alcance definido en el onboarding.",
          },
          {
            pregunta: "¿Trabajan con marcas de otros países?",
            respuesta:
              "Sí, gestionamos campañas para marcas de toda Latinoamérica y del exterior, coordinando todo a través de nuestro Panel de Cliente sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="fuchsia"
        titulo="¿Listo para que tu publicidad genere ventas reales?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos tu objetivo comercial y te armamos la estrategia de pauta que necesitás."
        mensajeWhatsapp="¡Hola! Quiero cotizar una campaña de publicidad (Meta Ads) 🚀"
        ctaLabel="Cotizar mi campaña"
      />

      <Footer />
    </main>
  );
}
