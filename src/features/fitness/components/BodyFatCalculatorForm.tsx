"use client";

import { useState, type FormEvent } from "react";
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
    <Card title="Body Fat Calculator" className="max-w-[480px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-xs text-gray-600">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
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
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit">Calculate</Button>

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
  );
}
