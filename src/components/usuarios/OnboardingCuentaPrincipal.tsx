"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type OnboardingCuentaPrincipalProps = {
  usuarioId: string;
  onCompletado: (instagramUsuario: string) => void;
};

type Paso = "ingreso" | "confirmacion";

// Primer paso manual (sin API de Meta ni OAuth): le pedimos al cliente que
// escriba a mano el @usuario de su cuenta principal. Antes de guardar nada,
// pasa por una pantalla de confirmación (evita guardar un typo sin darse
// cuenta, ya que esto define de dónde se cargan sus métricas).
export default function OnboardingCuentaPrincipal({ usuarioId, onCompletado }: OnboardingCuentaPrincipalProps) {
  const [paso, setPaso] = useState<Paso>("ingreso");
  const [instagramUsuario, setInstagramUsuario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instagramUsuario.trim()) {
      setError("Ingresá tu @usuario antes de continuar.");
      return;
    }
    setError("");
    setPaso("confirmacion");
  };

  const handleEditar = () => {
    setError("");
    setPaso("ingreso");
  };

  const handleGuardar = async () => {
    const valor = instagramUsuario.trim().replace(/^@/, "");
    setError("");
    setGuardando(true);

    const { error: errorUpdate } = await supabase
      .from("usuarios")
      .update({ instagram_usuario: valor })
      .eq("id", usuarioId);

    setGuardando(false);

    if (errorUpdate) {
      setError("No pudimos guardar tu usuario: " + errorUpdate.message);
      return;
    }

    onCompletado(valor);
  };

  const valorLimpio = instagramUsuario.trim().replace(/^@/, "");

  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        {paso === "ingreso" ? (
          <>
            <h1 className="text-2xl md:text-3xl font-black text-center leading-tight mb-3">
              ¡Bienvenido! Para configurar tu panel, ingresá el{" "}
              <span className="text-[#ccff00]">@usuario</span> de tu cuenta principal
            </h1>
            <p className="text-neutral-400 text-sm text-center mb-8">
              Con esto armamos tu panel. Lo podés cambiar después desde Configuración.
            </p>

            <form onSubmit={handleContinuar} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                @usuario de tu cuenta principal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">@</span>
                <input
                  type="text"
                  autoFocus
                  value={instagramUsuario}
                  onChange={(e) => setInstagramUsuario(e.target.value)}
                  placeholder="tu_negocio"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium mt-3">{error}</p>}

              <button
                type="submit"
                className="w-full mt-6 bg-[#ccff00] text-black font-black text-lg py-4 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.01] shadow-[0_0_20px_rgba(204,255,0,0.2)]"
              >
                Guardar y Continuar
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-black text-center leading-tight mb-3">
              Confirmá tu usuario
            </h1>
            <p className="text-neutral-400 text-sm text-center mb-8">
              Revisá que esté bien antes de guardar: lo vamos a usar para cargar tus métricas.
            </p>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <p className="text-neutral-300 text-center mb-1">Usuario ingresado:</p>
              <p className="text-2xl font-black text-[#ccff00] text-center mb-6 break-all">@{valorLimpio}</p>
              <p className="text-sm text-neutral-400 text-center mb-6">
                ¿Es correcto el usuario para cargar las métricas?
              </p>

              {error && <p className="text-red-400 text-sm font-medium text-center mb-4">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleEditar}
                  disabled={guardando}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold py-3.5 rounded-xl hover:border-neutral-700 transition-colors disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="w-full bg-[#ccff00] text-black font-black py-3.5 rounded-xl hover:bg-[#b8e600] transition-transform hover:scale-[1.01] shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar información"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
