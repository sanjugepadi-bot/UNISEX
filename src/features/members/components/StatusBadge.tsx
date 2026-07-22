import type { MemberStatus } from "@/lib/memberStatus";

const STYLES: Record<MemberStatus, string> = {
  active: "bg-green-50 text-green-700",
  expiring: "bg-amber-50 text-amber-700",
  expired: "bg-red-50 text-red-700",
  unknown: "bg-gray-100 text-gray-600",
};

const LABELS: Record<MemberStatus, string> = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
  unknown: "No dates",
};

export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
