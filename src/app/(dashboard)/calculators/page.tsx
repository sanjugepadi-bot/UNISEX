import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Scale,
  Flame,
  Activity,
  Utensils,
  Percent,
  Target,
  Dumbbell,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Calculators",
};

interface CalculatorLink {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const CALCULATORS: CalculatorLink[] = [
  {
    label: "BMI Calculator",
    description: "Body Mass Index from height and weight.",
    href: "/calculators/bmi",
    icon: Scale,
  },
  {
    label: "BMR Calculator",
    description: "Calories burned at rest (Mifflin-St Jeor).",
    href: "/calculators/bmr",
    icon: Flame,
  },
  {
    label: "TDEE Calculator",
    description: "Total daily energy expenditure from activity level.",
    href: "/calculators/tdee",
    icon: Activity,
  },
  {
    label: "Daily Calories Calculator",
    description: "Calorie target for weight loss, maintenance, or gain.",
    href: "/calculators/daily-calories",
    icon: Utensils,
  },
  {
    label: "Body Fat Calculator",
    description: "Estimated body fat % (U.S. Navy method).",
    href: "/calculators/body-fat",
    icon: Percent,
  },
  {
    label: "Ideal Weight Calculator",
    description: "Healthy target weight estimate (Devine formula).",
    href: "/calculators/ideal-weight",
    icon: Target,
  },
  {
    label: "Lean Body Mass Calculator",
    description: "Body weight excluding fat mass (Boer formula).",
    href: "/calculators/lean-body-mass",
    icon: Dumbbell,
  },
];

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Calculators</h1>
          <p className="text-sm text-muted-foreground">
            Quick fitness calculators to help guide your members&apos; goals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((calc) => {
          const Icon = calc.icon;
          return (
            <Link key={calc.href} href={calc.href} className="group block">
              <Card interactive className="h-full">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-control bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{calc.label}</p>
                <p className="mt-0.5 text-caption text-muted-foreground">{calc.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
