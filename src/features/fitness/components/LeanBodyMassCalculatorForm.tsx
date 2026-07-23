"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { leanBodyMassCalculatorSchema } from "@/validators/leanBodyMassCalculator";
import { calculateLeanBodyMass } from "@/lib/calculators/leanBodyMass";

export function LeanBodyMassCalculatorForm() {
  const [result, setResult] = useState<{ lbm: number; fatMass: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = leanBodyMassCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      weightKg: formData.get("weightKg"),
      heightCm: formData.get("heightCm"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    const lbm = calculateLeanBodyMass(
      parsed.data.gender,
      parsed.data.weightKg,
      parsed.data.heightCm,
    );
    setResult({ lbm, fatMass: parsed.data.weightKg - lbm });
  }

  return (
    <Card title="Lean Body Mass Calculator" className="max-w-[480px]">
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

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit">Calculate</Button>

        {result && (
          <CalculatorResultCard
            results={[
              { label: "Lean body mass", value: `${result.lbm.toFixed(1)} kg` },
              { label: "Estimated fat mass", value: `${result.fatMass.toFixed(1)} kg` },
            ]}
            explanation="Your body weight excluding fat mass — muscle, bone, organs, and water. Calculated using the Boer formula from height and weight."
          />
        )}
      </form>
    </Card>
  );
}
