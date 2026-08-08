"use client";

import { useEffect } from "react";

// Snippet de embed "inline" oficial de Cal.com (el que generan en
// cal.com/.../embed) traducido a un efecto de React en vez de un <script>
// suelto en el HTML — así el calendario se agenda DENTRO de la página, sin
// mandar al visitante a cal.com en otra pestaña.
//
// `namespace` tiene que ser único por calendario embebido en el sitio (Cal.com
// los guarda todos en el mismo `window.Cal.ns`): iguales para dos calendarios
// distintos pisaría uno con el otro.
type CalendarioInlineProps = {
  calLink: string;
  namespace: string;
};

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      loaded?: boolean;
      ns: Record<string, (...args: unknown[]) => void>;
      q?: unknown[];
    };
  }
}

export default function CalendarioInline({ calLink, namespace }: CalendarioInlineProps) {
  const contenedorId = `cal-inline-${namespace}`;

  useEffect(() => {
    (function (C: Window, A: string, L: string) {
      const p = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        (function (...args: unknown[]) {
          const cal = C.Cal!;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api = (...apiArgs: unknown[]) => p(api as unknown as { q: unknown[] }, apiArgs);
            (api as unknown as { q: unknown[] }).q = [];
            const namespace = args[1] as string;
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || (api as unknown as (...a: unknown[]) => void);
              p(cal.ns[namespace] as unknown as { q: unknown[] }, args);
              p(cal as unknown as { q: unknown[] }, ["initNamespace", namespace]);
            } else {
              p(cal as unknown as { q: unknown[] }, args);
            }
            return;
          }
          p(cal as unknown as { q: unknown[] }, args);
        }) as Window["Cal"];
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal!("init", namespace, { origin: "https://cal.com" });
    window.Cal!.ns[namespace]("inline", {
      elementOrSelector: `#${contenedorId}`,
      config: { layout: "month_view" },
      calLink,
    });
    window.Cal!.ns[namespace]("ui", { hideEventTypeDetails: false, layout: "month_view" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calLink, namespace]);

  return (
    <div
      id={contenedorId}
      className="w-full min-h-[700px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800"
    />
  );
}
