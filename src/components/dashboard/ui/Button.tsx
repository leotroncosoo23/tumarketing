type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]",
  secondary: "bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--black-4)]",
  ghost: "bg-transparent text-[var(--text-primary)] border border-transparent hover:bg-[var(--black-4)]",
  danger:
    "bg-transparent text-[var(--signal-error)] border border-[var(--signal-error)]/40 hover:bg-[var(--signal-error)]/10",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`tm-display inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-[26px] py-[14px] [font-size:var(--fs-body-m)] font-bold tracking-[var(--ls-tight)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] disabled:cursor-not-allowed disabled:opacity-45 ${VARIANT_STYLES[variant]} ${className}`}
    />
  );
}
