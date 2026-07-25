"use client";

import { useState, type FormEvent } from "react";
import { Scale, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { bmiCalculatorSchema } from "@/validators/bmiCalculator";
import { calculateBmi, getBmiCategory, type BmiCategory } from "@/lib/calculators/bmi";

const CATEGORY_LABELS: Record<BmiCategory, string> = {
  underweight: "Underweight",
  normal: "Normal weight",
  overweight: "Overweight",
  obese: "Obese",
};

const CATEGORY_TONES: Record<BmiCategory, "good" | "caution" | "concern"> = {
  underweight: "caution",
  normal: "good",
  overweight: "caution",
  obese: "concern",
};

export function BmiCalculatorForm() {
  const [result, setResult] = useState<{ bmi: number; category: BmiCategory } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = bmiCalculatorSchema.safeParse({
      heightCm: formData.get("heightCm"),
      weightKg: formData.get("weightKg"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    const bmi = calculateBmi(parsed.data.heightCm, parsed.data.weightKg);
    setResult({ bmi, category: getBmiCategory(bmi) });
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Scale className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">BMI Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Body Mass Index from height and weight.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Height (cm)" name="heightCm" type="number" required />
          <Input label="Weight (kg)" name="weightKg" type="number" required />

          {error && (
            <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            </div>
          )}

          <Button type="submit" variant="primary">
            Calculate
          </Button>

          {result && (
            <CalculatorResultCard
              results={[{ label: "BMI", value: result.bmi.toFixed(1) }]}
              category={{
                label: CATEGORY_LABELS[result.category],
                tone: CATEGORY_TONES[result.category],
              }}
              explanation="Body Mass Index estimates body fat based on height and weight. It doesn't account for muscle mass, so athletic individuals may show a higher BMI despite low body fat."
            />
          )}
        </form>
      </Card>
    </div>
  );
}
