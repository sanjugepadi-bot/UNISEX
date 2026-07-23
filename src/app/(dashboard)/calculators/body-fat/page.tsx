import type { Metadata } from "next";
import { BodyFatCalculatorForm } from "@/features/fitness/components/BodyFatCalculatorForm";

export const metadata: Metadata = {
  title: "Body Fat Calculator",
};

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculatorForm />;
}
