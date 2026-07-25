export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3" role="status">
      <div
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary"
        aria-hidden="true"
      />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Loading</p>
        <p className="text-xs text-muted-foreground">Just a moment…</p>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
