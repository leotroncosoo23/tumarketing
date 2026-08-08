"use client";

import { useEffect } from "react";

// Snippet de embed "inline" oficial de Cal.com (el que generan en
// cal.com/.../embed) traducido a un efecto de React en vez de un <script>
// suelto en el HTML — así el calendario se agenda DENTRO de la página, sin
// mandar al visitante a cal.com en otra pestaña.
const CAL_LINK = "leotroncosoo-kiwwvu/discovery-call-desarrollo-y-web";
const NAMESPACE = "discovery-call-desarrollo-y-web";
const CONTENEDOR_ID = "cal-inline-desarrollo";

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

export default function CalendarioInline() {
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

    window.Cal!("init", NAMESPACE, { origin: "https://cal.com" });
    window.Cal!.ns[NAMESPACE]("inline", {
      elementOrSelector: `#${CONTENEDOR_ID}`,
      config: { layout: "month_view" },
      calLink: CAL_LINK,
    });
    window.Cal!.ns[NAMESPACE]("ui", { hideEventTypeDetails: false, layout: "month_view" });
  }, []);

  return (
    <div
      id={CONTENEDOR_ID}
      className="w-full min-h-[700px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800"
    />
  );
}
