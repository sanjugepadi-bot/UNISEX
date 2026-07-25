import { RefreshCw } from "lucide-react";
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
      <Button type="submit" variant="secondary">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Regenerate
      </Button>
    </form>
  );
}
