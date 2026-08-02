import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, className = "", children, ...props },
  ref
) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-[var(--fs-body-s)] font-medium text-[var(--text-secondary)]">{label}</span>
      )}
      <select
        ref={ref}
        {...props}
        className={`w-full cursor-pointer rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--fs-body-m)] text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-focus)] ${className}`}
      >
        {children}
      </select>
    </label>
  );
});
