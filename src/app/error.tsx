"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-h2 font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, or come back later if the problem
          continues.
        </p>
      </div>
      <Button type="button" variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
