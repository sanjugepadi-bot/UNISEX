import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Layers, CircleCheck, CircleX, IndianRupee, Pencil, CreditCard } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getPlans } from "@/services/membershipPlans";
import { StatTile } from "@/components/ui/StatTile";
import { Button } from "@/components/ui/Button";
import { DeletePlanButton } from "./DeletePlanButton";

export const metadata: Metadata = {
  title: "Membership Plans",
};

export default async function PlansPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data, error } = await getPlans(profile.gymId);
  const plans = data ?? [];

  // Derived purely from `plans`, already loaded above — no new queries.
  const activeCount = plans.filter((plan) => plan.isActive).length;
  const inactiveCount = plans.length - activeCount;
  const averagePrice =
    plans.length > 0 ? plans.reduce((sum, plan) => sum + plan.price, 0) / plans.length : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Membership Plans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage the membership plans members can be enrolled in.
          </p>
        </div>
        <Link href="/plans/new">
          <Button variant="primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total plans" value={plans.length} icon={Layers} />
        <StatTile label="Active plans" value={activeCount} icon={CircleCheck} tone="success" />
        <StatTile label="Inactive plans" value={inactiveCount} icon={CircleX} />
        <StatTile
          label="Average price"
          value={`₹${averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={IndianRupee}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
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
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  Price
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
              {plans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CreditCard className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">No plans yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Create your first membership plan to start enrolling members.
                        </p>
                      </div>
                      <Link href="/plans/new">
                        <Button variant="primary">
                          <Plus className="h-4 w-4" aria-hidden="true" />
                          Add your first plan
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-t border-border transition-colors duration-150 hover:bg-secondary/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{plan.planName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{plan.durationDays} days</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    ₹{plan.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium ${
                        plan.isActive
                          ? "bg-success-bg text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/plans/${plan.id}/edit`}
                        aria-label={`Edit ${plan.planName}`}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <DeletePlanButton planId={plan.id} planName={plan.planName} />
                    </div>
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
