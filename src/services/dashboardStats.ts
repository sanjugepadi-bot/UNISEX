import { createClient } from "@/lib/supabase/server";
import { getMemberStatus } from "@/lib/memberStatus";
import { getAttendanceForDate } from "@/services/attendance";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  expiredMembers: number;
  todaysCheckIns: number;
  newMembersThisMonth: number;
  monthlyRevenueEstimate: number;
  planDistribution: { planName: string; memberCount: number }[];
}

interface StatsRow {
  membership_end_date: string | null;
  membership_start_date: string | null;
  created_at: string;
  plan: { plan_name: string; price: number } | null;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

export async function getDashboardStats(gymId: string): Promise<ServiceResult<DashboardStats>> {
  try {
    const supabase = await createClient();

    const [membersResult, attendanceResult] = await Promise.all([
      supabase
        .from("members")
        .select(
          "membership_end_date, membership_start_date, created_at, plan:membership_plans(plan_name, price)",
        )
        .eq("gym_id", gymId),
      getAttendanceForDate(todayIso()),
    ]);

    if (membersResult.error) {
      return { data: null, error: membersResult.error.message };
    }
    if (attendanceResult.error) {
      return { data: null, error: attendanceResult.error };
    }

    const rows = membersResult.data as unknown as StatsRow[];
    const monthStart = startOfMonthIso();

    let activeMembers = 0;
    let expiringSoonMembers = 0;
    let expiredMembers = 0;
    let newMembersThisMonth = 0;
    let monthlyRevenueEstimate = 0;
    const planCounts = new Map<string, number>();

    for (const row of rows) {
      const status = getMemberStatus(row.membership_end_date);
      if (status === "active") activeMembers += 1;
      if (status === "expiring") expiringSoonMembers += 1;
      if (status === "expired") expiredMembers += 1;

      if (row.created_at.slice(0, 10) >= monthStart) {
        newMembersThisMonth += 1;
      }

      if (row.plan?.plan_name) {
        planCounts.set(row.plan.plan_name, (planCounts.get(row.plan.plan_name) ?? 0) + 1);
      }

      if (row.plan && row.membership_start_date && row.membership_start_date >= monthStart) {
        monthlyRevenueEstimate += Number(row.plan.price);
      }
    }

    return {
      data: {
        totalMembers: rows.length,
        activeMembers,
        expiringSoonMembers,
        expiredMembers,
        todaysCheckIns: attendanceResult.data?.length ?? 0,
        newMembersThisMonth,
        monthlyRevenueEstimate,
        planDistribution: Array.from(planCounts.entries()).map(([planName, memberCount]) => ({
          planName,
          memberCount,
        })),
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
