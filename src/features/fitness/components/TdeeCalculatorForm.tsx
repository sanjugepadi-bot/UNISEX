"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { tdeeCalculatorSchema } from "@/validators/tdeeCalculator";
import { calculateTdee, ACTIVITY_LEVELS, ACTIVITY_LEVEL_LABELS } from "@/lib/calculators/tdee";

export function TdeeCalculatorForm() {
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = tdeeCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      weightKg: formData.get("weightKg"),
      heightCm: formData.get("heightCm"),
      age: formData.get("age"),
      activityLevel: formData.get("activityLevel"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculateTdee(
        parsed.data.gender,
        parsed.data.weightKg,
        parsed.data.heightCm,
        parsed.data.age,
        parsed.data.activityLevel,
      ),
    );
  }

  return (
    <Card title="TDEE Calculator" className="max-w-[480px]">
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
        <Input label="Weight (kg)" name="weightKg" type="number" required />
        <Input label="Height (cm)" name="heightCm" type="number" required />
        <Input label="Age" name="age" type="number" required />
        <div className="flex flex-col gap-1">
          <label htmlFor="activityLevel" className="text-xs text-gray-600">
            Activity level
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {ACTIVITY_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit">Calculate</Button>

        {result && (
          <CalculatorResultCard
            results={[
              { label: "BMR", value: `${result.bmr.toFixed(0)} kcal/day` },
              { label: "TDEE", value: `${result.tdee.toFixed(0)} kcal/day` },
            ]}
            explanation="Total Daily Energy Expenditure is your BMR adjusted for activity level — the number of calories you burn in a typical day, including exercise and daily movement."
          />
        )}
      </form>
    </Card>
  );
}
