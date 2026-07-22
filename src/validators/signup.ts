import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeToTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
});

export type SignupInput = z.infer<typeof signupSchema>;
