interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "danger";
}

const TONE_STYLES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-gray-900",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export function StatTile({ label, value, tone = "default" }: StatTileProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-medium ${TONE_STYLES[tone]}`}>{value}</p>
    </div>
  );
}
