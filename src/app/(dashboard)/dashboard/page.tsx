import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";
import { getDashboardStats } from "@/services/dashboardStats";
import { getRecentAttendance } from "@/services/attendance";
import { StatTile } from "@/components/ui/StatTile";
import { PlanDistributionList } from "@/features/dashboard/components/PlanDistributionList";
import { RecentCheckInsList } from "@/features/dashboard/components/RecentCheckInsList";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const [gymResult, statsResult, recentResult] = await Promise.all([
    getCurrentGym(profile.gymId),
    getDashboardStats(profile.gymId),
    getRecentAttendance(5),
  ]);

  const gym = gymResult.data;
  const stats = statsResult.data;
  const recent = recentResult.data ?? [];

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900">
        Welcome{profile.fullName ? `, ${profile.fullName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-gray-600">{gym?.gymName ?? "Your gym"}</p>

      {statsResult.error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {statsResult.error}
        </p>
      )}

      {stats && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile label="Total members" value={stats.totalMembers} />
            <StatTile label="Active" value={stats.activeMembers} />
            <StatTile label="Expiring soon" value={stats.expiringSoonMembers} tone="warning" />
            <StatTile label="Expired" value={stats.expiredMembers} tone="danger" />
            <StatTile label="Today's check-ins" value={stats.todaysCheckIns} />
            <StatTile label="New this month" value={stats.newMembersThisMonth} />
            <StatTile
              label="Monthly revenue (est.)"
              value={`₹${stats.monthlyRevenueEstimate.toLocaleString()}`}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PlanDistributionList distribution={stats.planDistribution} />
            <RecentCheckInsList checkIns={recent} />
          </div>
        </>
      )}
    </div>
  );
}
