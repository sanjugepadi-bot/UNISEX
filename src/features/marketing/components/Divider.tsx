export function Divider() {
  return (
    <div className="relative h-px w-full overflow-visible bg-white/10" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-[0_0_20px_4px_rgba(220,38,38,0.6)]" />
      <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
    </div>
  );
}
