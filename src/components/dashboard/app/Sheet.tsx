"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";

// Panel deslizable estilo app: en el celular sube desde abajo (bottom sheet)
// y en la compu aparece centrado. Se cierra con Escape o tocando afuera.
export function Sheet({
  abierto,
  onCerrar,
  titulo,
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  const arrastre = useDragControls();

  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPresionar);
    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", alPresionar);
    };
  }, [abierto, onCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            key="fondo"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCerrar}
          />
          <div className="fixed inset-x-0 bottom-0 z-[61] max-h-[88vh] md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[80vh] md:w-[460px] md:-translate-x-1/2 md:-translate-y-1/2">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={titulo}
              className="flex max-h-[inherit] flex-col overflow-hidden rounded-t-[24px] border border-[var(--border-subtle)] bg-[var(--black-2)] shadow-[var(--shadow-lift)] md:rounded-[24px]"
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 380 }}
              drag="y"
              dragListener={false}
              dragControls={arrastre}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 600) onCerrar();
              }}
            >
              <div onPointerDown={(e) => arrastre.start(e)} className="shrink-0 touch-none md:touch-auto">
                <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-[var(--black-5)] md:hidden" />
                <div className="flex items-center justify-between px-5 pb-3 pt-3 md:pt-5">
                <h2 className="tm-display text-[20px] font-bold text-[var(--text-primary)]">{titulo}</h2>
                <button
                  onClick={onCerrar}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--black-4)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(16px+env(safe-area-inset-bottom))]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
