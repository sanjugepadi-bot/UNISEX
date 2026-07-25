"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-h2 font-semibold text-foreground">Page not found</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Go back
        </Button>
        <Link href="/dashboard">
          <Button type="button" variant="primary">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
