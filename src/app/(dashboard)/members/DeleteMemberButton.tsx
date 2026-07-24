"use client";

import { Trash2 } from "lucide-react";
import { deleteMemberAction } from "./actions";

interface DeleteMemberButtonProps {
  memberId: string;
  memberName: string;
}

export function DeleteMemberButton({ memberId, memberName }: DeleteMemberButtonProps) {
  return (
    <form
      action={deleteMemberAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${memberName}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="memberId" value={memberId} />
      <button
        type="submit"
        aria-label={`Delete ${memberName}`}
        title="Delete"
        className="flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-danger-bg hover:text-danger"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
