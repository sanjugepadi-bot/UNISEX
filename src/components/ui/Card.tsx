import { forwardRef, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: ReactNode;
  /** Opt-in hover treatment for cards that act as clickable surfaces. */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, footer, interactive = false, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full rounded-surface border border-border bg-surface p-6 shadow-card sm:p-8 ${
          interactive ? "cursor-pointer transition-shadow duration-200 hover:shadow-card-hover" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-base font-medium text-foreground">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
        )}

        {children}

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    );
  },
);

Card.displayName = "Card";
