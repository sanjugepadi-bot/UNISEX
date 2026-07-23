import { z } from "zod";

export const bmrCalculatorSchema = z.object({
  gender: z.enum(["male", "female"]),
  weightKg: z.coerce.number().positive("Enter a valid weight"),
  heightCm: z.coerce.number().positive("Enter a valid height"),
  age: z.coerce.number().int().positive("Enter a valid age"),
});

export type BmrCalculatorInput = z.infer<typeof bmrCalculatorSchema>;
