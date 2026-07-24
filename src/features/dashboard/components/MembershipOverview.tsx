"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartNoAxesColumn } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface MembershipOverviewProps {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  expiredMembers: number;
}

export function MembershipOverview({
  totalMembers,
  activeMembers,
  expiringSoonMembers,
  expiredMembers,
}: MembershipOverviewProps) {
  const hasData = totalMembers > 0;

  // Members with no membership end date on file aren't counted in any of the
  // three tracked buckets above — derived (not invented) from totals already
  // returned by getDashboardStats.
  const unassigned = Math.max(0, totalMembers - activeMembers - expiringSoonMembers - expiredMembers);

  const data = [
    { label: "Active", count: activeMembers, color: "var(--color-success)" },
    { label: "Expiring", count: expiringSoonMembers, color: "var(--color-warning)" },
    { label: "Expired", count: expiredMembers, color: "var(--color-danger)" },
    ...(unassigned > 0
      ? [{ label: "No dates set", count: unassigned, color: "var(--color-muted-foreground)" }]
      : []),
  ];

  return (
    <Card title="Membership overview" description="Active, expiring, and expired members">
      {hasData ? (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                stroke="var(--color-border)"
              />
              <YAxis
                type="category"
                dataKey="label"
                width={84}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                stroke="var(--color-border)"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "var(--color-border)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChartNoAxesColumn className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No membership data yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add members to see an overview of active, expiring, and expired memberships.
            </p>
          </div>
          <Link href="/members/new">
            <Button variant="primary">Add your first member</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
