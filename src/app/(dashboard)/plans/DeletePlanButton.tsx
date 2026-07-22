"use client";

import { deletePlanAction } from "./actions";

export function DeletePlanButton({ planId }: { planId: string }) {
  return (
    <form
      action={deletePlanAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this plan? Members on it will keep their dates but lose the plan link.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="planId" value={planId} />
      <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
