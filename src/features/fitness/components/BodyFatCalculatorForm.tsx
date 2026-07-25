"use client";

import { useState, type FormEvent } from "react";
import { Percent, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { bodyFatCalculatorSchema } from "@/validators/bodyFatCalculator";
import {
  calculateBodyFat,
  getBodyFatCategory,
  BODY_FAT_CATEGORY_LABELS,
  type BodyFatCategory,
} from "@/lib/calculators/bodyFat";

const CATEGORY_TONES: Record<BodyFatCategory, "good" | "caution" | "concern" | "neutral"> = {
  essential: "neutral",
  athletes: "good",
  fitness: "good",
  average: "neutral",
  obese: "concern",
};

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

export function BodyFatCalculatorForm() {
  const [result, setResult] = useState<{ percentage: number; category: BodyFatCategory } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = bodyFatCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      heightCm: formData.get("heightCm"),
      waistCm: formData.get("waistCm"),
      neckCm: formData.get("neckCm"),
      hipCm: formData.get("hipCm"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    const percentage = calculateBodyFat(parsed.data);
    setResult({ percentage, category: getBodyFatCategory(parsed.data.gender, percentage) });
  }

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Percent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Body Fat Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Estimated body fat % (U.S. Navy method).
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="gender" className={fieldLabelClassName}>
              Gender
            </label>
            <select id="gender" name="gender" className={selectClassName}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Input label="Height (cm)" name="heightCm" type="number" required />
          <Input label="Waist (cm)" name="waistCm" type="number" required />
          <Input label="Neck (cm)" name="neckCm" type="number" required />
          <Input
            label="Hip (cm)"
            name="hipCm"
            type="number"
            helperText="Required for the female formula"
          />

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
              results={[{ label: "Body fat", value: `${result.percentage.toFixed(1)}%` }]}
              category={{
                label: BODY_FAT_CATEGORY_LABELS[result.category],
                tone: CATEGORY_TONES[result.category],
              }}
              explanation="Estimated using the U.S. Navy circumference method, based on waist, neck, height (and hip, for women). This is an estimate, not as precise as clinical methods like DEXA scans."
            />
          )}
        </form>
      </Card>
    </div>
  );
}
