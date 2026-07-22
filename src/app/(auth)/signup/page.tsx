import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your gym owner account",
};

export default function SignupPage() {
  return <SignupForm />;
}
