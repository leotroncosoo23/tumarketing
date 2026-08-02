"use client";

import { useState } from "react";

export type AccordionItem = { q: string; a: string };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="tm-display flex w-full items-center justify-between text-left py-[var(--space-5)] text-[var(--fs-heading-s)] font-bold text-[var(--text-primary)]"
            >
              {item.q}
              <span
                className={`shrink-0 text-[1.4rem] text-[var(--accent)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${open ? "rotate-45" : "rotate-0"}`}
              >
                +
              </span>
            </button>
            {open && (
              <p className="pb-[var(--space-5)] text-[var(--fs-body-m)] leading-[var(--lh-body)] text-[var(--text-secondary)]">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
