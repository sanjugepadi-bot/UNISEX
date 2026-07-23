import { z } from "zod";

export const leanBodyMassCalculatorSchema = z.object({
  gender: z.enum(["male", "female"]),
  weightKg: z.coerce.number().positive("Enter a valid weight"),
  heightCm: z.coerce.number().positive("Enter a valid height"),
});

export type LeanBodyMassCalculatorInput = z.infer<typeof leanBodyMassCalculatorSchema>;
