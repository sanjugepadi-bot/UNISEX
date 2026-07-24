import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}

const TONE_STYLES: Record<NonNullable<StatTileProps["tone"]>, { icon: string; iconBg: string }> = {
  default: { icon: "text-primary", iconBg: "bg-primary/10" },
  success: { icon: "text-success", iconBg: "bg-success-bg" },
  warning: { icon: "text-warning", iconBg: "bg-warning-bg" },
  danger: { icon: "text-danger", iconBg: "bg-danger-bg" },
};

export function StatTile({ label, value, icon: Icon, tone = "default" }: StatTileProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className="rounded-surface border border-border bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className={`flex h-9 w-9 items-center justify-center rounded-control ${styles.iconBg}`}>
        <Icon className={`h-[18px] w-[18px] ${styles.icon}`} aria-hidden="true" />
      </div>
      <p className="mt-3 text-caption font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-h3 font-semibold text-foreground">{value}</p>
    </div>
  );
}
