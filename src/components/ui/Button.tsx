import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { type = "button", loading = false, fullWidth = false, disabled, className, children, ...props },
    ref,
  ) => {
    // Disabled while explicitly disabled OR while a submit/action is pending
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
          fullWidth ? "w-full" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
