import { PASOS } from "@/lib/servicios-landing";
import FadeInScroll from "@/components/FadeInScroll";

// "Cómo trabajamos": 4 pasos con íconos que brillan y una luz que recorre la
// línea que los une. En mobile se apilan en vertical.
export default function PasosFlow() {
  return (
    <div className="relative grid grid-cols-1 gap-9 md:grid-cols-4 md:gap-7">
      {/* Línea que une los pasos (vertical en mobile, horizontal en desktop) */}
      <div
        aria-hidden="true"
        className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#ccff00] via-[#a970ff] to-[#3b9dff] opacity-45 md:left-[12.5%] md:right-[12.5%] md:bottom-auto md:h-0.5 md:w-auto md:bg-gradient-to-r"
      >
        <span className="absolute -top-1 hidden h-2.5 w-28 rounded-full bg-[radial-gradient(closest-side,#fff,rgba(204,255,0,0.8)_40%,transparent)] blur-[1px] animate-[tm-travel_3.6s_cubic-bezier(.6,0,.4,1)_infinite] md:block" />
      </div>

      {PASOS.map(({ icon: Icon, titulo, texto, badge, color }, i) => (
        <FadeInScroll key={titulo} delay={i * 0.15} y={30}>
          <div
            className="relative grid grid-cols-[80px_1fr] gap-x-5 md:block md:text-center"
            style={{ "--c": color } as React.CSSProperties}
          >
            <div
              className="relative row-span-3 grid h-20 w-20 place-items-center rounded-3xl border-2 border-transparent text-[var(--c)] [background:linear-gradient(#0b0b10,#0b0b10)_padding-box,linear-gradient(140deg,var(--c),transparent_70%)_border-box] animate-[tm-glow_3.6s_ease-in-out_infinite] md:mx-auto md:mb-5"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <Icon className="h-7 w-7" strokeWidth={2} />
              <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--c)] text-xs font-black text-black">
                0{i + 1}
              </span>
            </div>
            {badge && (
              <span className="mb-2 inline-block w-fit justify-self-start rounded-full bg-[#ccff00] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-black">
                {badge}
              </span>
            )}
            <h3 className="mb-1.5 text-lg font-bold">{titulo}</h3>
            <p className="text-sm leading-relaxed text-neutral-400">{texto}</p>
          </div>
        </FadeInScroll>
      ))}
    </div>
  );
}
