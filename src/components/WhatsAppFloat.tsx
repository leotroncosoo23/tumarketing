"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WhatsAppFloat() {
  const [whatsapp, setWhatsapp] = useState("");
  const [ocultoPorSeccion, setOcultoPorSeccion] = useState(false);

  useEffect(() => {
    supabase
      .from("configuracion")
      .select("whatsapp_numero")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("[WhatsAppFloat] No pudimos leer 'configuracion':", error.code, error.message);
          return;
        }
        console.log("[WhatsAppFloat] whatsapp_numero:", data?.whatsapp_numero);
        setWhatsapp(data?.whatsapp_numero || "");
      });
  }, []);

  // Algunas secciones (ej. el CTA final con su propio botón de WhatsApp)
  // marcan un elemento con data-oculta-whatsapp-flotante para evitar que el
  // botón flotante se superponga con un botón de WhatsApp propio de la página.
  useEffect(() => {
    const elementos = document.querySelectorAll("[data-oculta-whatsapp-flotante]");
    if (elementos.length === 0) return;

    const interseccionesActivas = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            interseccionesActivas.add(entry.target);
          } else {
            interseccionesActivas.delete(entry.target);
          }
        });
        setOcultoPorSeccion(interseccionesActivas.size > 0);
      },
      { threshold: 0.2 }
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const numeroLimpio = whatsapp.replace(/\D/g, "");
  // Sin número cargado en Configuración todavía: no mostramos un botón roto.
  if (!numeroLimpio) return null;

  const mensaje = encodeURIComponent("¡Hola! Tengo una consulta sobre los cursos y la plataforma 🙋");
  const link = `https://wa.me/${numeroLimpio}?text=${mensaje}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-all duration-300 ${
        ocultoPorSeccion ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      <svg className="relative w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
      </svg>
    </a>
  );
}
