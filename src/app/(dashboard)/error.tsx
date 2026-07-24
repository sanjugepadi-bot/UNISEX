"use client";

import { useEffect } from "react";
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
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 px-4 py-16 text-center">
      <h1 className="text-lg font-medium text-gray-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-600">
        This page ran into a problem. Your session is still active — you can try again or
        navigate elsewhere using the sidebar.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
