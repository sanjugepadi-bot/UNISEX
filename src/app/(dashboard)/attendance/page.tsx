import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Search, CalendarCheck, UserX, Clock, Users, SearchX } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers, type Member } from "@/services/members";
import { getAttendanceForDate } from "@/services/attendance";
import { getMemberStatus } from "@/lib/memberStatus";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { CheckInButton } from "@/features/attendance/components/CheckInButton";
import { StatTile } from "@/components/ui/StatTile";

export const metadata: Metadata = {
  title: "Attendance",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AttendancePageProps {
  searchParams: Promise<{ q?: string; date?: string }>;
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const { q, date } = await searchParams;
  const selectedDate = date || todayIso();
  const isToday = selectedDate === todayIso();

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: attendance, error: attendanceError } = await getAttendanceForDate(selectedDate);
  const checkedInMemberIds = new Set((attendance ?? []).map((row) => row.memberId));

  let searchResults: Member[] = [];
  if (q) {
    const result = await getMembers({ gymId: profile.gymId, search: q });
    searchResults = result.data?.members ?? [];
  }

  // Derived purely from `attendance`, already loaded above — no new queries.
  const expiredCheckedIn = (attendance ?? []).filter(
    (row) => getMemberStatus(row.membershipEndDate) === "expired",
  ).length;
  const latestCheckIn = attendance && attendance.length > 0 ? attendance[0] : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-h2 font-semibold text-foreground">Attendance</h1>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-caption font-medium text-secondary-foreground">
            {isToday ? "Today" : selectedDate}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for a member to check them in, and review who&apos;s attended on this date.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Checked in" value={attendance?.length ?? 0} icon={CalendarCheck} />
        <StatTile
          label="Expired memberships"
          value={expiredCheckedIn}
          icon={UserX}
          tone={expiredCheckedIn > 0 ? "danger" : "default"}
        />
        <StatTile
          label="Latest check-in"
          value={
            latestCheckIn
              ? new Date(latestCheckIn.checkInTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"
          }
          icon={Clock}
        />
      </div>

      <div className="rounded-surface border border-border bg-surface p-4 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Check in a member</h2>
        <form method="get" className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search member by name or phone"
              className="w-full rounded-control border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <input
            type="date"
            name="date"
            defaultValue={selectedDate}
            className="rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="rounded-control border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
          >
            Search
          </button>
        </form>

        {q && (
          <div className="mt-4 overflow-hidden rounded-control border border-border">
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">No members match &quot;{q}&quot;.</p>
              </div>
            ) : (
              searchResults.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 first:border-t-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {getInitials(member.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {member.fullName}
                      </p>
                      <p className="text-caption text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                  <CheckInButton
                    memberId={member.id}
                    alreadyCheckedIn={checkedInMemberIds.has(member.id)}
                    status={getMemberStatus(member.membershipEndDate)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {attendanceError && (
        <p role="alert" className="rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
          {attendanceError}
        </p>
      )}

      <div className="overflow-hidden rounded-surface border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-border bg-secondary/40">
              <tr>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Check-in time
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Membership status
                </th>
              </tr>
            </thead>
            <tbody>
              {(!attendance || attendance.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          No check-ins for this date
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Use the search above to check in a member.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {attendance?.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border transition-colors duration-150 hover:bg-secondary/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(row.memberName)}
                      </div>
                      <span className="font-medium text-foreground">{row.memberName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(row.checkInTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(row.checkInTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getMemberStatus(row.membershipEndDate)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
