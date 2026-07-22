import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const membershipPlanSchema = z.object({
  planName: z.string().trim().min(2, "Plan name must be at least 2 characters"),
  durationValue: z.coerce.number().int().positive("Duration must be a positive number"),
  durationUnit: z.enum(["days", "months"]),
  price: z.coerce.number().nonnegative("Price must be zero or greater"),
  description: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  isActive: z.boolean(),
});

export type MembershipPlanInput = z.infer<typeof membershipPlanSchema>;
