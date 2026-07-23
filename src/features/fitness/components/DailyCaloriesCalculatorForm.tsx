"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { dailyCaloriesCalculatorSchema } from "@/validators/dailyCaloriesCalculator";
import { ACTIVITY_LEVELS, ACTIVITY_LEVEL_LABELS } from "@/lib/calculators/tdee";
import {
  calculateDailyCalories,
  CALORIE_GOALS,
  CALORIE_GOAL_LABELS,
} from "@/lib/calculators/dailyCalories";

export function DailyCaloriesCalculatorForm() {
  const [result, setResult] = useState<{ bmr: number; tdee: number; target: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = dailyCaloriesCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      weightKg: formData.get("weightKg"),
      heightCm: formData.get("heightCm"),
      age: formData.get("age"),
      activityLevel: formData.get("activityLevel"),
      goal: formData.get("goal"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(
      calculateDailyCalories(
        parsed.data.gender,
        parsed.data.weightKg,
        parsed.data.heightCm,
        parsed.data.age,
        parsed.data.activityLevel,
        parsed.data.goal,
      ),
    );
  }

  return (
    <Card title="Daily Calories Calculator" className="max-w-[480px]">
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
        <div className="flex flex-col gap-1">
          <label htmlFor="goal" className="text-xs text-gray-600">
            Goal
          </label>
          <select
            id="goal"
            name="goal"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {CALORIE_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {CALORIE_GOAL_LABELS[goal]}
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
              { label: "Maintenance (TDEE)", value: `${result.tdee.toFixed(0)} kcal/day` },
              { label: "Daily target", value: `${result.target.toFixed(0)} kcal/day` },
            ]}
            explanation="Your daily calorie target adjusts your maintenance calories (TDEE) based on your goal — a deficit for weight loss, a surplus for muscle gain, or your TDEE itself to maintain your current weight."
          />
        )}
      </form>
    </Card>
  );
}
