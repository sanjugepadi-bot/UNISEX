import { z } from "zod";

export const bodyFatCalculatorSchema = z
  .object({
    gender: z.enum(["male", "female"]),
    heightCm: z.coerce.number().positive("Enter a valid height"),
    waistCm: z.coerce.number().positive("Enter a valid waist measurement"),
    neckCm: z.coerce.number().positive("Enter a valid neck measurement"),
    hipCm: z.coerce.number().positive().optional(),
  })
  .refine((data) => data.gender === "male" || data.hipCm !== undefined, {
    message: "Hip measurement is required for the female formula",
    path: ["hipCm"],
  });

export type BodyFatCalculatorInput = z.infer<typeof bodyFatCalculatorSchema>;
