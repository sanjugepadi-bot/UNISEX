export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2" role="status">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
