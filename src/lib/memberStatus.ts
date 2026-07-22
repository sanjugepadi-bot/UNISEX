export type MemberStatus = "active" | "expiring" | "expired" | "unknown";

export function getMemberStatus(membershipEndDate: string | null): MemberStatus {
  if (!membershipEndDate) return "unknown";

  const end = new Date(membershipEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "expiring";
  return "active";
}
