import { z } from "zod";

export const checkInSchema = z.object({
  memberId: z.string().uuid("Invalid member reference"),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
