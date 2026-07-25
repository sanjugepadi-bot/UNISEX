import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Settings as SettingsIcon, User, Users, Bell, Receipt, CircleAlert } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";
import { Card } from "@/components/ui/Card";
import { GymProfileForm } from "@/features/settings/components/GymProfileForm";
import { updateGymSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Settings",
};

const UPCOMING_SECTIONS = [
  {
    label: "Staff Management",
    description: "Invite and manage staff accounts.",
    icon: Users,
  },
  {
    label: "Notifications",
    description: "Configure expiry and attendance alerts.",
    icon: Bell,
  },
  {
    label: "Billing",
    description: "Manage your subscription and invoices.",
    icon: Receipt,
  },
];

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default async function SettingsPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: gym, error } = await getCurrentGym(profile.gymId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <SettingsIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your gym&apos;s profile and account preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Owner information" description="Your account within this gym.">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile.fullName ?? "—"}
                </p>
                <p className="text-caption text-muted-foreground">{formatRole(profile.role)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {error && (
            <p role="alert" className="mb-4 rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          {gym ? (
            <Card
              title="Gym information"
              description="This information appears across your gym's workspace."
            >
              <GymProfileForm action={updateGymSettingsAction} gym={gym} />
            </Card>
          ) : (
            !error && (
              <Card>
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <CircleAlert className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">Gym information unavailable</p>
                  <p className="text-sm text-muted-foreground">
                    We couldn&apos;t load your gym&apos;s details right now. Please try again shortly.
                  </p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">More settings</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {UPCOMING_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.label}
                className="rounded-surface border border-dashed border-border bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-control bg-muted text-muted-foreground">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-secondary-foreground">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{section.label}</p>
                <p className="mt-1 text-caption text-muted-foreground">{section.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
