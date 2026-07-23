import type { Gender } from "./bmr";

/** Devine formula. Height in cm, returns ideal weight in kg. */
export function calculateIdealWeight(gender: Gender, heightCm: number): number {
  const heightInches = heightCm / 2.54;
  const inchesOver5Feet = Math.max(heightInches - 60, 0);
  const base = gender === "male" ? 50 : 45.5;
  return base + 2.3 * inchesOver5Feet;
}
