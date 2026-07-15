export default function CircularProgress({ porcentaje }: { porcentaje: number }) {
  const radio = 40;
  const circunferencia = 2 * Math.PI * radio;
  const progresoClamp = Math.min(Math.max(porcentaje, 0), 100);
  const offset = circunferencia - (progresoClamp / 100) * circunferencia;

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radio} strokeWidth="8" fill="none" className="stroke-neutral-800" />
        <circle
          cx="50"
          cy="50"
          r={radio}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="stroke-[#ccff00] transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white">{progresoClamp}%</span>
        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wide">
          {progresoClamp >= 100 ? "Listo" : "Cursando"}
        </span>
      </div>
    </div>
  );
}
