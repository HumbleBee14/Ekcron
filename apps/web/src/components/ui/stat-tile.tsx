import Link from "next/link";
import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  loading = false,
  href,
  icon,
  hint,
}: {
  label: string;
  value?: number | string;
  loading?: boolean;
  href?: string;
  icon?: ReactNode;
  hint?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">{label}</p>
        {icon && <span className="text-zinc-400 dark:text-zinc-600">{icon}</span>}
      </div>
      <p className="stat-value mt-3">
        {loading ? (
          <span className="inline-block h-7 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        ) : typeof value === "number" ? (
          value.toLocaleString()
        ) : (
          value ?? "0"
        )}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>}
    </>
  );
  const cls = "card block p-4";
  if (href) {
    return (
      <Link
        href={href}
        className={`${cls} transition hover:border-zinc-300 hover:shadow-sm dark:hover:border-zinc-700`}
      >
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}
