import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  gender: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  dateOfBirth: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  height: z.preprocess(emptyStringToUndefined, z.coerce.number().positive().optional()),
  weight: z.preprocess(emptyStringToUndefined, z.coerce.number().positive().optional()),
  emergencyContactName: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  emergencyContactPhone: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  membershipStartDate: z.string().min(1, "Start date is required"),
  membershipEndDate: z.string().min(1, "End date is required"),
});

export type MemberInput = z.infer<typeof memberSchema>;
