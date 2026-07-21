import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnuncioBanner from "@/components/AnuncioBanner";
import HeroVisual from "@/components/HeroVisual";
import ElProblema from "@/components/ElProblema";
import NuestrosServicios from "@/components/NuestrosServicios";
import AutoridadConfianza from "@/components/AutoridadConfianza";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      <AnuncioBanner />

      <section className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">

        {/* Resplandor ambiental de fondo, detrás de toda la portada */}
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#ccff00]/10 blur-[120px] rounded-full z-0 pointer-events-none animate-float-slow"></div>

        {/* Columna Izquierda: Pitch de la Agencia */}
        <div className="flex flex-col items-start text-left z-10">
          <span className="text-[#ccff00] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
            Agencia en la Patagonia
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.05] tracking-tighter">
            La Agencia de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              Marketing Digital
            </span> <br />
            que acelerará tu marca.
          </h1>

          <p className="text-neutral-400 text-lg mb-8 max-w-lg leading-relaxed">
            Convertimos marcas en negocios digitales reales. Brindamos soluciones de marketing estratégico 360° adaptadas 100% a las necesidades de tu empresa.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
            <Link
              href="/servicios"
              className="bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#b8e600] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
            >
              Potenciá tu empresa hoy
            </Link>
            <Link
              href="/#resultados"
              className="px-8 py-4 rounded-full font-bold text-lg text-white border border-neutral-700 hover:bg-neutral-900 transition-colors"
            >
              Ver casos de éxito
            </Link>
          </div>

          {/* Mini franja de confianza para sumar energía sin agregar altura */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-400 border-t border-neutral-900 pt-6 w-full">
            <span className="flex items-center gap-2">
              <span className="text-[#ccff00] font-black text-lg">+4M</span> views generadas
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#ccff00] font-black text-lg">+150</span> marcas atendidas
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#ccff00] font-black text-lg">360°</span> soluciones digitales
            </span>
          </div>
        </div>

        {/* Columna Derecha: Hero Visual abstracto (métricas y crecimiento) */}
        <HeroVisual />

      </section>

      {/* Animación de flotación lenta para los brillos de fondo de la portada */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}} />

      {/* --- SECCIÓN: EL PROBLEMA --- */}
      <ElProblema />

      {/* --- SECCIÓN: LA SOLUCIÓN / NUESTROS SERVICIOS --- */}
      <NuestrosServicios />

      {/* --- SECCIÓN: AUTORIDAD Y CONFIANZA --- */}
      <AutoridadConfianza />

      {/* --- NUEVA SECCIÓN: PREGUNTAS FRECUENTES (FAQ) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">Frecuentes</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Nuestra Agencia de Marketing Digital responde a las dudas más habituales de nuestros clientes:
          </p>
        </div>

        {/* Grilla de 2 columnas para las preguntas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col gap-6">
            
            {/* Pregunta 1 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Cómo funciona una agencia de marketing en la Patagonia?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                Conocemos tanto el mercado local como el panorama digital global. Nos integramos como un socio estratégico de tu empresa, analizando tus objetivos y ejecutando campañas que maximizan tu inversión sin importar dónde estén tus clientes.
              </div>
            </details>

            {/* Pregunta 2 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Cuándo es momento de contratar una agencia?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                El momento ideal es cuando notas que tus ventas digitales se han estancado, cuando no tienes tiempo para gestionar tus redes y pautas de forma profesional, o cuando quieres escalar tu negocio al siguiente nivel pero no sabes qué estrategia implementar.
              </div>
            </details>

            {/* Pregunta 3 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Qué soluciones rápidas me trae una agencia?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                A corto plazo, optimizamos tu presupuesto publicitario para frenar el gasto ineficiente. Lanzamos campañas de Ads orientadas a conversión inmediata y reestructuramos tus canales digitales para que empiecen a captar leads calificados desde la primera semana.
              </div>
            </details>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="flex flex-col gap-6">
            
            {/* Pregunta 4 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Cómo está conformado el equipo de TuMarketing?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                Somos un equipo multidisciplinario compuesto por especialistas en Growth Marketing, Media Buyers (expertos en pauta), diseñadores UX/UI, desarrolladores web y creadores de contenido. Abordamos cada proyecto desde todos los ángulos.
              </div>
            </details>

            {/* Pregunta 5 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Cómo sé qué servicio me conviene más?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                No tienes que adivinarlo. Nuestro primer paso siempre es una auditoría y reunión inicial donde evaluamos el estado actual de tu marca. A partir de ahí, armamos una propuesta a medida recomendando solo los servicios que realmente te darán retorno.
              </div>
            </details>

            {/* Pregunta 6 */}
            <details className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl open:bg-neutral-900/80 open:border-[#ccff00]/50 transition-all duration-300">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-lg text-white">
                ¿Realizan un seguimiento de la estrategia?
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#ccff00]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 pt-4 mt-2">
                Absolutamente. El marketing digital se basa en datos. Realizamos un monitoreo diario de las métricas, optimizamos las campañas en tiempo real y te enviamos informes periódicos para que veas el rendimiento de tu inversión de forma transparente.
              </div>
            </details>

          </div>
        </div>
      </section>
      {/* --- FIN SECCIÓN PREGUNTAS FRECUENTES --- */}
      {/* --- SECCIÓN: NEWSLETTER --- */}
      <NewsletterSection />
      {/* --- FIN SECCIÓN NEWSLETTER --- */}
      <Footer />
    </main>
  );
}