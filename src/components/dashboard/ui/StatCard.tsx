import { Card } from "./Card";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-[var(--space-2)]">
      <div className="flex items-center justify-between">
        <span className="uppercase text-[var(--text-secondary)] [font-size:var(--fs-body-s)] [letter-spacing:var(--ls-eyebrow)]">
          {label}
        </span>
        {icon && <span className="text-[var(--accent)]">{icon}</span>}
      </div>
      <span className="tm-display font-bold text-[var(--accent)] [font-size:var(--fs-display-m)] [line-height:var(--lh-tight)]">
        {value}
      </span>
      {hint && <span className="text-[var(--text-tertiary)] [font-size:var(--fs-eyebrow)]">{hint}</span>}
    </Card>
  );
}
