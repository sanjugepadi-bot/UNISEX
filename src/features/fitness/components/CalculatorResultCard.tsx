import { CircleCheck, CircleAlert, type LucideIcon } from "lucide-react";

type ResultTone = "good" | "caution" | "concern" | "neutral";

const TONE_BADGE_CLASSNAME: Record<ResultTone, string> = {
  good: "bg-success-bg text-success",
  caution: "bg-warning-bg text-warning",
  concern: "bg-danger-bg text-danger",
  neutral: "bg-muted text-muted-foreground",
};

const TONE_ICON: Partial<Record<ResultTone, LucideIcon>> = {
  good: CircleCheck,
  caution: CircleAlert,
  concern: CircleAlert,
};

interface CalculatorResultCardProps {
  results: { label: string; value: string }[];
  category?: { label: string; tone: ResultTone };
  explanation: string;
}

export function CalculatorResultCard({ results, category, explanation }: CalculatorResultCardProps) {
  const ToneIcon = category ? TONE_ICON[category.tone] : undefined;

  return (
    <div className="rounded-surface border border-border bg-background p-4">
      <div className="flex flex-col gap-2">
        {results.map((result) => (
          <div key={result.label} className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">{result.label}</span>
            <span className="text-h3 font-semibold text-foreground">{result.value}</span>
          </div>
        ))}
      </div>

      {category && (
        <span
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium ${TONE_BADGE_CLASSNAME[category.tone]}`}
        >
          {ToneIcon && <ToneIcon className="h-3 w-3" aria-hidden="true" />}
          {category.label}
        </span>
      )}

      <p className="mt-3 text-caption text-muted-foreground">{explanation}</p>
    </div>
  );
}
