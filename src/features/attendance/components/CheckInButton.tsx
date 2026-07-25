import { Check, CircleAlert } from "lucide-react";
import { checkInAction } from "@/app/(dashboard)/attendance/actions";
import { Button } from "@/components/ui/Button";
import type { MemberStatus } from "@/lib/memberStatus";

interface CheckInButtonProps {
  memberId: string;
  alreadyCheckedIn: boolean;
  status: MemberStatus;
}

export function CheckInButton({ memberId, alreadyCheckedIn, status }: CheckInButtonProps) {
  if (alreadyCheckedIn) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Checked in
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {status === "expired" && (
        <span className="flex items-center gap-1 text-xs font-medium text-danger">
          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Expired
        </span>
      )}
      <form action={checkInAction}>
        <input type="hidden" name="memberId" value={memberId} />
        <Button type="submit" variant="primary" className="!px-3 !py-1.5 !text-xs">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Check in
        </Button>
      </form>
    </div>
  );
}
