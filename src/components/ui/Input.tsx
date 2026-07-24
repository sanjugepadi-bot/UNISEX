import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, name, className, ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = !error && helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? helperId}
          className={`w-full rounded-control border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? "border-danger" : "border-border"
          } ${className ?? ""}`}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-danger">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
