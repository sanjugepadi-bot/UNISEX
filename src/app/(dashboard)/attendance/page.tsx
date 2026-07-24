import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers, type Member } from "@/services/members";
import { getAttendanceForDate } from "@/services/attendance";
import { getMemberStatus } from "@/lib/memberStatus";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { CheckInButton } from "@/features/attendance/components/CheckInButton";

export const metadata: Metadata = {
  title: "Attendance",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          Attendance{" "}
          <span className="text-sm font-normal text-gray-500">
            {isToday ? "Today" : selectedDate}
          </span>
        </h1>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {attendance?.length ?? 0} checked in
        </span>
      </div>

      <form method="get" className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search member by name or phone to check in"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          type="date"
          name="date"
          defaultValue={selectedDate}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search
        </button>
      </form>

      {q && (
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
          {searchResults.length === 0 && (
            <div className="px-3 py-4 text-sm text-gray-500">
              No members match &quot;{q}&quot;.
            </div>
          )}
          {searchResults.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between border-t border-gray-200 px-3 py-2 text-sm first:border-t-0"
            >
              <div>
                <span className="font-medium text-gray-900">{member.fullName}</span>{" "}
                <span className="text-gray-500">· {member.phone}</span>
              </div>
              <CheckInButton
                memberId={member.id}
                alreadyCheckedIn={checkedInMemberIds.has(member.id)}
                status={getMemberStatus(member.membershipEndDate)}
              />
            </div>
          ))}
        </div>
      )}

      {attendanceError && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {attendanceError}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Check-in time</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Membership status</th>
            </tr>
          </thead>
          <tbody>
            {(!attendance || attendance.length === 0) && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                  No check-ins for this date.
                </td>
              </tr>
            )}
            {attendance?.map((row) => (
              <tr key={row.id} className="border-t border-gray-200">
                <td className="px-3 py-2">{row.memberName}</td>
                <td className="px-3 py-2 text-gray-600">
                  {new Date(row.checkInTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {new Date(row.checkInTime).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={getMemberStatus(row.membershipEndDate)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
