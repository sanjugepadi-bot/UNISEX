import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Users,
  UserCheck,
  Clock,
  UserX,
  CalendarCheck,
  UserPlus,
  IndianRupee,
  Dumbbell,
  Utensils,
  ArrowRight,
  CircleAlert,
} from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentGym } from "@/services/gyms";
import { getDashboardStats } from "@/services/dashboardStats";
import { getRecentAttendance } from "@/services/attendance";
import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { PlanDistributionList } from "@/features/dashboard/components/PlanDistributionList";
import { RecentCheckInsList } from "@/features/dashboard/components/RecentCheckInsList";
import { MembershipOverview } from "@/features/dashboard/components/MembershipOverview";

export const metadata: Metadata = {
  title: "Dashboard",
};

const MOTIVATIONAL_MESSAGES = [
  "Let's make today count.",
  "Your members are counting on you.",
  "Small, consistent actions build strong gyms.",
  "Keep the momentum going today.",
  "Every check-in is a step toward their goals.",
  "Great gyms are built one day at a time.",
  "Today's a great day to grow your gym.",
];

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  {
    label: "Add member",
    description: "Register a new gym member",
    href: "/members/new",
    icon: UserPlus,
  },
  {
    label: "Mark attendance",
    description: "Check in a member for today",
    href: "/attendance",
    icon: CalendarCheck,
  },
  {
    label: "AI workout planner",
    description: "Generate a personalized workout plan",
    href: "/workout-plans",
    icon: Dumbbell,
  },
  {
    label: "AI diet planner",
    description: "Generate a personalized diet plan",
    href: "/diet-plans",
    icon: Utensils,
  },
];

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

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const motivationalMessage = MOTIVATIONAL_MESSAGES[now.getDay() % MOTIVATIONAL_MESSAGES.length];
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-panel border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
              {formattedDate}
            </p>
            <h1 className="mt-1 text-h2 font-semibold text-foreground">
              {greeting}
              {profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {gym?.gymName ?? "Your gym"} · {motivationalMessage}
            </p>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </section>

      {statsResult.error && (
        <Card role="alert" className="flex items-center gap-3">
          <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <span className="text-sm text-foreground">{statsResult.error}</span>
        </Card>
      )}

      {stats && (
        <>
          <section>
            <h2 className="text-h3 font-semibold text-foreground">Gym status</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile label="Total members" value={stats.totalMembers} icon={Users} />
              <StatTile
                label="Active"
                value={stats.activeMembers}
                icon={UserCheck}
                tone="success"
              />
              <StatTile
                label="Expiring soon"
                value={stats.expiringSoonMembers}
                icon={Clock}
                tone="warning"
              />
              <StatTile label="Expired" value={stats.expiredMembers} icon={UserX} tone="danger" />
              <StatTile
                label="Today's check-ins"
                value={stats.todaysCheckIns}
                icon={CalendarCheck}
              />
              <StatTile label="New this month" value={stats.newMembersThisMonth} icon={UserPlus} />
              <StatTile
                label="Monthly revenue (est.)"
                value={`₹${stats.monthlyRevenueEstimate.toLocaleString()}`}
                icon={IndianRupee}
              />
            </div>
          </section>

          <section>
            <h2 className="text-h3 font-semibold text-foreground">Quick actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump straight into what you need to do next.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href} className="group block">
                    <Card interactive className="h-full">
                      <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-primary/10 text-primary">
                          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        </div>
                        <ArrowRight
                          className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{action.label}</p>
                      <p className="mt-0.5 text-caption text-muted-foreground">
                        {action.description}
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PlanDistributionList distribution={stats.planDistribution} />
            <MembershipOverview
              totalMembers={stats.totalMembers}
              activeMembers={stats.activeMembers}
              expiringSoonMembers={stats.expiringSoonMembers}
              expiredMembers={stats.expiredMembers}
            />
          </div>

          <RecentCheckInsList checkIns={recent} />
        </>
      )}
    </div>
  );
}
