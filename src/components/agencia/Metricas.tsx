import { METRICAS_GLOBALES } from "@/lib/casos-exito";
import ContadorAnimado from "./ContadorAnimado";

type MetricasProps = {
  /** Color de los números y la línea superior; por defecto el lima de marca. */
  acento?: string;
};

// Las 4 métricas globales de la agencia con conteo animado.
export default function Metricas({ acento = "#ccff00" }: MetricasProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" style={{ "--acc": acento } as React.CSSProperties}>
      {METRICAS_GLOBALES.map((m) => (
        <div
          key={m.etiqueta}
          className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[var(--acc)]"
        >
          <ContadorAnimado valor={m.valor} className="block text-3xl sm:text-4xl font-black tracking-tight text-[var(--acc)]" />
          <p className="mt-1 text-sm text-neutral-400">{m.etiqueta}</p>
        </div>
      ))}
    </div>
  );
}
