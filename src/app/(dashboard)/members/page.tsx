import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers } from "@/services/members";
import { getMemberStatus, type MemberStatus } from "@/lib/memberStatus";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { DeleteMemberButton } from "./DeleteMemberButton";

export const metadata: Metadata = {
  title: "Members",
};

const PAGE_SIZE = 20;
const VALID_STATUSES: MemberStatus[] = ["active", "expiring", "expired", "unknown"];

interface MembersPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

function buildHref(params: { q?: string; status?: string; page: number }): string {
  const usp = new URLSearchParams();
  if (params.q) usp.set("q", params.q);
  if (params.status) usp.set("status", params.status);
  if (params.page > 1) usp.set("page", String(params.page));
  const qs = usp.toString();
  return qs ? `/members?${qs}` : "/members";
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const { q, status: statusParam, page: pageParam } = await searchParams;
  const status =
    statusParam && VALID_STATUSES.includes(statusParam as MemberStatus)
      ? (statusParam as MemberStatus)
      : undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data, error } = await getMembers({
    gymId: profile.gymId,
    search: q,
    status,
    page,
    pageSize: PAGE_SIZE,
  });
  const members = data?.members ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = rangeStart === 0 ? 0 : rangeStart + members.length - 1;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          Members <span className="text-sm font-normal text-gray-500">{totalCount} total</span>
        </h1>
        <Link
          href="/members/new"
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add member
        </Link>
      </div>

      <form method="get" className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or phone"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring</option>
          <option value="expired">Expired</option>
        </select>
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <th className="px-3 py-2 text-left font-medium">Plan</th>
              <th className="px-3 py-2 text-left font-medium">Start date</th>
              <th className="px-3 py-2 text-left font-medium">Expires</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
            {members.map((member) => (
              <tr key={member.id} className="border-t border-gray-200">
                <td className="px-3 py-2">{member.fullName}</td>
                <td className="px-3 py-2 text-gray-600">{member.phone}</td>
                <td className="px-3 py-2 text-gray-600">{member.planName ?? "—"}</td>
                <td className="px-3 py-2 text-gray-600">{member.membershipStartDate ?? "—"}</td>
                <td className="px-3 py-2 text-gray-600">{member.membershipEndDate ?? "—"}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={getMemberStatus(member.membershipEndDate)} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/members/${member.id}/edit`}
                      className="text-xs font-medium text-gray-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteMemberButton memberId={member.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {rangeStart}–{rangeEnd} of {totalCount}
          </span>
          <div className="flex items-center gap-3">
            {page > 1 ? (
              <Link
                href={buildHref({ q, status, page: page - 1 })}
                className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
              >
                Previous
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-md border border-gray-200 px-3 py-1.5 text-gray-300">
                Previous
              </span>
            )}
            <span>
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={buildHref({ q, status, page: page + 1 })}
                className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
              >
                Next
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-md border border-gray-200 px-3 py-1.5 text-gray-300">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
