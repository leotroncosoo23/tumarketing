"use client";

import { useEffect, useRef, useState } from "react";

type ContadorAnimadoProps = {
  /** Valor tal cual se muestra al final: "+50M", "+10.000", "+488,8%". */
  valor: string;
  className?: string;
};

// Cuenta de 0 al valor cuando entra en pantalla. Respeta el prefijo/sufijo del
// texto y el formato argentino (punto de miles, coma decimal).
export default function ContadorAnimado({ valor, className }: ContadorAnimadoProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [texto, setTexto] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    const partes = valor.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!el || !partes || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, crudo, suf] = partes;
    const objetivo = parseFloat(crudo.replace(/\./g, "").replace(",", "."));
    const formatear = (n: number) =>
      objetivo >= 1000
        ? Math.round(n).toLocaleString("es-AR")
        : crudo.includes(",")
          ? n.toFixed(1).replace(".", ",")
          : String(Math.round(n));

    let frame = 0;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - inicio) / 1600);
          setTexto(pre + formatear(objetivo * (1 - Math.pow(1 - k, 3))) + suf);
          if (k < 1) frame = requestAnimationFrame(tick);
          else setTexto(valor);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [valor]);

  return (
    <span ref={ref} className={className}>
      {texto}
    </span>
  );
}
