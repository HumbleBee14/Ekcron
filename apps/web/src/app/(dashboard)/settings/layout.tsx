"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-team";

const tabs = [
  { label: "Team", href: "/settings/team" },
  { label: "LLM Provider", href: "/settings/llm" },
  { label: "Billing", href: "/settings/billing" },
  { label: "Usage", href: "/settings/usage" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Inference", href: "/settings/inference" },
  { label: "Admin Config", href: "/settings/admin", adminOnly: true },
  { label: "Audit Log", href: "/settings/audit-log" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAdmin } = useCurrentRole();
  const visibleTabs = tabs.filter((tab) => !tab.adminOnly || isAdmin);

  return (
    <div className="card overflow-hidden md:grid md:min-h-[32rem] md:grid-cols-[12.5rem_1fr]">
      <nav
        className="flex gap-1 overflow-x-auto border-b border-zinc-200/80 bg-zinc-50/80 px-2 py-2 md:flex-col md:gap-0.5 md:border-b-0 md:border-r md:p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        aria-label="Settings sections"
      >
        {visibleTabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                active
                  ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-zinc-200/80 dark:bg-white/[0.08] dark:text-white dark:ring-white/10"
                  : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="min-w-0 p-5 md:p-8">{children}</div>
    </div>
  );
}
