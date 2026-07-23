import type { Metadata } from "next";
import { IdealWeightCalculatorForm } from "@/features/fitness/components/IdealWeightCalculatorForm";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator",
};

export default function IdealWeightCalculatorPage() {
  return <IdealWeightCalculatorForm />;
}
