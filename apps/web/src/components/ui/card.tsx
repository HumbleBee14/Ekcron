import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card-header">
      <div className="min-w-0">
        <h2 className="card-title">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
      {children}
    </div>
  );
}
