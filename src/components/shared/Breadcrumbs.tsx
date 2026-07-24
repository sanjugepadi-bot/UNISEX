"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Static route segments this app defines. Dynamic id segments (member ids,
// plan ids, etc.) are intentionally not listed — they're collapsed into a
// single trailing "Details" crumb rather than guessed at, since the shell
// has no per-page metadata to draw a precise label from.
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  members: "Members",
  attendance: "Attendance",
  plans: "Membership Plans",
  calculators: "Calculators",
  "diet-plans": "Diet Plans",
  "workout-plans": "Workout Plans",
  settings: "Settings",
  new: "New",
  edit: "Edit",
  bmi: "BMI",
  bmr: "BMR",
  tdee: "TDEE",
  "daily-calories": "Daily Calories",
  "body-fat": "Body Fat",
  "ideal-weight": "Ideal Weight",
  "lean-body-mass": "Lean Body Mass",
};

interface Crumb {
  label: string;
  href: string | null;
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let href = "";
  let hasUnknownTrailing = false;

  for (const segment of segments) {
    href += `/${segment}`;
    const label = SEGMENT_LABELS[segment];
    if (label) {
      crumbs.push({ label, href });
      hasUnknownTrailing = false;
    } else {
      hasUnknownTrailing = true;
    }
  }

  if (hasUnknownTrailing) {
    crumbs.push({ label: "Details", href: null });
  }

  if (crumbs.length > 0) {
    crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], href: null };
  }

  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-foreground" aria-current="page">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
