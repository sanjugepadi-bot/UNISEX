import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers } from "@/services/members";
import { getMemberStatus } from "@/lib/memberStatus";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { DeleteMemberButton } from "./DeleteMemberButton";

export const metadata: Metadata = {
  title: "Members",
};

interface MembersPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const { q, status } = await searchParams;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: members, error } = await getMembers({ gymId: profile.gymId, search: q });
  const filtered = (members ?? []).filter(
    (member) => !status || getMemberStatus(member.membershipEndDate) === status,
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          Members <span className="text-sm font-normal text-gray-500">{members?.length ?? 0} total</span>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
            {filtered.map((member) => (
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
    </div>
  );
}
