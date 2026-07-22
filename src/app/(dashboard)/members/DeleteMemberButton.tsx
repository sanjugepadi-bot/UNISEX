"use client";

import { deleteMemberAction } from "./actions";

export function DeleteMemberButton({ memberId }: { memberId: string }) {
  return (
    <form
      action={deleteMemberAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this member? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="memberId" value={memberId} />
      <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
