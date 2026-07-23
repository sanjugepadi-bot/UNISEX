import { z } from "zod";

export const idealWeightCalculatorSchema = z.object({
  gender: z.enum(["male", "female"]),
  heightCm: z.coerce.number().positive("Enter a valid height"),
});

export type IdealWeightCalculatorInput = z.infer<typeof idealWeightCalculatorSchema>;
