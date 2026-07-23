import { z } from "zod";
import { ACTIVITY_LEVELS } from "@/lib/calculators/tdee";
import { CALORIE_GOALS } from "@/lib/calculators/dailyCalories";

export const dailyCaloriesCalculatorSchema = z.object({
  gender: z.enum(["male", "female"]),
  weightKg: z.coerce.number().positive("Enter a valid weight"),
  heightCm: z.coerce.number().positive("Enter a valid height"),
  age: z.coerce.number().int().positive("Enter a valid age"),
  activityLevel: z.enum(ACTIVITY_LEVELS),
  goal: z.enum(CALORIE_GOALS),
});

export type DailyCaloriesCalculatorInput = z.infer<typeof dailyCaloriesCalculatorSchema>;
