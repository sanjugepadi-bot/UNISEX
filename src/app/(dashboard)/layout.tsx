import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { logoutAction } from "./actions";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: profile, error: profileError } = await getCurrentUserProfile();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (!profile.gymId) {
    redirect("/onboarding");
  }

  const { data: gym } = await getCurrentGym(profile.gymId);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar gymName={gym?.gymName ?? "Your gym"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar fullName={profile.fullName} role={profile.role} logoutAction={logoutAction} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
