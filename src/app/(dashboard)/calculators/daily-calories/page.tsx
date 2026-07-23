import type { Metadata } from "next";
import { DailyCaloriesCalculatorForm } from "@/features/fitness/components/DailyCaloriesCalculatorForm";

export const metadata: Metadata = {
  title: "Daily Calories Calculator",
};

export default function DailyCaloriesCalculatorPage() {
  return <DailyCaloriesCalculatorForm />;
}
