import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";
import { Card } from "@/components/ui/Card";
import { GymProfileForm } from "@/features/settings/components/GymProfileForm";
import { updateGymSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Settings",
};

const UPCOMING_SECTIONS = [
  { label: "Staff Management", description: "Invite and manage staff accounts." },
  { label: "Notifications", description: "Configure expiry and attendance alerts." },
  { label: "Billing", description: "Manage your subscription and invoices." },
];

export default async function SettingsPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: gym, error } = await getCurrentGym(profile.gymId);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-gray-900">Settings</h1>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {gym && (
        <Card title="Gym profile" className="max-w-[520px]">
          <GymProfileForm action={updateGymSettingsAction} gym={gym} />
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {UPCOMING_SECTIONS.map((section) => (
          <div
            key={section.label}
            className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 opacity-60"
          >
            <p className="text-sm font-medium text-gray-700">{section.label}</p>
            <p className="mt-1 text-xs text-gray-500">{section.description}</p>
            <p className="mt-2 text-xs font-medium text-gray-400">Coming soon</p>
          </div>
        ))}
      </div>
    </div>
  );
}
