import { z } from "zod";
import { ACTIVITY_LEVELS } from "@/lib/calculators/tdee";

export const tdeeCalculatorSchema = z.object({
  gender: z.enum(["male", "female"]),
  weightKg: z.coerce.number().positive("Enter a valid weight"),
  heightCm: z.coerce.number().positive("Enter a valid height"),
  age: z.coerce.number().int().positive("Enter a valid age"),
  activityLevel: z.enum(ACTIVITY_LEVELS),
});

export type TdeeCalculatorInput = z.infer<typeof tdeeCalculatorSchema>;
