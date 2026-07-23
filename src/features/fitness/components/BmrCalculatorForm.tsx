"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { bmrCalculatorSchema } from "@/validators/bmrCalculator";
import { calculateBmr } from "@/lib/calculators/bmr";

export function BmrCalculatorForm() {
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = bmrCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      weightKg: formData.get("weightKg"),
      heightCm: formData.get("heightCm"),
      age: formData.get("age"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculateBmr(parsed.data.gender, parsed.data.weightKg, parsed.data.heightCm, parsed.data.age),
    );
  }

  return (
    <Card title="BMR Calculator" className="max-w-[480px]">
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

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit">Calculate</Button>

        {result !== null && (
          <CalculatorResultCard
            results={[{ label: "BMR", value: `${result.toFixed(0)} kcal/day` }]}
            explanation="Basal Metabolic Rate is the number of calories your body burns at complete rest just to maintain basic functions like breathing and circulation. Calculated using the Mifflin-St Jeor equation."
          />
        )}
      </form>
    </Card>
  );
}
