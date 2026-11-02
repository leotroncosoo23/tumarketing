import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Política de Privacidad | TuMarketing",
  description: "Qué datos recopila TuMarketing, para qué los usa y cuáles son tus derechos.",
};

export default function PoliticaDePrivacidad() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Política de Privacidad</h1>
        <p className="text-neutral-500 text-sm mb-10">Última actualización: 2 de noviembre de 2026</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Qué datos recopilamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Si comprás un producto: tu nombre, email y WhatsApp. No recibimos los datos de tu tarjeta, que cargás en Mercado Pago o PayPal.</li>
              <li>Si descargás un recurso o te suscribís: tu nombre y tu email.</li>
              <li>Si agendás una llamada: los datos que cargás en el calendario.</li>
              <li>Si iniciás sesión o contratás un servicio: tu nombre, tu email y el estado y progreso del servicio.</li>
              <li>Datos de uso del sitio, a través de herramientas de medición como Google Analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Para qué los usamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Procesar tu compra y enviarte el acceso a lo que compraste.</li>
              <li>Darte acceso a la plataforma de usuarios y a los servicios que contrataste.</li>
              <li>Mostrarte el estado y progreso de cada servicio contratado.</li>
              <li>Enviarte novedades, promociones o contenido nuevo si te suscribiste o descargaste un recurso.</li>
              <li>Contactarte por WhatsApp o email si hacés una consulta o una compra.</li>
              <li>Entender cómo se usa el sitio para mejorarlo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Con quién los compartimos</h2>
            <p>
              No vendemos tus datos. Usamos proveedores externos para operar el sitio, que los procesan para prestarnos
              ese servicio: Supabase (autenticación y base de datos), Resend (envío de emails), Mercado Pago y PayPal
              (pagos), Cal.com (agenda), Google Analytics (medición) y Vercel (alojamiento). Algunos pueden estar fuera
              de Argentina. También podemos compartirlos si una autoridad competente lo exige.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus derechos</h2>
            <p>
              Según la Ley 25.326 de Protección de Datos Personales, podés pedirnos acceder a tus datos, corregirlos o
              eliminarlos, y darte de baja de nuestros emails en cualquier momento. Escribinos por WhatsApp o al email de
              contacto que figura en el pie de página. La Agencia de Acceso a la Información Pública es el organismo de
              control de esta ley y recibe los reclamos relacionados con ella.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Más información</h2>
            <p>
              Las condiciones de compra y de uso del sitio están en nuestros{" "}
              <Link href="/terminos-y-condiciones" className="text-[#ccff00] hover:underline">
                Términos y Condiciones
              </Link>
              .
            </p>
          </section>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-[#ccff00] hover:underline mt-12 text-sm font-bold">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
