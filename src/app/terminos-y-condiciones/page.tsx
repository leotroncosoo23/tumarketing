import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRECIO_LANZAMIENTO, PRECIO_LANZAMIENTO_ARS_TEXTO } from "@/app/de-creador-a-dueno/precios";

export const metadata: Metadata = {
  title: "Términos y Condiciones | TuMarketing",
  description: "Condiciones de uso del sitio, de los servicios de TuMarketing y de la compra de De Creador/a a Dueño/a.",
};

const EMAIL = "tumarketing@gmail.com";
const WHATSAPP = "https://wa.me/5492945527821";
const WHATSAPP_ARREPENTIMIENTO = `${WHATSAPP}?text=${encodeURIComponent(
  "Hola, quiero ejercer mi derecho de arrepentimiento sobre mi compra. Mi nombre y email de compra son: "
)}`;

function Seccion({ id, titulo, children }: { id?: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-3 text-xl font-bold text-white">{titulo}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function TerminosYCondiciones() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950 pt-28 font-sans text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="mb-4 text-4xl font-black tracking-tight">Términos y Condiciones</h1>
        <p className="mb-10 text-sm text-neutral-500">Última actualización: 2 de noviembre de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-300">
          <Seccion titulo="1. Quiénes somos">
            <p>
              TuMarketing es una agencia de marketing digital con base en Trevelin, Chubut, Argentina. Estos términos
              regulan el uso de este sitio, la contratación de nuestros servicios y la compra de nuestros productos
              digitales. Al usar el sitio o comprar, los aceptás. Si no estás de acuerdo, te pedimos que no lo hagas.
            </p>
          </Seccion>

          <Seccion titulo="2. Servicios de la agencia">
            <p>
              Ofrecemos community management, pauta en Meta y Google y desarrollo web y de apps. La asesoría 1:1 de 15
              minutos es gratuita y no te obliga a contratar nada.
            </p>
            <p>
              Cada servicio se contrata mediante una propuesta personalizada, que define el alcance, los entregables, los
              plazos y el precio. Si la propuesta contradice estos términos, prevalece la propuesta.
            </p>
            <p>
              La inversión publicitaria no está incluida en nuestros honorarios: la pagás directamente a Meta o Google, y
              esas plataformas aplican sus propias condiciones.
            </p>
          </Seccion>

          <Seccion titulo="3. Resultados">
            <p>
              Las métricas y los casos que mostramos son resultados reales de nuestros clientes, pero no son una promesa
              de que vayas a obtener los mismos. Los resultados dependen de tu rubro, tu mercado, tu inversión y factores
              que no controlamos, como los algoritmos de cada plataforma.
            </p>
          </Seccion>

          <Seccion titulo="4. Compra de “De Creador/a a Dueño/a”">
            <p>
              Es un producto digital de pago único, sin mensualidades. El precio vigente es de USD {PRECIO_LANZAMIENTO} por
              PayPal o ${PRECIO_LANZAMIENTO_ARS_TEXTO} ARS por Mercado Pago. Tu banco o la plataforma de pago pueden sumar
              impuestos o recargos propios.
            </p>
            <p>
              Los pagos se procesan en las páginas de Mercado Pago y PayPal: nunca recibimos los datos de tu tarjeta.
            </p>
            <p>
              Cuando el pago se acredita, te enviamos por email el acceso a la carpeta con el material. Por eso es
              importante que cargues bien tu email. Si no te llega, revisá el spam o escribinos. Los pagos en efectivo
              pueden demorar en acreditarse.
            </p>
            <p>
              El acceso no vence. Si el material cambia de lugar, te enviaremos el nuevo acceso al email de tu compra.
            </p>
          </Seccion>

          <Seccion id="arrepentimiento" titulo="5. Botón de arrepentimiento y devoluciones">
            <p>
              Si sos consumidor, podés revocar tu compra online dentro de los 10 días corridos desde que la hiciste o
              recibiste el producto, lo último que ocurra, sin dar explicaciones (artículo 34 de la Ley 24.240 y artículo
              1110 del Código Civil y Comercial).
            </p>
            <p>
              La ley prevé que este derecho no aplica a archivos digitales suministrados por vía electrónica que se pueden
              descargar o reproducir de inmediato para uso permanente (artículo 1116 del Código Civil y Comercial). Por eso,
              una vez que accediste al material de “De Creador/a a Dueño/a”, la revocación puede no corresponder.
            </p>
            <p>
              Siempre te devolvemos el dinero si te cobramos dos veces por la misma compra, o si pagaste y no pudimos
              entregarte el acceso. El reintegro se hace por el mismo medio de pago.
            </p>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
              <p className="mb-3 font-bold text-white">¿Querés arrepentirte de tu compra?</p>
              <p className="mb-4">Escribinos con tu nombre y el email de la compra, y te respondemos con la gestión de tu pedido.</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_ARREPENTIMIENTO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#ccff00] px-5 py-2.5 font-bold text-black transition-colors hover:bg-[#b8e600]"
                >
                  Botón de arrepentimiento
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent("Botón de arrepentimiento")}`}
                  className="rounded-full border border-neutral-700 px-5 py-2.5 font-bold transition-colors hover:border-white"
                >
                  Enviar email
                </a>
              </div>
            </div>
          </Seccion>

          <Seccion titulo="6. Propiedad intelectual">
            <p>
              Los textos, diseños, videos, plantillas y materiales de este sitio y de nuestros productos son de TuMarketing
              o se usan con autorización de sus titulares. Al comprar un producto digital recibís una licencia personal para
              usarlo en tu negocio. No podés revenderlo, publicarlo ni compartir el material o su link de acceso con terceros.
            </p>
            <p>
              Los videos y las capturas del portfolio pertenecen a sus respectivas marcas y se muestran como muestra de
              nuestro trabajo.
            </p>
          </Seccion>

          <Seccion titulo="7. Recursos gratuitos">
            <p>
              Las guías y recursos gratuitos son informativos y para tu uso personal. No reemplazan el asesoramiento
              profesional para tu caso particular.
            </p>
          </Seccion>

          <Seccion titulo="8. Plataforma de clientes">
            <p>
              Si tenés una cuenta en nuestra plataforma, sos responsable de cuidar tus datos de acceso y de lo que se haga
              con ellos. Podemos suspender cuentas que hagan un uso indebido.
            </p>
          </Seccion>

          <Seccion titulo="9. Servicios de terceros">
            <p>
              El sitio usa servicios externos como Mercado Pago, PayPal, Cal.com, Google Drive y WhatsApp, cada uno con sus
              propias condiciones. No respondemos por sus interrupciones ni por cambios en las plataformas de redes y
              publicidad.
            </p>
          </Seccion>

          <Seccion titulo="10. Responsabilidad">
            <p>
              Trabajamos para que el sitio funcione siempre, pero puede haber interrupciones o errores. Nada de lo que
              dicen estos términos limita los derechos que te da la ley como consumidor.
            </p>
          </Seccion>

          <Seccion titulo="11. Tus datos">
            <p>
              Tratamos tus datos según nuestra{" "}
              <Link href="/politica-de-privacidad" className="text-[#ccff00] hover:underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </Seccion>

          <Seccion titulo="12. Cambios">
            <p>
              Podemos actualizar estos términos y publicar la nueva versión en esta página. Cada compra se rige por los
              términos vigentes al momento de hacerla.
            </p>
          </Seccion>

          <Seccion titulo="13. Ley aplicable">
            <p>
              Se aplican las leyes de la República Argentina. Si sos consumidor, podés reclamar ante las autoridades de
              defensa del consumidor y los tribunales que correspondan a tu domicilio.
            </p>
          </Seccion>

          <Seccion titulo="14. Contacto">
            <p>
              Por cualquier consulta, escribinos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-[#ccff00] hover:underline">
                {EMAIL}
              </a>{" "}
              o por{" "}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
                WhatsApp
              </a>
              .
            </p>
          </Seccion>
        </div>

        <Link href="/" className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-[#ccff00] hover:underline">
          ← Volver al inicio
        </Link>
      </div>

      <Footer />
    </main>
  );
}
