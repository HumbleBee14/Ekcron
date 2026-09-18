import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  above,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  above?: ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8">
      {above}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="page-heading truncate">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
