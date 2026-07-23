import type { Gender } from "./bmr";

export type BodyFatCategory = "essential" | "athletes" | "fitness" | "average" | "obese";

interface BodyFatInput {
  gender: Gender;
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number;
}

/** U.S. Navy circumference method. All measurements in centimeters. */
export function calculateBodyFat(input: BodyFatInput): number {
  const { gender, heightCm, waistCm, neckCm, hipCm } = input;

  if (gender === "male") {
    return (
      495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
      450
    );
  }

  const hip = hipCm ?? 0;
  return (
    495 /
      (1.29579 - 0.35004 * Math.log10(waistCm + hip - neckCm) + 0.221 * Math.log10(heightCm)) -
    450
  );
}

export function getBodyFatCategory(gender: Gender, percentage: number): BodyFatCategory {
  if (gender === "male") {
    if (percentage <= 5) return "essential";
    if (percentage <= 13) return "athletes";
    if (percentage <= 17) return "fitness";
    if (percentage <= 24) return "average";
    return "obese";
  }
  if (percentage <= 13) return "essential";
  if (percentage <= 20) return "athletes";
  if (percentage <= 24) return "fitness";
  if (percentage <= 31) return "average";
  return "obese";
}

export const BODY_FAT_CATEGORY_LABELS: Record<BodyFatCategory, string> = {
  essential: "Essential fat",
  athletes: "Athletic",
  fitness: "Fitness",
  average: "Average",
  obese: "Obese",
};
