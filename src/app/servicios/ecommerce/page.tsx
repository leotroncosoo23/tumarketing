"use client";

import {
  CreditCard,
  PackageSearch,
  ShoppingBag,
  Cpu,
  Boxes,
  Wallet,
  MessageCircleOff,
  Lock,
  PhoneCall,
  Rocket,
  GraduationCap,
  ShieldCheck,
  Globe,
  Landmark,
  Server,
  Wrench,
  Mail,
  Headset,
  MessageCircle,
  ClipboardList,
  PenTool,
  Code2,
  Search,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landings/LandingHero";
import LandingProblema from "@/components/landings/LandingProblema";
import LandingFlujoCompra from "@/components/landings/LandingFlujoCompra";
import LandingFeatures from "@/components/landings/LandingFeatures";
import LandingTecnologias from "@/components/landings/LandingTecnologias";
import LandingSolucion from "@/components/landings/LandingSolucion";
import LandingIncluye from "@/components/landings/LandingIncluye";
import LandingSocialProofTecnico from "@/components/landings/LandingSocialProofTecnico";
import LandingComparativaCards from "@/components/landings/LandingComparativaCards";
import LandingProceso from "@/components/landings/LandingProceso";
import LandingPerfil from "@/components/landings/LandingPerfil";
import LandingFAQ from "@/components/landings/LandingFAQ";
import LandingCTA from "@/components/landings/LandingCTA";

export default function EcommercePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="cyan"
        mockup="catalogo"
        kicker="Software · eCommerce"
        tituloPre="Tiendas Online que"
        tituloDestacado="Venden"
        tituloPost="Todos los Días"
        subtitulo="Programamos tiendas propias, rápidas y sin límites de plantilla, con pagos, stock y pedidos funcionando en piloto automático las 24 horas."
        ctaLabel="Cotizar mi tienda online"
        ctaHref="#cotizar"
      />

      <LandingProblema
        acento="cyan"
        eyebrow="El problema real"
        titulo="Vender no debería depender de estar pendiente del chat todo el día"
        puntos={[
          { icon: MessageCircleOff, texto: "Los pedidos se mezclan entre mensajes de WhatsApp y comentarios de Instagram." },
          { icon: Boxes, texto: "No sabés cuánto stock te queda real hasta que un cliente te avisa que se agotó." },
          { icon: Wallet, texto: "Cada venta en una plataforma de terceros te come un porcentaje en comisiones." },
          { icon: Lock, texto: "Si la plataforma cambia sus reglas de un día para el otro, tu tienda entera depende de esa decisión." },
        ]}
      />

      <LandingFlujoCompra
        acento="cyan"
        eyebrow="La experiencia de compra"
        titulo="Así compra tu cliente, de punta a punta"
        subtitulo="Cuatro pasos, sin fricciones ni redirecciones a otra app"
        pasos={[
          { icon: Search, titulo: "Explora el catálogo", texto: "Encuentra tus productos con búsqueda y filtros rápidos." },
          { icon: ShoppingCart, titulo: "Agrega al carrito", texto: "Suma productos sin perder el catálogo de vista." },
          { icon: CreditCard, titulo: "Paga seguro", texto: "Checkout en un solo paso con Mercado Pago o PayPal." },
          { icon: PackageCheck, titulo: "Recibe la confirmación", texto: "Confirmación automática del pedido, sin que muevas un dedo." },
        ]}
      />

      <LandingFeatures
        acento="cyan"
        titulo="Una tienda que trabaja sola"
        subtitulo="Pagos, stock y pedidos conectados de punta a punta"
        items={[
          {
            icon: CreditCard,
            titulo: "Pagos Integrados",
            texto:
              "Conectamos Mercado Pago, PayPal y las pasarelas que necesites para que cobrar sea automático y seguro, sin fricción para el cliente.",
          },
          {
            icon: PackageSearch,
            titulo: "Gestión de Stock y Pedidos",
            texto:
              "Panel de administración propio para controlar productos, inventario y el estado de cada pedido en tiempo real, sin planillas sueltas.",
          },
          {
            icon: ShoppingBag,
            titulo: "Experiencia de Compra Rápida",
            texto:
              "Checkout en un solo paso, carrito dinámico y búsqueda con filtros para que encontrar y pagar sea inmediato: menos abandono, más ventas concretadas.",
          },
        ]}
      />

      <LandingTecnologias
        acento="cyan"
        titulo="Medios de pago que integramos"
        subtitulo="Pagos ya funcionando en producción, no una promesa a futuro"
        tecnologias={[
          { icon: Wallet, nombre: "Mercado Pago" },
          { icon: Globe, nombre: "PayPal" },
          { icon: CreditCard, nombre: "Tarjetas de crédito y débito" },
          { icon: Landmark, nombre: "Transferencia bancaria" },
        ]}
      />

      <LandingSolucion
        acento="cyan"
        mockup="stock"
        invertido
        eyebrow="Panel de gestión"
        titulo="Tu stock y tus pedidos, siempre bajo control"
        descripcion="Nada de planillas sueltas ni mensajes perdidos: un panel propio para manejar tu catálogo, tu inventario y cada pedido en tiempo real."
        items={[
          "Alta y edición de productos sin depender de nosotros",
          "Alertas automáticas cuando un producto está por agotarse",
          "Estado de cada pedido visible de un vistazo",
          "Historial completo de ventas para tomar mejores decisiones",
        ]}
      />

      <LandingIncluye
        acento="cyan"
        eyebrow="Sin sorpresas"
        titulo="Todo lo que incluye tu tienda online"
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
        titulo="Por qué confiar tu tienda a este equipo"
        subtitulo="Sin casos de software inventados: esto es lo que sí podemos mostrar."
        credenciales={[
          {
            icon: Wallet,
            titulo: "Pagos ya integrados",
            texto: "Mercado Pago y PayPal funcionando en producción en nuestra propia plataforma, no una promesa a futuro.",
          },
          {
            icon: GraduationCap,
            titulo: "Formación universitaria",
            texto: "Analista programador con formación académica en desarrollo de software y bases de datos.",
          },
          {
            icon: ShieldCheck,
            titulo: "Stack en producción",
            texto: "React, Next.js, Node.js y SQL: la misma base que sostiene nuestra propia tienda de servicios.",
          },
        ]}
      />

      <LandingComparativaCards
        acento="cyan"
        titulo="¿Por qué elegirnos?"
        subtitulo="Nosotros vs. freelancer vs. armar tu tienda solo con TiendaNube o Shopify."
        tarjetas={[
          {
            nombre: "Hacerlo vos mismo",
            subtitulo: "TiendaNube, Shopify",
            items: [
              { label: "Podés vender hoy mismo", estado: "si" },
              { label: "Pagos integrados", estado: "si" },
              { label: "Diseño a medida", estado: "no" },
              { label: "Sin comisión por venta", estado: "no" },
              { label: "Panel de stock propio", estado: "parcial" },
              { label: "Soporte continuo", estado: "no" },
            ],
          },
          {
            nombre: "Nosotros",
            subtitulo: "Desarrollo a medida",
            destacada: true,
            items: [
              { label: "Podés vender hoy mismo", estado: "no" },
              { label: "Pagos integrados", estado: "si" },
              { label: "Diseño a medida", estado: "si" },
              { label: "Sin comisión por venta", estado: "si" },
              { label: "Panel de stock propio", estado: "si" },
              { label: "Soporte continuo", estado: "si" },
            ],
          },
          {
            nombre: "Freelancer",
            subtitulo: "Depende del profesional",
            items: [
              { label: "Podés vender hoy mismo", estado: "no" },
              { label: "Pagos integrados", estado: "parcial" },
              { label: "Diseño a medida", estado: "parcial" },
              { label: "Sin comisión por venta", estado: "parcial" },
              { label: "Panel de stock propio", estado: "parcial" },
              { label: "Soporte continuo", estado: "parcial" },
            ],
          },
        ]}
      />

      <LandingProceso
        acento="cyan"
        titulo="De tu catálogo a tu primera venta"
        subtitulo="Un proceso claro, sin sorpresas. El tiempo exacto se define en la llamada de diagnóstico, según la complejidad del proyecto."
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Charlamos sobre tus productos, tu operación actual y qué necesita tu tienda para funcionar sola.",
          },
          {
            icon: ClipboardList,
            titulo: "Propuesta y catálogo",
            texto: "Definimos el alcance, las categorías de producto y la estructura exacta de tu tienda.",
          },
          {
            icon: PenTool,
            titulo: "Diseño UX/UI de la tienda",
            texto: "Diseñamos cada pantalla del catálogo y el checkout pensada para convertir.",
          },
          {
            icon: Code2,
            titulo: "Desarrollo e integración de pagos",
            texto: "Programamos la tienda y conectamos Mercado Pago y PayPal para que puedas cobrar.",
          },
          {
            icon: Rocket,
            titulo: "Revisión y lanzamiento",
            texto: "Ajustamos los últimos detalles junto a vos y publicamos tu tienda lista para vender.",
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
        bio="Diseñamos la arquitectura de tu tienda pensando en el volumen de ventas que vas a tener mañana, no solo en el de hoy: bases de datos robustas para tu catálogo y stock, y un código eficiente que soporta picos de tráfico sin caerse."
        skills={["React", "Next.js", "Node.js", "SQL"]}
        imagen="/leotroncoso.jpg"
      />

      <LandingFAQ
        acento="cyan"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de armar una tienda online"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Desde ahí cargás la información de tu catálogo, completás el onboarding con nuestro equipo y ves en tiempo real el progreso exacto del desarrollo de tu tienda.",
          },
          {
            pregunta: "¿Qué medios de pago va a aceptar mi tienda?",
            respuesta:
              "Integramos Mercado Pago como pasarela principal, la más usada en Argentina, con soporte para débito, crédito y cuotas. Si vendés al exterior, también podemos sumar PayPal u otra pasarela según tu caso.",
          },
          {
            pregunta: "¿El hosting, el mail y el mantenimiento están incluidos?",
            respuesta:
              "Sí. Tu tienda incluye hosting, mantenimiento, casillas de mail corporativo, soporte técnico y backups automáticos: no tenés que contratar ni administrar nada por tu cuenta.",
          },
          {
            pregunta: "¿Puedo pedir ajustes después de la entrega?",
            respuesta:
              "Sí. Establecemos instancias de revisión durante el desarrollo y garantizamos ajustes finales dentro del alcance definido en la etapa de onboarding, para que la tienda quede exactamente como la necesitás.",
          },
          {
            pregunta: "¿Trabajan con clientes de otros países?",
            respuesta:
              "Sí, construimos tiendas para marcas de toda Latinoamérica y del exterior. Nuestro Panel de Cliente y sistema de comunicación asincrónica permiten coordinar todo sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="cyan"
        titulo="¿Listo para tener una tienda que venda sin límites?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos qué productos vendés y te armamos la arquitectura exacta de tu tienda online."
        mensajeWhatsapp="¡Hola! Quiero cotizar una tienda online (eCommerce) para mi negocio 🚀"
        ctaLabel="Cotizar mi tienda online"
      />

      <Footer />
    </main>
  );
}
