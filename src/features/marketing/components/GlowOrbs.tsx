export function GlowOrbs({ variant = "hero" }: { variant?: "hero" | "section" }) {
  if (variant === "section") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="warrior-animate-drift absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-[100px]" />
        <div className="warrior-animate-float absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-red-600/5 blur-[120px]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="warrior-animate-float absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-red-600/25 blur-[110px]" />
      <div className="warrior-animate-drift absolute right-[10%] top-[30%] h-80 w-80 rounded-full bg-red-500/15 blur-[130px]" />
      <div className="warrior-animate-float absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-red-700/15 blur-[140px]" />
    </div>
  );
}
