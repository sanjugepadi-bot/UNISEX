"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PlanDistributionListProps {
  distribution: { planName: string; memberCount: number }[];
}

const CHART_COLORS = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-danger)",
  "#8b5cf6",
  "#0ea5e9",
];

export function PlanDistributionList({ distribution }: PlanDistributionListProps) {
  const hasData = distribution.length > 0;

  return (
    <Card title="Plan distribution" description="Members grouped by membership plan">
      {hasData ? (
        <>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="memberCount"
                  nameKey="planName"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={entry.planName} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "var(--color-border)",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {distribution.map((row, index) => (
              <li
                key={row.planName}
                className="flex items-center justify-between border-t border-border pt-2 text-sm first:border-t-0 first:pt-0"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    aria-hidden="true"
                  />
                  {row.planName}
                </span>
                <span className="font-medium text-foreground">{row.memberCount}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChartPie className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No plan distribution yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once you create membership plans and assign them to members, you&apos;ll see the
              breakdown here.
            </p>
          </div>
          <Link href="/plans/new">
            <Button variant="primary">Create your first membership plan</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
