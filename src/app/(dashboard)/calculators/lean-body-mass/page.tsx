import type { Metadata } from "next";
import { LeanBodyMassCalculatorForm } from "@/features/fitness/components/LeanBodyMassCalculatorForm";

export const metadata: Metadata = {
  title: "Lean Body Mass Calculator",
};

export default function LeanBodyMassCalculatorPage() {
  return <LeanBodyMassCalculatorForm />;
}
