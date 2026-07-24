import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, id, name, className, ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = !error && helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="flex flex-col gap-1">
        {/* Label wraps the input so the whole text is clickable; htmlFor/id kept too for explicit assistive-tech association */}
        <label htmlFor={inputId} className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            name={name}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId ?? helperId}
            className={`mt-0.5 h-4 w-4 rounded accent-primary transition-colors duration-150 focus:ring-2 focus:ring-primary/20 ${
              error ? "border-danger" : "border-border"
            } ${className ?? ""}`}
            {...props}
          />
          <span>{label}</span>
        </label>
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

Checkbox.displayName = "Checkbox";
