import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your gym dashboard password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
