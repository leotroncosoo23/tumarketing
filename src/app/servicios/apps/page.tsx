"use client";

import { Database, Workflow, LayoutDashboard, Cpu, ClipboardList, RefreshCcw, ServerCrash, EyeOff, PhoneCall, Layers, Rocket, GraduationCap, ShieldCheck, Puzzle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingHero from "@/components/landings/LandingHero";
import LandingProblema from "@/components/landings/LandingProblema";
import LandingSolucion from "@/components/landings/LandingSolucion";
import LandingFeatures from "@/components/landings/LandingFeatures";
import LandingSocialProofTecnico from "@/components/landings/LandingSocialProofTecnico";
import LandingComparativa from "@/components/landings/LandingComparativa";
import LandingProceso from "@/components/landings/LandingProceso";
import LandingPerfil from "@/components/landings/LandingPerfil";
import LandingFAQ from "@/components/landings/LandingFAQ";
import LandingCTA from "@/components/landings/LandingCTA";

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />

      <LandingHero
        acento="cyan"
        mockup="dashboard"
        kicker="Software · Apps y Sistemas"
        tituloPre="Software a Medida que"
        tituloDestacado="Automatiza"
        tituloPost="tu Negocio"
        subtitulo="Sistemas de gestión, paneles internos e integraciones a medida para que tu operación deje de depender de planillas y procesos manuales."
        ctaLabel="Cotizar mi sistema"
        ctaHref="#cotizar"
      />

      <LandingProblema
        acento="cyan"
        eyebrow="El problema real"
        titulo="Cada vez que tu negocio crece, el caos operativo crece con él"
        puntos={[
          { icon: ClipboardList, texto: "Seguís usando Excel y WhatsApp para gestionar clientes, stock o turnos." },
          { icon: RefreshCcw, texto: "Hay tareas repetitivas que te consumen horas todos los meses." },
          { icon: ServerCrash, texto: "El proceso manual colapsa apenas aumenta el volumen de trabajo." },
          { icon: EyeOff, texto: "No tenés visibilidad en tiempo real de lo que está pasando en tu operación." },
        ]}
      />

      <LandingSolucion
        acento="cyan"
        mockup="dashboard"
        eyebrow="La solución"
        titulo="Un sistema propio para tu proceso exacto"
        descripcion="Programamos herramientas a medida que reemplazan las planillas sueltas por una base de datos centralizada y procesos automáticos."
        items={[
          "Sistemas de gestión a medida (clientes, stock, turnos)",
          "Automatización de tareas repetitivas y notificaciones",
          "Integraciones con plataformas de pago, envíos y correo",
          "Paneles con datos en tiempo real para decidir con información real",
        ]}
      />

      <LandingFeatures
        acento="cyan"
        titulo="Herramientas propias para escalar sin fricción"
        subtitulo="Ingeniería de software aplicada a resultados comerciales"
        items={[
          {
            icon: LayoutDashboard,
            titulo: "Apps y Paneles a Medida",
            texto:
              "Aplicaciones web pensadas para tu proceso exacto: portales de clientes, paneles internos o herramientas propias para tu equipo.",
          },
          {
            icon: Database,
            titulo: "Sistemas de Gestión",
            texto:
              "Olvidate de los Excel interminables. Creamos bases de datos robustas (SQL) para gestionar tu stock, clientes o turnos en tiempo real.",
          },
          {
            icon: Workflow,
            titulo: "Integraciones y Automatización",
            texto:
              "Conectamos tu sistema con plataformas de pago, envíos y correos automáticos para que tu negocio funcione en piloto automático.",
          },
        ]}
      />

      <LandingSocialProofTecnico
        acento="cyan"
        titulo="Por qué confiar tu sistema a este equipo"
        subtitulo="Sin casos de software inventados: esto es lo que sí podemos mostrar."
        credenciales={[
          {
            icon: Puzzle,
            titulo: "Automatizaciones reales",
            texto: "Webhooks de Mercado Pago y PayPal ya corriendo en producción, procesando pagos sin intervención manual.",
          },
          {
            icon: GraduationCap,
            titulo: "Formación universitaria",
            texto: "Analista programador con formación académica en arquitectura de software y bases de datos.",
          },
          {
            icon: ShieldCheck,
            titulo: "Stack en producción",
            texto: "Node.js, SQL y React sosteniendo nuestra propia plataforma con paneles de cliente y de administrador.",
          },
        ]}
      />

      <LandingComparativa
        acento="cyan"
        titulo="¿Procesos sueltos o un sistema propio?"
        subtitulo="Lo que cuesta seguir operando a mano versus automatizar de una vez."
        malaEtiqueta="Herramientas Sueltas"
        malaSubEtiqueta="Excel, WhatsApp, planillas"
        malaPuntos={[
          { label: "Datos", texto: "Información dispersa entre archivos y chats distintos." },
          { label: "Errores", texto: "Carga manual propensa a equivocaciones costosas." },
          { label: "Tiempo", texto: "Horas perdidas todos los meses en tareas repetitivas." },
          { label: "Escala", texto: "El proceso colapsa apenas crece el volumen." },
        ]}
        buenaEtiqueta="Sistema a Medida"
        buenaSubEtiqueta="Node.js, SQL, integraciones"
        buenaPuntos={[
          { label: "Datos", texto: "Toda la información centralizada en una sola base." },
          { label: "Errores", texto: "Validaciones automáticas que evitan cargas incorrectas." },
          { label: "Tiempo", texto: "Tareas repetitivas resueltas solas, sin intervención manual." },
          { label: "Escala", texto: "Arquitectura pensada para acompañar el crecimiento del negocio." },
        ]}
      />

      <LandingProceso
        acento="cyan"
        titulo="De la idea al sistema funcionando, en 3 pasos"
        subtitulo="Sin vueltas ni procesos eternos"
        pasos={[
          {
            icon: PhoneCall,
            titulo: "Llamada de diagnóstico",
            texto: "Mapeamos tu proceso actual y detectamos qué tareas conviene automatizar primero.",
          },
          {
            icon: Layers,
            titulo: "Diseño y desarrollo",
            texto: "Programamos el sistema y sus integraciones, revisando el avance junto a vos en cada etapa.",
          },
          {
            icon: Rocket,
            titulo: "Lanzamiento y automatización",
            texto: "Ponemos el sistema en marcha con las automatizaciones activas desde el primer día de uso.",
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
        bio="Enfocado en el desarrollo Full Stack y la escalabilidad. Se encarga de diseñar la arquitectura, estructurar bases de datos y escribir código limpio para que el motor de tu sistema rinda al máximo sin limitaciones técnicas."
        skills={["React", "Next.js", "Node.js", "SQL"]}
        imagen="/leo-nosotros.png"
      />

      <LandingFAQ
        acento="cyan"
        titulo="Preguntas frecuentes"
        subtitulo="Lo que más nos preguntan antes de automatizar un proceso"
        items={[
          {
            pregunta: "¿Cómo es el proceso una vez que contrato el servicio?",
            respuesta:
              "Al confirmar tu pago, el sistema te crea automáticamente un usuario en nuestro Panel de Cliente exclusivo. Desde ahí completás el onboarding con nuestro equipo y ves en tiempo real el progreso exacto del desarrollo de tu sistema.",
          },
          {
            pregunta: "¿Qué medios de pago aceptan?",
            respuesta:
              "Todos los pagos se procesan a través de MercadoPago: podés pagar con saldo en cuenta, débito o tarjeta de crédito, aprovechando las cuotas disponibles. Si estás fuera de Argentina, escribinos por WhatsApp para coordinar otra forma de pago.",
          },
          {
            pregunta: "¿Puedo pedir ajustes después de la entrega?",
            respuesta:
              "Sí. Establecemos instancias de revisión durante el desarrollo y garantizamos ajustes finales dentro del alcance definido en la etapa de onboarding, para que el sistema resuelva exactamente el problema que tenías.",
          },
          {
            pregunta: "¿Trabajan con clientes de otros países?",
            respuesta:
              "Sí, desarrollamos sistemas para negocios de toda Latinoamérica y del exterior, coordinando todo a través de nuestro Panel de Cliente sin fricciones de husos horarios.",
          },
        ]}
      />

      <LandingCTA
        acento="cyan"
        titulo="¿Listo para llevar tu operación al siguiente nivel?"
        subtitulo="Agendá una consultoría gratuita de 15 minutos. Contanos qué proceso querés automatizar y te armamos la arquitectura exacta del sistema que necesitás."
        mensajeWhatsapp="¡Hola! Quiero cotizar una app o sistema a medida para mi negocio 🚀"
        ctaLabel="Cotizar mi sistema"
      />

      <Footer />
    </main>
  );
}
