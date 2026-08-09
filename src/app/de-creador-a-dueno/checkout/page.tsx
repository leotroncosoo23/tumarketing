"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Inter } from "next/font/google";
import { ArrowLeft, Lock, CheckCircle2, Zap } from "lucide-react";
import { crearOrdenInfoproducto } from "@/app/actions/infoproducto-checkout";
import { VALOR_SISTEMA, BONOS, VALOR_TOTAL, PRECIO_LANZAMIENTO } from "../precios";
import "@/app/admin/admin.css";

const fontDisplay = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export default function CheckoutInfoproductoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const resultado = await crearOrdenInfoproducto({ nombre, email, telefono });
    if (!resultado.ok) {
      setError(resultado.error);
      setEnviando(false);
      return;
    }
    window.location.href = resultado.linkAprobacion;
  };

  return (
    <main className={`tm-admin-theme ${fontDisplay.variable} ${fontBody.variable} min-h-screen`}>
      <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-[var(--container-pad)] py-4">
        <Link
          href="/de-creador-a-dueno"
          className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] [font-size:var(--fs-body-s)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la landing
        </Link>
        <p className="tm-display hidden font-bold text-[var(--text-primary)] [font-size:var(--fs-body-m)] sm:block">
          De Creador<span className="text-[var(--accent)]">/a</span> a Dueño<span className="text-[var(--accent)]">/a</span>
        </p>
        <span className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] px-3 py-1.5 text-[var(--text-secondary)] [font-size:12px]">
          <Lock className="h-3.5 w-3.5" />
          Pago seguro
        </span>
      </header>

      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-[var(--space-8)] px-[var(--container-pad)] py-[var(--space-9)] lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* Columna izquierda: qué está comprando */}
        <div>
          <span className="font-bold uppercase text-[var(--accent)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
            🚀 De Creador/a a Dueño/a
          </span>
          <h1 className="tm-display mt-[var(--space-3)] font-bold leading-[var(--lh-tight)] text-[var(--text-primary)] [font-size:var(--fs-display-m)]">
            Estás a un paso de ordenar tu contenido y empezar a vender con un sistema real.
          </h1>
          <p className="mt-[var(--space-4)] text-[var(--text-secondary)] [font-size:var(--fs-body-m)] leading-[var(--lh-body)]">
            Completá tus datos a la derecha y accedé al instante a todo el sistema + los 4 bonos.
          </p>

          <div className="relative mx-auto mt-[var(--space-7)] w-full max-w-sm lg:mx-0">
            <div className="absolute inset-0 scale-90 rounded-[var(--radius-l)] bg-[var(--accent)] opacity-10 blur-[50px]" />
            <Image
              src="/+15prompts.png"
              alt="De Creador/a a Dueño/a — sistema completo + bonos"
              width={420}
              height={420}
              className="relative mx-auto"
            />
          </div>

          <div className="mt-[var(--space-7)] rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)]">
            <p className="font-bold uppercase text-[var(--text-tertiary)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
              Qué recibís hoy
            </p>
            <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2 text-[var(--text-primary)] [font-size:var(--fs-body-s)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  Sistema completo (6 módulos)
                </span>
                <span className="shrink-0 text-[var(--text-tertiary)] line-through [font-size:var(--fs-body-s)]">
                  ${VALOR_SISTEMA}
                </span>
              </div>
              {BONOS.map((bono) => (
                <div key={bono.numero} className="flex items-start justify-between gap-3">
                  <span className="flex items-start gap-2 text-[var(--text-primary)] [font-size:var(--fs-body-s)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                    Bono {bono.numero} — {bono.titulo}
                  </span>
                  <span className="shrink-0 text-[var(--text-tertiary)] line-through [font-size:var(--fs-body-s)]">
                    ${bono.valor}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-[var(--space-4)] flex items-center justify-between border-t border-[var(--border-subtle)] pt-[var(--space-4)]">
              <span className="font-bold text-[var(--text-primary)] [font-size:var(--fs-body-m)]">Valor total</span>
              <span className="font-bold text-[var(--text-tertiary)] line-through [font-size:var(--fs-body-m)]">
                ${VALOR_TOTAL} USD
              </span>
            </div>
            <div className="mt-[var(--space-2)] flex items-center justify-between">
              <span className="font-bold uppercase text-[var(--accent)] [font-size:var(--fs-body-s)] tracking-[var(--ls-eyebrow)]">
                Hoy
              </span>
              <span className="tm-display font-bold text-[var(--accent)] [font-size:var(--fs-heading-l)]">
                ${PRECIO_LANZAMIENTO} USD
              </span>
            </div>
          </div>

          <div className="mt-[var(--space-6)] grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-[var(--radius-m)] border border-[var(--border-subtle)] px-[var(--space-3)] py-[var(--space-3)]">
              <Zap className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] [font-size:12px]">Acceso inmediato</span>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius-m)] border border-[var(--border-subtle)] px-[var(--space-3)] py-[var(--space-3)]">
              <Lock className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)] [font-size:12px]">Pago seguro y encriptado</span>
            </div>
          </div>
        </div>

        {/* Columna derecha: resumen de la orden + datos de contacto */}
        <div className="rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-[var(--space-6)] shadow-[var(--shadow-card)] lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[var(--text-primary)] [font-size:var(--fs-body-m)]">De Creador/a a Dueño/a</p>
              <p className="text-[var(--text-tertiary)] [font-size:var(--fs-body-s)]">Pago único · Acceso de por vida</p>
            </div>
            <p className="tm-display font-bold text-[var(--text-primary)] [font-size:var(--fs-heading-m)]">
              ${PRECIO_LANZAMIENTO}.00
            </p>
          </div>

          <div className="mt-[var(--space-5)] flex items-center justify-between border-t border-[var(--border-subtle)] pt-[var(--space-4)]">
            <span className="font-bold uppercase text-[var(--text-tertiary)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
              Total
            </span>
            <span className="tm-display font-bold text-[var(--accent)] [font-size:var(--fs-heading-m)]">
              ${PRECIO_LANZAMIENTO}.00 USD
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-[var(--space-6)] flex flex-col gap-4">
            <p className="font-bold uppercase text-[var(--text-tertiary)] [font-size:var(--fs-eyebrow)] tracking-[var(--ls-eyebrow)]">
              Tus datos de contacto
            </p>

            <label className="flex flex-col gap-2">
              <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Nombre completo*</span>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juana Pérez"
                className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">Email*</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vos@email.com"
                className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
              />
              <span className="text-[var(--text-tertiary)] [font-size:12px]">Tu acceso te llega a este email.</span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[var(--text-secondary)] [font-size:var(--fs-body-s)]">WhatsApp*</span>
              <input
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234 5678"
                className="w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--text-primary)] outline-none [font-size:var(--fs-body-m)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)]"
              />
            </label>

            {error && (
              <p className="rounded-[var(--radius-m)] border border-[var(--signal-error)]/50 bg-[var(--signal-error)]/10 px-4 py-3 text-center font-medium text-[var(--signal-error)] [font-size:var(--fs-body-s)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="tm-display mt-[var(--space-2)] flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[26px] py-[16px] font-bold text-[var(--accent-contrast)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {enviando ? "Redirigiendo a PayPal..." : "Completar compra y acceder"}
            </button>

            <p className="text-center text-[var(--text-tertiary)] [font-size:12px] leading-relaxed">
              🔒 Vas a cargar los datos de tu tarjeta en la página oficial de PayPal — nunca pasan por nuestro
              servidor. Acceso inmediato apenas se acredita el pago.
            </p>
            <p className="text-center text-[var(--text-tertiary)] [font-size:11px] leading-relaxed">
              Al completar la compra aceptás nuestros{" "}
              <a href="#" className="underline hover:text-[var(--text-secondary)]">
                Términos
              </a>{" "}
              y nuestra{" "}
              <Link href="/politica-de-privacidad" className="underline hover:text-[var(--text-secondary)]">
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
