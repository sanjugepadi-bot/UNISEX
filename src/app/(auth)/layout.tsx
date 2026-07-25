import { ReactNode } from "react";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-primary text-primary-foreground">
          <Dumbbell className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-foreground">AI Gym SaaS</span>
      </div>
      {children}
    </main>
  );
}
