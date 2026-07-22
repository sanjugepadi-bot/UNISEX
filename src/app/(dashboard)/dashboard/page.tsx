import type { Metadata } from "next";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { data: profile } = await getCurrentUserProfile();
  const gym = profile?.gymId ? (await getCurrentGym(profile.gymId)).data : null;

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900">
        Welcome{profile?.fullName ? `, ${profile.fullName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-gray-600">{gym?.gymName ?? "Your gym"}</p>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500">
        Your dashboard content will appear here.
      </div>
    </div>
  );
}
