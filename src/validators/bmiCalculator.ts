import { z } from "zod";

export const bmiCalculatorSchema = z.object({
  heightCm: z.coerce.number().positive("Enter a valid height"),
  weightKg: z.coerce.number().positive("Enter a valid weight"),
});

export type BmiCalculatorInput = z.infer<typeof bmiCalculatorSchema>;
