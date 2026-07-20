"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { iniciales } from '@/lib/iniciales';
import { CURSOS_HABILITADO } from '@/lib/feature-flags';
import { useCart } from '@/lib/CartContext';
import { SERVICIOS_NAV } from '@/lib/servicios-nav';
import { ACCENTS } from '@/components/landings/accents';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CartDrawer from '@/components/CartDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const { cantidadItems, toggleCarrito } = useCart();

  // Este efecto revisa si el usuario bajó más de 20 píxeles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Muestra el usuario logueado y se mantiene al día con login/logout.
  // También trae el rol para saber si "Plataforma" tiene que llevar al
  // panel de admin o al portal de alumnos.
  useEffect(() => {
    const cargarUsuario = async (user: User | null) => {
      setUsuario(user);
      if (!user) {
        setRol(null);
        return;
      }
      const { data } = await supabase.from("usuarios").select("rol").eq("id", user.id).maybeSingle();
      setRol(data?.rol ?? null);
    };

    supabase.auth.getUser().then(({ data }) => cargarUsuario(data.user));

    const { data: subscripcion } = supabase.auth.onAuthStateChange((_event, session) => {
      cargarUsuario(session?.user ?? null);
    });

    return () => subscripcion.subscription.unsubscribe();
  }, []);

  const destinoPlataforma = rol === "admin" ? "/admin/dashboard" : "/alumnos";

  // Cerrar el menú cuando se hace clic en un enlace
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsResourcesOpen(false);
    setIsServiciosOpen(false);
  };

  return (
    <>
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
      isScrolled
        ? "py-3 bg-neutral-950/90 backdrop-blur-md border-neutral-800 shadow-xl"
        : "py-6 bg-transparent border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className={`font-bold tracking-tighter transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>
          <Link href="/" onClick={handleLinkClick}>
            Tu<span className="text-[#ccff00]">Marketing</span>
          </Link>
        </div>
        
        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {/* Mega-menu de Servicios */}
          <div className="relative group py-4">
            <button className="flex items-center gap-1 hover:text-[#ccff00] transition-colors">
              <Link href="/servicios">Servicios</Link>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[560px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6">
              <div className="grid grid-cols-2 gap-8">
                {SERVICIOS_NAV.map(({ sector, acento, items }) => (
                  <div key={sector}>
                    <p className={`${ACCENTS[acento].text} text-xs font-bold uppercase tracking-wider mb-3`}>
                      {sector}
                    </p>
                    <div className="space-y-1">
                      {items.map(({ titulo, href, descripcion, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ACCENTS[acento].text}`} strokeWidth={1.75} />
                          <span>
                            <span className="block font-semibold text-sm">{titulo}</span>
                            <span className="block text-xs text-neutral-500">{descripcion}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-800 mt-4 pt-4">
                <Link href="/servicios" className="text-sm font-bold text-white hover:text-[#ccff00] transition-colors">
                  Ver todos los servicios →
                </Link>
              </div>
            </div>
          </div>

          {CURSOS_HABILITADO && (
            <Link href="/cursos" className="hover:text-[#ccff00] transition-colors">Cursos</Link>
          )}
          
          {/* Menú Desplegable de Recursos */}
          <div className="relative group py-4">
            <button className="flex items-center gap-1 hover:text-[#ccff00] transition-colors">
              <Link href="/recursos">Recursos</Link> 
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-0 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
              <Link href="/blog" className="px-5 py-3 hover:bg-neutral-800 hover:text-[#ccff00] transition-colors">Blog</Link>
              <Link href="/guias" className="px-5 py-3 hover:bg-neutral-800 hover:text-[#ccff00] transition-colors">Guías</Link>
              <Link href="/newsletter" className="px-5 py-3 hover:bg-neutral-800 hover:text-[#ccff00] transition-colors">Newsletter</Link>
            </div>
          </div>
          
          <Link href="/nosotros" className="hover:text-[#ccff00] transition-colors">Nosotros</Link>
        </div>

        {/* Botones Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleCarrito}
            aria-label="Abrir carrito de compras"
            className="relative p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 21a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
              />
            </svg>
            {cantidadItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ccff00] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </button>
          {usuario ? (
            <Link href={destinoPlataforma} className="flex items-center gap-3 group">
              <span className="w-9 h-9 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-xs font-bold text-[#ccff00] overflow-hidden shrink-0">
                {usuario.user_metadata?.avatar_url ? (
                  <img src={usuario.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  iniciales(usuario.user_metadata?.full_name || usuario.email || "?")
                )}
              </span>
              <span className={`bg-[#ccff00] text-black rounded-full font-bold group-hover:bg-[#b8e600] transition-all ${
                isScrolled ? "px-5 py-2 text-sm" : "px-6 py-2.5"
              }`}>
                Plataforma
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-[#ccff00] transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/servicios" className={`bg-[#ccff00] text-black rounded-full font-bold hover:bg-[#b8e600] transition-all ${
                isScrolled ? "px-5 py-2 text-sm" : "px-6 py-2.5"
              }`}>
                Empecemos
              </Link>
            </>
          )}
        </div>

        {/* Carrito + Hamburguesa Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleCarrito}
            aria-label="Abrir carrito de compras"
            className="relative p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 21a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
              />
            </svg>
            {cantidadItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ccff00] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-neutral-900/50 rounded-lg transition-colors"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isMobileMenuOpen ? "max-h-screen border-t border-neutral-800" : "max-h-0"
      }`}>
        <div className={`bg-neutral-950/95 backdrop-blur-md px-6 py-4 space-y-3 transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0"
        }`}>
          
          {/* Menú desplegable Servicios Mobile */}
          <div>
            <button
              onClick={() => setIsServiciosOpen(!isServiciosOpen)}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-900 hover:text-[#ccff00] rounded-lg transition-colors font-medium"
            >
              Servicios
              <svg className={`w-4 h-4 transition-transform ${isServiciosOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isServiciosOpen ? "max-h-[32rem]" : "max-h-0"}`}>
              <div className="bg-neutral-900/50 rounded-lg mt-2 space-y-4 px-4 py-3">
                {SERVICIOS_NAV.map(({ sector, acento, items }) => (
                  <div key={sector}>
                    <p className={`${ACCENTS[acento].text} text-xs font-bold uppercase tracking-wider mb-2`}>
                      {sector}
                    </p>
                    <div className="space-y-1">
                      {items.map(({ titulo, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 py-2 pl-2 text-sm hover:text-[#ccff00] transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                          {titulo}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/servicios"
                  onClick={handleLinkClick}
                  className="block pt-2 border-t border-neutral-800 text-sm font-bold hover:text-[#ccff00] transition-colors"
                >
                  Ver todos los servicios →
                </Link>
              </div>
            </div>
          </div>

          {CURSOS_HABILITADO && (
            <Link
              href="/cursos"
              onClick={handleLinkClick}
              className="block py-3 px-4 hover:bg-neutral-900 hover:text-[#ccff00] rounded-lg transition-colors font-medium"
            >
              Cursos
            </Link>
          )}

          {/* Menú desplegable Recursos Mobile */}
          <div>
            <button 
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-900 hover:text-[#ccff00] rounded-lg transition-colors font-medium"
            >
              Recursos
              <svg className={`w-4 h-4 transition-transform ${isResourcesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {/* Subitems de Recursos */}
            <div className={`overflow-hidden transition-all duration-300 ${isResourcesOpen ? "max-h-40" : "max-h-0"}`}>
              <div className="bg-neutral-900/50 rounded-lg mt-2 space-y-1 px-4 py-2">
                <Link 
                  href="/blog"
                  onClick={handleLinkClick}
                  className="block py-2 pl-4 text-sm hover:text-[#ccff00] transition-colors"
                >
                  Blog
                </Link>
                <Link 
                  href="/guias"
                  onClick={handleLinkClick}
                  className="block py-2 pl-4 text-sm hover:text-[#ccff00] transition-colors"
                >
                  Guías
                </Link>
                <Link 
                  href="/newsletter"
                  onClick={handleLinkClick}
                  className="block py-2 pl-4 text-sm hover:text-[#ccff00] transition-colors"
                >
                  Newsletter
                </Link>
              </div>
            </div>
          </div>

          <Link 
            href="/nosotros"
            onClick={handleLinkClick}
            className="block py-3 px-4 hover:bg-neutral-900 hover:text-[#ccff00] rounded-lg transition-colors font-medium"
          >
            Nosotros
          </Link>

          {/* Divider */}
          <div className="border-t border-neutral-800 my-2"></div>

          {/* Login y CTA */}
          {usuario ? (
            <Link
              href={destinoPlataforma}
              onClick={handleLinkClick}
              className="flex items-center gap-3 w-full py-3 px-4 hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-xs font-bold text-[#ccff00] overflow-hidden shrink-0">
                {usuario.user_metadata?.avatar_url ? (
                  <img src={usuario.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  iniciales(usuario.user_metadata?.full_name || usuario.email || "?")
                )}
              </span>
              <span className="bg-[#ccff00] text-black rounded-lg font-bold py-2 px-4 text-sm">
                Plataforma
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="block w-full text-left py-3 px-4 hover:bg-neutral-900 hover:text-[#ccff00] rounded-lg transition-colors font-medium text-sm"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/servicios"
                onClick={handleLinkClick}
                className="block w-full text-center bg-[#ccff00] text-black rounded-lg font-bold py-3 px-4 hover:bg-[#b8e600] transition-all text-sm mt-2"
              >
                Empecemos
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
    <CartDrawer />
    <WhatsAppFloat />
    </>
  );
}