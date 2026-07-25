import Link from "next/link";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-surface border border-dashed border-border bg-surface px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileX className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-h2 font-semibold text-foreground">This item no longer exists</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          The member, plan, or record you&apos;re looking for may have been deleted, or the link
          you followed may be incorrect.
        </p>
      </div>
      <Link href="/dashboard">
        <Button type="button" variant="primary">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
