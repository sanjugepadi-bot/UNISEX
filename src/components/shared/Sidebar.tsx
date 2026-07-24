"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Utensils,
  Calculator,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "People",
    items: [
      { label: "Members", href: "/members", icon: Users },
      { label: "Attendance", href: "/attendance", icon: CalendarCheck },
    ],
  },
  {
    label: "Programs",
    items: [
      { label: "Plans", href: "/plans", icon: CreditCard },
      { label: "Workout plans", href: "/workout-plans", icon: Dumbbell },
      { label: "Diet plans", href: "/diet-plans", icon: Utensils },
      { label: "Calculators", href: "/calculators", icon: Calculator },
    ],
  },
  {
    label: "Workspace",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];

interface SidebarProps {
  gymName: string;
}

export function Sidebar({ gymName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="px-4 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-foreground">AI Gym SaaS</span>
        </div>
        <p className="mt-3 truncate text-xs font-medium text-muted-foreground">{gymName}</p>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-4 first:mt-0">
            <p className="mb-1 px-2.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground/70">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-r-control border-l-2 py-2 pl-2.5 pr-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
