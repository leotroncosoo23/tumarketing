import Navbar from "@/components/Navbar";
import AnuncioBanner from "@/components/AnuncioBanner";
import ServiciosCarousel from "@/components/ServiciosCarousel";
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
            <button className="bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#b8e600] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              Potenciá tu empresa hoy
            </button>
            <button className="px-8 py-4 rounded-full font-bold text-lg text-white border border-neutral-700 hover:bg-neutral-900 transition-colors">
              Ver casos de éxito
            </button>
          </div>

          {/* Mini franja de confianza para sumar energía sin agregar altura */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-500 border-t border-neutral-900 pt-6 w-full">
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

        {/* Columna Derecha: Tarjeta de Servicios (La "Magia") */}
        <div className="relative w-full">
          {/* Brillos de fondo para efecto 3D, con movimiento sutil */}
          <div className="absolute top-10 -right-10 w-64 h-64 bg-[#ccff00]/20 blur-[80px] rounded-full z-0 animate-float-slow"></div>
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-lime-600/20 blur-[60px] rounded-full z-0 animate-float-slow" style={{ animationDelay: "-3s" }}></div>

          {/* Insignia flotante */}
          <div className="absolute -top-6 -left-6 z-20 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce" style={{ animationDuration: "3s" }}>
            <span className="text-lg">🔥</span>
            <span className="text-white text-xs font-bold">+150 marcas confían en nosotros</span>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 transform transition-transform hover:-translate-y-2 duration-500">

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white text-xl font-bold">Nuestros Servicios</h3>
              <span className="bg-[#ccff00]/10 text-[#ccff00] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-[#ccff00]/20">
                Soluciones 360°
              </span>
            </div>
            
            <ul className="space-y-6">
              <li className="flex items-center gap-4 p-3 hover:bg-neutral-800/50 rounded-xl transition-colors">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">📱</div>
                <div>
                  <h4 className="text-white font-bold">Community Management</h4>
                  <p className="text-neutral-500 text-sm">Gestión estratégica de redes sociales.</p>
                </div>
              </li>
              
              <li className="flex items-center gap-4 p-3 hover:bg-neutral-800/50 rounded-xl transition-colors">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">🎨</div>
                <div>
                  <h4 className="text-white font-bold">Branding</h4>
                  <p className="text-neutral-500 text-sm">Identidad visual que enamora.</p>
                </div>
              </li>

              <li className="flex items-center gap-4 p-3 hover:bg-neutral-800/50 rounded-xl transition-colors">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">💻</div>
                <div>
                  <h4 className="text-white font-bold">Diseño Web</h4>
                  <p className="text-neutral-500 text-sm">Sitios optimizados para vender.</p>
                </div>
              </li>

              <li className="flex items-center gap-4 p-3 hover:bg-neutral-800/50 rounded-xl transition-colors">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">🚀</div>
                <div>
                  <h4 className="text-white font-bold">Ads & Pauta</h4>
                  <p className="text-neutral-500 text-sm">Campañas rentables en Meta y Google.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-[#ccff00] flex items-center justify-center font-bold text-[#ccff00]">
                +4M
              </div>
              <div>
                <p className="text-white font-bold">De views generadas</p>
                <p className="text-neutral-500 text-xs">Resultados comprobables 🎯</p>
              </div>
            </div>

          </div>
        </div>

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

      {/* --- NUEVA SECCIÓN: SERVICIOS DETALLADOS --- */}
      <section id="servicios" className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900 mt-12">
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Nuestros Servicios de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              Marketing Digital en Patagonia
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Como agencia de publicidad digital, estamos capacitados para llevar tu empresa a la cima de Internet y hacer crecer tus ventas. 
            Nuestras soluciones incluyen: Publicidad en Redes, Community Management, Diseño Web, Branding ¡y más!
          </p>
        </div>

        <ServiciosCarousel />
      </section>
      {/* --- NUEVA SECCIÓN: CARRUSEL DE IA --- */}
      <section className="py-24 border-t border-neutral-900 bg-neutral-950 relative overflow-hidden">
        
        {/* Textos de cabecera */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            La IA, en el corazón de <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
              nuestra estrategia
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl mx-auto mb-4">
            Combinamos IA generativa, agentes autónomos y automatización para crear soluciones que se adaptan a tu negocio, aprenden con cada interacción y generan resultados medibles desde el primer día.
          </p>
          <p className="text-white font-bold text-lg">
            La tecnología potencia el trabajo; el criterio estratégico es siempre humano.
          </p>
        </div>

        {/* Contenedor del Carrusel */}
        <div className="relative w-full flex overflow-hidden carousel-container">
          
          {/* Gradientes laterales para difuminar las tarjetas al entrar y salir (Efecto fade) */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>

          {/* Cinta animada (Marquee) */}
          <div className="flex animate-marquee gap-6 px-3">
            
            {/* 
              Mapeamos un array de 2 elementos para DUPLICAR la lista de logos. 
              Esto es el secreto para que el carrusel sea infinito y no tenga cortes.
            */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex gap-6 items-center">
                
                {/* Logo 1: n8n */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  <span className="text-white font-bold text-xl">n8n</span>
                </div>

                {/* Logo 2: Perplexity */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-[#22b8cd]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  <span className="text-white font-bold text-xl tracking-tight">perplexity</span>
                </div>

                {/* Logo 3: ElevenLabs */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <div className="flex gap-1 items-end h-6">
                    <div className="w-1.5 h-full bg-white rounded-full"></div>
                    <div className="w-1.5 h-4 bg-white rounded-full"></div>
                    <div className="w-1.5 h-6 bg-white rounded-full"></div>
                  </div>
                  <span className="text-white font-bold text-xl tracking-tight">ElevenLabs</span>
                </div>

                {/* Logo 4: Gemini */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12c-6.627 0-12-5.373-12-12 0 6.627-5.373 12-12 12 6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12z"></path></svg>
                  <span className="text-white font-bold text-xl">Gemini</span>
                </div>

                {/* Logo 5: Claude */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-[#d97757]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path></svg>
                  <span className="text-white font-bold text-xl font-serif">Claude</span>
                </div>

                {/* Logo 6: ChatGPT */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                  <span className="text-white font-bold text-xl">ChatGPT</span>
                </div>

                {/* Logo 7: HubSpot */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 px-8 py-5 rounded-2xl min-w-max hover:border-[#ccff00]/50 transition-colors">
                  <svg className="w-8 h-8 text-[#ff7a59]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="5" cy="17" r="2"></circle><path stroke="currentColor" strokeWidth="2" d="M14.5 10.5L17.5 8.5M9.5 13.5L6.5 15.5"></path></svg>
                  <span className="text-white font-bold text-xl tracking-tight">HubSpot</span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Estilos inyectados para la animación infinita */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            width: max-content;
            animation: infinite-scroll 35s linear infinite;
          }
          /* Pausa la animación si el usuario pasa el mouse por encima */
          .carousel-container:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}} />
      </section>
      {/* --- FIN SECCIÓN CARRUSEL DE IA --- */}
      {/* --- NUEVA SECCIÓN: ¿POR QUÉ ELEGIRNOS? --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Izquierda: Lista de Beneficios */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">
              ¿Por qué elegir a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-lime-500">
                TuMarketing?
              </span>
            </h2>

            <div className="space-y-8">
              
              {/* Beneficio 1 */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#ccff00] group-hover:border-[#ccff00]/50 transition-all shadow-[0_0_0_rgba(204,255,0,0)] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Estrategias a Medida</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    No usamos plantillas. Interpretamos las necesidades reales de tu marca y planificamos acciones digitales únicas para destacarte frente a tu competencia.
                  </p>
                </div>
              </div>

              {/* Beneficio 2 */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Enfoque en Resultados (ROI)</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Cuidamos tu presupuesto como si fuera nuestro. Optimizamos cada campaña para generar ventas concretas y un retorno de inversión comprobable.
                  </p>
                </div>
              </div>

              {/* Beneficio 3 */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#ccff00] group-hover:border-[#ccff00]/50 transition-all shadow-[0_0_0_rgba(204,255,0,0)] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Transparencia y Datos Claros</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Se acabaron las métricas vanidosas. Te enviamos reportes periódicos y fáciles de entender para que sepas exactamente qué está pasando con tu negocio.
                  </p>
                </div>
              </div>

              {/* Beneficio 4 */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#ccff00] group-hover:border-[#ccff00]/50 transition-all shadow-[0_0_0_rgba(204,255,0,0)] group-hover:shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Experiencia Comprobable</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Nuestros resultados hablan por nosotros. Con más de 4 millones de views generadas y múltiples casos de éxito, sabemos exactamente cómo escalar tu presencia online.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Columna Derecha: Ilustración / Dashboard Abstracto */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            
            {/* Brillos de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#ccff00]/20 blur-[100px] rounded-full z-0"></div>
            
            {/* Tarjeta Principal del Dashboard */}
            <div className="relative z-10 w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 shadow-2xl">
              
              {/* Cabecera de la tarjeta */}
              <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">Crecimiento Mensual</p>
                  <h3 className="text-white font-bold text-2xl">+184.5%</h3>
                </div>
                <div className="bg-[#ccff00]/10 text-[#ccff00] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                  Online
                </div>
              </div>

              {/* Gráfico de línea con flecha hacia arriba (SVG) */}
              <div className="relative w-full h-40 mb-6 flex items-end">
                
                {/* Cuadrícula decorativa de fondo (Líneas horizontales) */}
                <div className="absolute inset-0 flex flex-col justify-between z-0">
                  <div className="w-full border-t border-neutral-800/60 h-full"></div>
                  <div className="w-full border-t border-neutral-800/60 h-full"></div>
                  <div className="w-full border-t border-neutral-800/60 h-full"></div>
                  <div className="w-full border-t border-neutral-800/60"></div>
                </div>

                {/* Gráfico Vectorial */}
                <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                  {/* Gradiente verde brillante para el área debajo de la línea */}
                  <defs>
                    <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ccff00" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Área pintada (relleno) */}
                  <path 
                    d="M 0 130 C 100 120, 150 80, 250 90 C 320 95, 380 40, 400 20 L 400 150 L 0 150 Z" 
                    fill="url(#gradientGreen)" 
                  />
                  
                  {/* Línea principal del gráfico que sube */}
                  <path 
                    d="M 0 130 C 100 120, 150 80, 250 90 C 320 95, 380 40, 400 20" 
                    fill="none" 
                    stroke="#ccff00" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]"
                  />
                  
                  {/* Flecha en la punta */}
                  <polygon 
                    points="382 18, 400 20, 396 37" 
                    fill="#ccff00" 
                    className="drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]"
                  />
                  
                  {/* Puntos de datos intermedios en la línea */}
                  <circle cx="130" cy="107" r="4" fill="#171717" stroke="#ccff00" strokeWidth="3" className="drop-shadow-[0_0_5px_rgba(204,255,0,1)]" />
                  <circle cx="250" cy="90" r="4" fill="#171717" stroke="#ccff00" strokeWidth="3" className="drop-shadow-[0_0_5px_rgba(204,255,0,1)]" />
                </svg>

              </div>

              {/* Tarjetitas de métricas debajo del gráfico */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
                  <p className="text-neutral-500 text-xs mb-1">Nuevos Leads</p>
                  <p className="text-white font-bold text-lg">1,248</p>
                </div>
                <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
                  <p className="text-neutral-500 text-xs mb-1">Conversión</p>
                  <p className="text-[#ccff00] font-bold text-lg">12.4%</p>
                </div>
              </div>

              {/* Elemento flotante decorativo */}
              <div className="absolute -right-8 -top-8 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">ROI Positivo</p>
                    <p className="text-neutral-500 text-xs">Campaña Activa</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
      {/* --- FIN SECCIÓN ¿POR QUÉ ELEGIRNOS? --- */}
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
      {/* --- NUEVA SECCIÓN: CONTACTO --- */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 py-24">
        {/* Contenedor principal de 2 columnas con bordes redondeados y sombra */}
        <div className="grid grid-cols-1 lg:grid-cols-5 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
          
          {/* COLUMNA IZQUIERDA (Visual - Ocupa 2 espacios) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
            
            {/* Brillo verde de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              
              {/* Globo de chat estilo mensaje */}
              <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-3xl rounded-bl-none mb-12 shadow-lg relative">
                <p className="text-white text-xl md:text-2xl font-bold mb-3 leading-snug">
                  ¡Ya encontraste la agencia de Marketing Digital indicada!
                </p>
                <p className="text-[#ccff00] font-bold text-sm tracking-widest uppercase">
                  Cotizá ahora tu estrategia digital
                </p>
                
                {/* Triangulito del globo de chat (Hecho con bordes CSS) */}
                <div className="absolute -bottom-5 left-0 w-0 h-0 border-t-[20px] border-t-neutral-950 border-r-[20px] border-r-transparent filter drop-shadow-md"></div>
              </div>

              <div className="mt-auto">
                <p className="text-neutral-500 mb-4 text-sm font-bold uppercase tracking-wider">O escribinos directo:</p>
                <a href="#" className="inline-flex items-center gap-3 text-white font-bold text-lg hover:text-[#ccff00] transition-colors group">
                  {/* Ícono de WhatsApp */}
                  <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-full flex items-center justify-center group-hover:border-[#ccff00] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                  </div>
                  Chatear por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (Formulario - Ocupa 3 espacios) */}
          <div className="lg:col-span-3 bg-neutral-950 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Conversemos</h2>
            <p className="text-neutral-400 mb-10 text-lg">Estamos para ayudarte a conseguir nuevos clientes e incrementar las ventas.</p>

            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Nombre y Apellido <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all placeholder-neutral-600" placeholder="Juan Pérez" />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all placeholder-neutral-600" placeholder="juan@empresa.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Teléfono <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all placeholder-neutral-600" placeholder="+54 9 11 1234-5678" />
                </div>
                {/* Sitio Web */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Sitio web</label>
                  <input type="url" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all placeholder-neutral-600" placeholder="www.tuempresa.com" />
                </div>
              </div>

              {/* Selector de Empleados */}
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-neutral-300">Número de Empleados</label>
                <select className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Selecciona</option>
                  <option value="1-10">1 a 10 empleados</option>
                  <option value="11-50">11 a 50 empleados</option>
                  <option value="50+">Más de 50 empleados</option>
                </select>
                {/* Ícono de flechita para el select */}
                <div className="absolute right-5 top-[42px] pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Selector de Presupuesto */}
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-neutral-300">¿Cuál es tu presupuesto actual de marketing?</label>
                <select className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Selecciona</option>
                  <option value="bajo">Menos de $500 USD/mes</option>
                  <option value="medio">Entre $500 y $2000 USD/mes</option>
                  <option value="alto">Más de $2000 USD/mes</option>
                </select>
                <div className="absolute right-5 top-[42px] pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Botón de Enviar */}
              <button type="button" className="w-full bg-[#ccff00] text-black font-black text-lg py-5 rounded-xl hover:bg-[#b8e600] transition-transform hover:-translate-y-1 mt-6 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                Solicitar Cotización
              </button>
              
            </form>
          </div>

        </div>
      </section>
      {/* --- FIN SECCIÓN CONTACTO --- */}
      <Footer />
    </main>
  );
}