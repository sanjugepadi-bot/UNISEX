type ResultTone = "good" | "caution" | "concern" | "neutral";

const TONE_STYLES: Record<ResultTone, string> = {
  good: "bg-green-50 text-green-700",
  caution: "bg-amber-50 text-amber-700",
  concern: "bg-red-50 text-red-700",
  neutral: "bg-gray-100 text-gray-600",
};

interface CalculatorResultCardProps {
  results: { label: string; value: string }[];
  category?: { label: string; tone: ResultTone };
  explanation: string;
}

export function CalculatorResultCard({ results, category, explanation }: CalculatorResultCardProps) {
  return (
    <div className="rounded-md bg-gray-50 px-3 py-3 text-sm">
      <div className="flex flex-col gap-1">
        {results.map((result) => (
          <p key={result.label}>
            <span className="font-medium text-gray-900">{result.label}: </span>
            <span className="text-gray-700">{result.value}</span>
          </p>
        ))}
      </div>
      {category && (
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TONE_STYLES[category.tone]}`}
        >
          {category.label}
        </span>
      )}
      <p className="mt-2 text-xs text-gray-500">{explanation}</p>
    </div>
  );
}
