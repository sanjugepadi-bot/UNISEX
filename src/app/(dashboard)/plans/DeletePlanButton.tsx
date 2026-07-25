"use client";

import { Trash2 } from "lucide-react";
import { deletePlanAction } from "./actions";

interface DeletePlanButtonProps {
  planId: string;
  planName: string;
}

export function DeletePlanButton({ planId, planName }: DeletePlanButtonProps) {
  return (
    <form
      action={deletePlanAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete ${planName}? Members on it will keep their dates but lose the plan link.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="planId" value={planId} />
      <button
        type="submit"
        aria-label={`Delete ${planName}`}
        title="Delete"
        className="flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-danger-bg hover:text-danger"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
