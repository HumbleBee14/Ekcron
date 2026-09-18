"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  Menu,
  PanelLeft,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Platform";
// After sign-out, send users back to the public marketing site. Falls back to
// the app root (which routes to sign-in) when no marketing URL is configured.
const afterSignOutUrl = process.env.NEXT_PUBLIC_MARKETING_URL || "/";

const COLLAPSE_STORAGE_KEY = "sidebar-collapsed";

type NavLink = { href: string; label: string; icon: LucideIcon };

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings/team", label: "Settings", icon: Settings },
];

/// Settings links point at a sub-route, so match on the top-level section or no
/// settings page would ever highlight.
function isActiveLink(pathname: string, href: string): boolean {
  const section = href.split("/").filter(Boolean)[0];
  return pathname === href || pathname.startsWith(`/${section}/`);
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex min-w-0 items-center gap-2.5"
      aria-label={appName}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-950 dark:bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark-light.svg" alt="" className="h-4 w-4 dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark-dark.svg" alt="" className="hidden h-4 w-4 dark:block" />
      </span>
      {!collapsed && (
        <span className="truncate text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
          {appName}
        </span>
      )}
    </Link>
  );
}

function NavLinks({
  pathname,
  collapsed = false,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5">
      {navLinks.map((link) => {
        const active = isActiveLink(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? link.label : undefined}
            className={`group relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition ${
              collapsed ? "justify-center" : ""
            } ${
              active
                ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-zinc-200/80 dark:bg-white/[0.08] dark:text-white dark:shadow-none dark:ring-white/10"
                : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${
                active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
              }`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {!collapsed && link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 border-t border-zinc-200/80 pt-2.5 dark:border-zinc-800 ${
        collapsed ? "flex-col" : "justify-between"
      }`}
    >
      <UserButton afterSignOutUrl={afterSignOutUrl} />
      <div className={`flex items-center ${collapsed ? "flex-col" : ""}`}>
        <ThemeToggle />
        <NotificationBell direction="up" />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Read after mount: localStorage is unavailable during SSR, so a lazy
  // useState initializer would hydrate with a mismatched sidebar width.
  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    // h-dvh + overflow-hidden confines scrolling to <main> so the sidebar stays
    // fixed instead of scrolling away with the page content.
    <div className="flex h-dvh overflow-hidden bg-white dark:bg-zinc-950">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 flex-col border-r border-zinc-200/80 bg-zinc-50 px-2.5 py-3 transition-[width] duration-200 md:flex dark:border-zinc-800 dark:bg-zinc-900/30 ${
          collapsed ? "w-[3.5rem]" : "w-56"
        }`}
      >
        <div
          className={`mb-4 flex h-9 items-center ${
            collapsed ? "justify-center" : "justify-between pl-1.5"
          }`}
        >
          {!collapsed && <Brand />}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <NavLinks pathname={pathname} collapsed={collapsed} />

        <SidebarFooter collapsed={collapsed} />
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        <Brand />
        <div className="flex items-center gap-1">
          <NotificationBell direction="down" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
            <div className="mb-6 flex items-center justify-between pl-1">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <NavLinks
              pathname={pathname}
              onNavigate={() => setMobileMenuOpen(false)}
            />

            <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <UserButton afterSignOutUrl={afterSignOutUrl} />
              <ThemeToggle />
            </div>
          </aside>
        </>
      )}

      {/* Main content — the only scroll container */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="w-full px-4 py-5 md:px-7 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
