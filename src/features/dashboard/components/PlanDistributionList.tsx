import { Card } from "@/components/ui/Card";

interface PlanDistributionListProps {
  distribution: { planName: string; memberCount: number }[];
}

export function PlanDistributionList({ distribution }: PlanDistributionListProps) {
  return (
    <Card title="Plan distribution">
      {distribution.length === 0 ? (
        <p className="text-sm text-gray-500">No members assigned to a plan yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {distribution.map((row) => (
            <li
              key={row.planName}
              className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0 last:pb-0"
            >
              <span className="text-gray-700">{row.planName}</span>
              <span className="font-medium text-gray-900">{row.memberCount}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
