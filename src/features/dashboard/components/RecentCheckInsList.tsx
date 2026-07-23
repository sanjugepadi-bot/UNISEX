import { Card } from "@/components/ui/Card";
import type { AttendanceRecord } from "@/services/attendance";

interface RecentCheckInsListProps {
  checkIns: AttendanceRecord[];
}

export function RecentCheckInsList({ checkIns }: RecentCheckInsListProps) {
  return (
    <Card title="Recent check-ins">
      {checkIns.length === 0 ? (
        <p className="text-sm text-gray-500">No check-ins yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {checkIns.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0 last:pb-0"
            >
              <span className="text-gray-700">{row.memberName}</span>
              <span className="text-gray-500">
                {new Date(row.checkInTime).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
