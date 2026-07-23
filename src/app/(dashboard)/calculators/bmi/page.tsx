import type { Metadata } from "next";
import { BmiCalculatorForm } from "@/features/fitness/components/BmiCalculatorForm";

export const metadata: Metadata = {
  title: "BMI Calculator",
};

export default function BmiCalculatorPage() {
  return <BmiCalculatorForm />;
}
