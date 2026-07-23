import type { Gender } from "./bmr";

/** Boer formula. Weight in kg, height in cm, returns lean body mass in kg. */
export function calculateLeanBodyMass(
  gender: Gender,
  weightKg: number,
  heightCm: number,
): number {
  return gender === "male"
    ? 0.407 * weightKg + 0.267 * heightCm - 19.2
    : 0.252 * weightKg + 0.473 * heightCm - 48.3;
}
