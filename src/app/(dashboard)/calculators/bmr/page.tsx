import type { Metadata } from "next";
import { BmrCalculatorForm } from "@/features/fitness/components/BmrCalculatorForm";

export const metadata: Metadata = {
  title: "BMR Calculator",
};

export default function BmrCalculatorPage() {
  return <BmrCalculatorForm />;
}
