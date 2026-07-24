import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMembers, type Member } from "@/services/members";

export const metadata: Metadata = {
  title: "Workout Plans",
};

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
    <div>
      <h1 className="mb-4 text-lg font-medium text-gray-900">Workout Plans</h1>

      <form method="get" className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search a member to generate or view their workout plans"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {q && (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {members.length === 0 && (
            <div className="px-3 py-4 text-sm text-gray-500">
              No members match &quot;{q}&quot;.
            </div>
          )}
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/workout-plans/${member.id}`}
              className="flex items-center justify-between border-t border-gray-200 px-3 py-2 text-sm first:border-t-0 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{member.fullName}</span>
              <span className="text-gray-500">{member.phone}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
