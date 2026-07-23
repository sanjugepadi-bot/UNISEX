"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { idealWeightCalculatorSchema } from "@/validators/idealWeightCalculator";
import { calculateIdealWeight } from "@/lib/calculators/idealWeight";

export function IdealWeightCalculatorForm() {
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const parsed = idealWeightCalculatorSchema.safeParse({
      gender: formData.get("gender"),
      heightCm: formData.get("heightCm"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid values.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(calculateIdealWeight(parsed.data.gender, parsed.data.heightCm));
  }

  return (
    <Card title="Ideal Weight Calculator" className="max-w-[480px]">
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

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit">Calculate</Button>

        {result !== null && (
          <CalculatorResultCard
            results={[{ label: "Ideal weight", value: `${result.toFixed(1)} kg` }]}
            explanation="An estimate of a healthy target weight based on height and gender, using the Devine formula. Individual healthy weight varies with body frame and muscle mass."
          />
        )}
      </form>
    </Card>
  );
}
