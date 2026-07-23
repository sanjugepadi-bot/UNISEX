import { Button } from "@/components/ui/Button";
import { regenerateWorkoutPlanAction } from "./actions";

interface RegenerateButtonProps {
  planId: string;
  memberId: string;
}

export function RegenerateButton({ planId, memberId }: RegenerateButtonProps) {
  return (
    <form action={regenerateWorkoutPlanAction}>
      <input type="hidden" name="planId" value={planId} />
      <input type="hidden" name="memberId" value={memberId} />
      <Button type="submit">Regenerate</Button>
    </form>
  );
}
