"use client";

import { AlertTriangle } from "lucide-react";

/**
 * Quiet inline failure notice. A request that did not come back is not an
 * emergency, so this reads like a status line with a retry, not an alarm.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  isRetrying = false,
  compact = false,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      className={`card flex flex-wrap items-center gap-4 ${compact ? "px-4 py-3" : "px-5 py-4"}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <AlertTriangle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{title}</p>
        {message && (
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400 break-words">{message}</p>
        )}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="btn-secondary shrink-0 !py-1.5"
        >
          {isRetrying ? "Retrying…" : "Try again"}
        </button>
      )}
    </div>
  );
}
