import Link from "next/link";
import { CalendarX } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/features/members/components/StatusBadge";
import { getMemberStatus } from "@/lib/memberStatus";
import type { AttendanceRecord } from "@/services/attendance";

interface RecentCheckInsListProps {
  checkIns: AttendanceRecord[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentCheckInsList({ checkIns }: RecentCheckInsListProps) {
  const hasData = checkIns.length > 0;

  return (
    <Card title="Recent check-ins" description="The latest members to check in">
      {hasData ? (
        <ul className="flex flex-col gap-1">
          {checkIns.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3 border-t border-border py-2.5 first:border-t-0 first:pt-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {getInitials(row.memberName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{row.memberName}</p>
                <p className="text-caption text-muted-foreground">
                  {new Date(row.checkInTime).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <StatusBadge status={getMemberStatus(row.membershipEndDate)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarX className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No check-ins yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check-ins will show up here as soon as members start attending.
            </p>
          </div>
          <Link href="/attendance">
            <Button variant="primary">Mark today&apos;s attendance</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
