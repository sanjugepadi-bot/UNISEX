import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculators",
};

interface CalculatorLink {
  label: string;
  description: string;
  href: string;
}

const CALCULATORS: CalculatorLink[] = [
  {
    label: "BMI Calculator",
    description: "Body Mass Index from height and weight.",
    href: "/calculators/bmi",
  },
  {
    label: "BMR Calculator",
    description: "Calories burned at rest (Mifflin-St Jeor).",
    href: "/calculators/bmr",
  },
  {
    label: "TDEE Calculator",
    description: "Total daily energy expenditure from activity level.",
    href: "/calculators/tdee",
  },
  {
    label: "Daily Calories Calculator",
    description: "Calorie target for weight loss, maintenance, or gain.",
    href: "/calculators/daily-calories",
  },
  {
    label: "Body Fat Calculator",
    description: "Estimated body fat % (U.S. Navy method).",
    href: "/calculators/body-fat",
  },
  {
    label: "Ideal Weight Calculator",
    description: "Healthy target weight estimate (Devine formula).",
    href: "/calculators/ideal-weight",
  },
  {
    label: "Lean Body Mass Calculator",
    description: "Body weight excluding fat mass (Boer formula).",
    href: "/calculators/lean-body-mass",
  },
];

export default function CalculatorsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-gray-900">Calculators</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.label}
            href={calc.href}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">{calc.label}</p>
            <p className="mt-1 text-xs text-gray-500">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
