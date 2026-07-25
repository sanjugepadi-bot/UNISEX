import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Dumbbell, Search, SearchX } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers, type Member } from "@/services/members";

export const metadata: Metadata = {
  title: "Workout Plans",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface WorkoutPlansPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function WorkoutPlansPage({ searchParams }: WorkoutPlansPageProps) {
  const { q } = await searchParams;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  let members: Member[] = [];
  let error: string | null = null;
  if (q) {
    const result = await getMembers({ gymId: profile.gymId, search: q });
    members = result.data?.members ?? [];
    error = result.error;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Dumbbell className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Workout Plans</h1>
          <p className="text-sm text-muted-foreground">
            Search for a member to generate or view their AI-powered workout plans.
          </p>
        </div>
      </div>

      <div className="rounded-surface border border-border bg-surface p-4 shadow-card">
        <form method="get" className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search a member by name or phone"
              className="w-full rounded-control border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-control border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
          >
            Search
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        {q && (
          <div className="mt-4 overflow-hidden rounded-control border border-border">
            {members.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">No members match &quot;{q}&quot;.</p>
              </div>
            ) : (
              members.map((member) => (
                <Link
                  key={member.id}
                  href={`/workout-plans/${member.id}`}
                  className="flex items-center gap-3 border-t border-border px-3 py-2.5 transition-colors duration-150 first:border-t-0 hover:bg-secondary/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {getInitials(member.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.fullName}
                    </p>
                    <p className="text-caption text-muted-foreground">{member.phone}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
