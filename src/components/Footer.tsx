import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Columna 1: Marca y Redes */}
          <div className="flex flex-col">
            <div className="text-3xl font-bold tracking-tighter mb-6">
              Tu<span className="text-[#ccff00]">Marketing</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-xs">
              Somos una agencia de Marketing Digital en la Patagonia dedicada a generar resultados concretos, medibles y escalables. Consultanos por tu estrategia digital.
            </p>

            <p className="text-white font-bold mb-4">¡Seguinos!</p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/tumarketingar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-[#ccff00] hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Tumarketingarg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-[#ccff00] hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Contacto */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:tumarketing@gmail.com"
                  className="flex items-start gap-3 text-neutral-400 hover:text-[#ccff00] transition-colors"
                >
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>tumarketing@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5492945527821"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-neutral-400 hover:text-[#ccff00] transition-colors"
                >
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>+54 9 2945 527821</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-neutral-400">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Trevelin, Chubut<br/>Patagonia, Argentina.</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg mb-6">Servicios</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">Inicio</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">Google & Meta Ads</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">Redes Sociales</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">Posicionamiento SEO</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">IA / GEO</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">E-commerce</Link></li>
              <li><Link href="/servicios" className="text-neutral-400 hover:text-[#ccff00] transition-colors text-sm">Diseño Web</Link></li>
            </ul>
          </div>

        </div>

        {/* Línea divisoria y Copyright */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">
            Copyright © 2026 TuMarketing. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-neutral-200 transition-colors">Términos y Condiciones</a>
            <a href="/politica-de-privacidad" className="hover:text-neutral-200 transition-colors">Política de Privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
