"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type FadeInScrollProps = {
  children: ReactNode;
  /** Retraso en segundos, útil para escalonar varios elementos (delay={i * 0.08}). */
  delay?: number;
  /** Desplazamiento vertical inicial en px. 20–30px mantiene el movimiento sutil. */
  y?: number;
  className?: string;
};

const variantes: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Envolvé cualquier sección con esto para que aparezca al entrar en el viewport.
// "once: true" es clave: la animación corre una sola vez y no se repite si el
// usuario sube y baja con el scroll (evita que la página se sienta "inquieta").
export default function FadeInScroll({ children, delay = 0, y = 24, className }: FadeInScrollProps) {
  return (
    <motion.div
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ oculto: { opacity: 0, y }, visible: variantes.visible }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
