"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
  { label: "Plans", href: "/plans" },
  { label: "Attendance", href: "/attendance" },
  { label: "Calculators", href: "/calculators" },
  { label: "Diet plans", href: "/diet-plans" },
  { label: "Workout plans", href: "/workout-plans" },
  { label: "Settings", href: "/settings" },
];

interface SidebarProps {
  gymName: string;
}

export function Sidebar({ gymName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[180px] flex-col gap-1 border-r border-gray-200 bg-gray-50 p-3">
      <div className="mb-3 truncate px-2 text-sm font-medium text-gray-900">{gymName}</div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-md px-2 py-2 text-sm ${
                isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
