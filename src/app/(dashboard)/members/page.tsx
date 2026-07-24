import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, UserPlus, Users, SearchX, Pencil, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers } from "@/services/members";
import { getMemberStatus, type MemberStatus } from "@/lib/memberStatus";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { Button } from "@/components/ui/Button";
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
  const hasActiveFilters = Boolean(q || status);

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
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-h2 font-semibold text-foreground">Members</h1>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-caption font-medium text-secondary-foreground">
              {totalCount} total
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your gym&apos;s member roster and track their membership status.
          </p>
        </div>
        <Link href="/members/new">
          <Button variant="primary">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Add Member
          </Button>
        </Link>
      </div>

      {/* Search & filters */}
      <div className="rounded-surface border border-border bg-surface p-4 shadow-card">
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search by name or phone"
              className="w-full rounded-control border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="secondary">
              Filter
            </Button>
            {hasActiveFilters && (
              <Link
                href="/members"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      {error && (
        <p role="alert" className="rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-surface border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-secondary/40">
              <tr>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Start date
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {hasActiveFilters ? (
                          <SearchX className="h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Users className="h-6 w-6" aria-hidden="true" />
                        )}
                      </div>
                      {hasActiveFilters ? (
                        <>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              No members match your search
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Try a different name or phone number, or clear your filters.
                            </p>
                          </div>
                          <Link href="/members">
                            <Button variant="secondary">Clear filters</Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm font-medium text-foreground">No members yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Add your first member to start tracking attendance and memberships.
                            </p>
                          </div>
                          <Link href="/members/new">
                            <Button variant="primary">
                              <UserPlus className="h-4 w-4" aria-hidden="true" />
                              Add your first member
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-border transition-colors duration-150 hover:bg-secondary/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{member.fullName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{member.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{member.planName ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.membershipStartDate ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.membershipEndDate ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getMemberStatus(member.membershipEndDate)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/members/${member.id}/edit`}
                        aria-label={`Edit ${member.fullName}`}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <DeleteMemberButton memberId={member.id} memberName={member.fullName} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {rangeStart}–{rangeEnd} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildHref({ q, status, page: page - 1 })}
                className="flex items-center gap-1 rounded-control border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </Link>
            ) : (
              <span className="flex cursor-not-allowed items-center gap-1 rounded-control border border-border px-3 py-1.5 text-sm text-muted-foreground/50">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </span>
            )}
            <span className="px-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={buildHref({ q, status, page: page + 1 })}
                className="flex items-center gap-1 rounded-control border border-border px-3 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-secondary"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className="flex cursor-not-allowed items-center gap-1 rounded-control border border-border px-3 py-1.5 text-sm text-muted-foreground/50">
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
