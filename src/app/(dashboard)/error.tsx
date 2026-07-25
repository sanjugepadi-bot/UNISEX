"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-surface border border-dashed border-border bg-surface px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-h2 font-semibold text-foreground">This section ran into a problem</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          Only this page was affected — your session is still active. Try again, or use the
          sidebar to navigate elsewhere.
        </p>
      </div>
      <Button type="button" variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
