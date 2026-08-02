import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, className = "", id, ...props },
  ref
) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-[var(--fs-body-s)] font-medium text-[var(--text-secondary)]">{label}</span>
      )}
      <input
        ref={ref}
        id={id}
        {...props}
        className={`w-full rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--fs-body-m)] text-[var(--text-primary)] outline-none transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] ${className}`}
      />
      {hint && <span className="text-xs text-[var(--text-tertiary)]">{hint}</span>}
    </label>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
>(function Textarea({ label, className = "", ...props }, ref) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-[var(--fs-body-s)] font-medium text-[var(--text-secondary)]">{label}</span>
      )}
      <textarea
        ref={ref}
        {...props}
        className={`w-full resize-y rounded-[var(--radius-s)] border border-[var(--border-subtle)] bg-[var(--black-2)] px-[16px] py-[14px] text-[var(--fs-body-m)] text-[var(--text-primary)] outline-none transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] ${className}`}
      />
    </label>
  );
});
