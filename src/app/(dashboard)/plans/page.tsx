import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getPlans } from "@/services/membershipPlans";
import { DeletePlanButton } from "./DeletePlanButton";

export const metadata: Metadata = {
  title: "Membership Plans",
};

export default async function PlansPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: plans, error } = await getPlans(profile.gymId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          Membership Plans{" "}
          <span className="text-sm font-normal text-gray-500">{plans?.length ?? 0} total</span>
        </h1>
        <Link
          href="/plans/new"
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Add plan
        </Link>
      </div>

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
              <th className="px-3 py-2 text-left font-medium">Duration</th>
              <th className="px-3 py-2 text-left font-medium">Price</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(!plans || plans.length === 0) && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                  No plans yet.
                </td>
              </tr>
            )}
            {plans?.map((plan) => (
              <tr key={plan.id} className="border-t border-gray-200">
                <td className="px-3 py-2">{plan.planName}</td>
                <td className="px-3 py-2 text-gray-600">{plan.durationDays} days</td>
                <td className="px-3 py-2 text-gray-600">₹{plan.price}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      plan.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/plans/${plan.id}/edit`}
                      className="text-xs font-medium text-gray-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeletePlanButton planId={plan.id} />
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
