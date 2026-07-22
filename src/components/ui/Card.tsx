import { forwardRef, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, footer, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full rounded-xl border border-gray-200 bg-white p-6 sm:p-8 ${className ?? ""}`}
        {...props}
      >
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-base font-medium text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </div>
        )}

        {children}

        {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
      </div>
    );
  },
);

Card.displayName = "Card";
