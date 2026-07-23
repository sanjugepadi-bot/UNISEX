export type Gender = "male" | "female";

/** Mifflin-St Jeor equation. Weight in kg, height in cm, age in years. */
export function calculateBmr(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}
