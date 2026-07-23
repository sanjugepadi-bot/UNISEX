import { Button } from "@/components/ui/Button";
import { regenerateDietPlanAction } from "./actions";

interface RegenerateButtonProps {
  planId: string;
  memberId: string;
}

export function RegenerateButton({ planId, memberId }: RegenerateButtonProps) {
  return (
    <form action={regenerateDietPlanAction}>
      <input type="hidden" name="planId" value={planId} />
      <input type="hidden" name="memberId" value={memberId} />
      <Button type="submit">Regenerate</Button>
    </form>
  );
}
