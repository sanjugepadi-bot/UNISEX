import type { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your gym dashboard account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
