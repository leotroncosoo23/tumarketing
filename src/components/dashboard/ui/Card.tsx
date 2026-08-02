export function Card({
  children,
  className = "",
  hover = false,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-l)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-card)] ${
        padded ? "p-[var(--space-6)]" : ""
      } ${hover ? "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-[var(--surface-card-hover)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
