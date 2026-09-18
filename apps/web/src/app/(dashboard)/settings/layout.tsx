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
    <div className="md:grid md:grid-cols-[11rem_1fr] md:gap-10">
      <aside className="mb-6 md:mb-0">
        <p className="kicker mb-3 hidden md:block">Settings</p>
        <nav
          className="-mx-4 flex gap-1 overflow-x-auto border-b border-zinc-200 px-4 md:mx-0 md:flex-col md:gap-0.5 md:border-0 md:px-0 dark:border-zinc-800"
          aria-label="Settings sections"
        >
          {visibleTabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap border-b-2 px-1 py-2 text-[13px] font-medium transition md:rounded-md md:border-0 md:px-2.5 md:py-1.5 ${
                  active
                    ? "border-violet-500 text-zinc-900 md:bg-zinc-100 dark:text-white dark:md:bg-white/[0.06]"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 md:hover:bg-zinc-100/70 dark:text-zinc-400 dark:hover:text-white dark:md:hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
