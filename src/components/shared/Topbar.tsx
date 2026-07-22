import { Button } from "@/components/ui/Button";

interface TopbarProps {
  fullName: string | null;
  logoutAction: () => Promise<void>;
}

export function Topbar({ fullName, logoutAction }: TopbarProps) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <p className="text-base font-medium text-gray-900">
        Good morning{fullName ? `, ${fullName.split(" ")[0]}` : ""}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
          {initials}
        </div>
        <form action={logoutAction}>
          <Button type="submit">Log out</Button>
        </form>
      </div>
    </header>
  );
}
