import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PoliticaDePrivacidad() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28 pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Política de Privacidad</h1>
        <p className="text-neutral-500 text-sm mb-10">Última actualización: {new Date().toLocaleDateString("es-AR")}</p>

        <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm rounded-2xl p-5 mb-10">
          ⚠️ Este texto es una plantilla genérica de referencia, no un documento legal redactado por un abogado.
          Antes de publicar el sitio, hacé que un profesional lo revise y lo adapte a tu operación real y a la
          normativa vigente (en Argentina, la Ley 25.326 de Protección de Datos Personales).
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Qué datos recopilamos</h2>
            <p>
              Cuando iniciás sesión con Google, recibimos tu nombre y tu dirección de email. Si te inscribís en un
              curso, guardamos tu progreso dentro de ese curso. Si aceptás recibir novedades, guardamos tu email en
              nuestra lista de novedades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Para qué los usamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Darte acceso a la plataforma de alumnos y a los cursos en los que te inscribiste.</li>
              <li>Mostrarte tu progreso dentro de cada curso.</li>
              <li>Enviarte novedades, promociones o contenido nuevo, solo si aceptaste recibirlas.</li>
              <li>Contactarte por WhatsApp o email si hacés una consulta o una compra.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Con quién los compartimos</h2>
            <p>
              No vendemos tus datos. Usamos proveedores externos para operar el sitio (Supabase para
              autenticación y base de datos, Resend para el envío de emails) que procesan tus datos únicamente
              para prestarnos ese servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus derechos</h2>
            <p>
              Podés pedirnos en cualquier momento que te demos de baja del newsletter, o que te expliquemos,
              corrijamos o eliminemos los datos que tenemos sobre vos, escribiéndonos por WhatsApp o al email de
              contacto que figura en el pie de página.
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
