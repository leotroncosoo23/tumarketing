import Navbar from "@/components/Navbar";
import { verificarTokenBaja } from "@/lib/unsubscribe-token";
import BajaNewsletterContenido from "@/components/BajaNewsletterContenido";

export default async function BajaNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  const linkValido = !!email && !!token && verificarTokenBaja(email, token);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden pt-28">
      <Navbar />
      {linkValido ? (
        <BajaNewsletterContenido email={email} token={token} />
      ) : (
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black mb-3">Link inválido</h1>
          <p className="text-neutral-400">
            Este link de baja no es válido o está incompleto. Si querés dejar de recibir novedades, escribinos y lo
            resolvemos a mano.
          </p>
        </div>
      )}
    </main>
  );
}
