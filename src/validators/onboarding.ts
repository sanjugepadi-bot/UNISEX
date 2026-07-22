import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const onboardingSchema = z.object({
  gymName: z.string().trim().min(2, "Gym name must be at least 2 characters"),
  gymPhone: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  gymEmail: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().email("Enter a valid email address").optional(),
  ),
  address: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
