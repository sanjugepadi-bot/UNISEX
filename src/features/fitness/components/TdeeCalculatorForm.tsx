"use client";

import { useState, type FormEvent } from "react";
import { Activity, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CalculatorResultCard } from "./CalculatorResultCard";
import { tdeeCalculatorSchema } from "@/validators/tdeeCalculator";
import { calculateTdee, ACTIVITY_LEVELS, ACTIVITY_LEVEL_LABELS } from "@/lib/calculators/tdee";

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

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
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">TDEE Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Total daily energy expenditure from activity level.
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
          <Input label="Weight (kg)" name="weightKg" type="number" required />
          <Input label="Height (cm)" name="heightCm" type="number" required />
          <Input label="Age" name="age" type="number" required />
          <div className="flex flex-col gap-1">
            <label htmlFor="activityLevel" className={fieldLabelClassName}>
              Activity level
            </label>
            <select id="activityLevel" name="activityLevel" className={selectClassName}>
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {ACTIVITY_LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </div>

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
              results={[
                { label: "BMR", value: `${result.bmr.toFixed(0)} kcal/day` },
                { label: "TDEE", value: `${result.tdee.toFixed(0)} kcal/day` },
              ]}
              explanation="Total Daily Energy Expenditure is your BMR adjusted for activity level — the number of calories you burn in a typical day, including exercise and daily movement."
            />
          )}
        </form>
      </Card>
    </div>
  );
}
