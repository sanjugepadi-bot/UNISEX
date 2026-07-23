import type { Metadata } from "next";
import { TdeeCalculatorForm } from "@/features/fitness/components/TdeeCalculatorForm";

export const metadata: Metadata = {
  title: "TDEE Calculator",
};

export default function TdeeCalculatorPage() {
  return <TdeeCalculatorForm />;
}
