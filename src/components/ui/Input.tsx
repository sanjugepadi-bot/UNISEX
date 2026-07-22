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
        <label htmlFor={inputId} className="text-xs text-gray-600">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? helperId}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 ${
            error ? "border-red-500" : "border-gray-300"
          } ${className ?? ""}`}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
