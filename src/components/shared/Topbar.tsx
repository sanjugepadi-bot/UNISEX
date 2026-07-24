import { Bell, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface TopbarProps {
  fullName: string | null;
  role: string;
  logoutAction: () => Promise<void>;
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function Topbar({ fullName, role, logoutAction }: TopbarProps) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
      <Breadcrumbs />

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
        {/* Search placeholder — visual only, not yet wired to any search logic */}
        <div className="hidden items-center gap-2 rounded-control border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search…</span>
          <kbd className="ml-2 rounded border border-border bg-surface px-1.5 py-0.5 text-caption text-muted-foreground">
            /
          </kbd>
        </div>

        {/* Notification placeholder — visual only, not yet wired to any data */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
          <span
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger"
            aria-hidden="true"
          />
        </button>

        <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-foreground">{fullName ?? "Account"}</p>
            <p className="text-caption text-muted-foreground">{formatRole(role)}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button type="submit" variant="ghost" aria-label="Log out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
