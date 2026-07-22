import { checkInAction } from "@/app/(dashboard)/attendance/actions";
import type { MemberStatus } from "@/lib/memberStatus";

interface CheckInButtonProps {
  memberId: string;
  alreadyCheckedIn: boolean;
  status: MemberStatus;
}

export function CheckInButton({ memberId, alreadyCheckedIn, status }: CheckInButtonProps) {
  if (alreadyCheckedIn) {
    return <span className="text-xs font-medium text-gray-400">Checked in</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {status === "expired" && (
        <span className="text-xs font-medium text-red-600">Membership expired</span>
      )}
      <form action={checkInAction}>
        <input type="hidden" name="memberId" value={memberId} />
        <button
          type="submit"
          className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white"
        >
          Check in
        </button>
      </form>
    </div>
  );
}
