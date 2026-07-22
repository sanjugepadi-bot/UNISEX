import { checkInAction } from "@/app/(dashboard)/attendance/actions";

interface CheckInButtonProps {
  memberId: string;
  alreadyCheckedIn: boolean;
}

export function CheckInButton({ memberId, alreadyCheckedIn }: CheckInButtonProps) {
  if (alreadyCheckedIn) {
    return <span className="text-xs font-medium text-gray-400">Checked in</span>;
  }

  return (
    <form action={checkInAction}>
      <input type="hidden" name="memberId" value={memberId} />
      <button
        type="submit"
        className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white"
      >
        Check in
      </button>
    </form>
  );
}
