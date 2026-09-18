"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Cpu,
  FolderKanban,
  Rocket,
} from "lucide-react";
import { OnboardingBanner } from "@/components/onboarding-banner";
import { CostChart } from "@/components/cost-chart";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Card, CardEmpty, CardHeader } from "@/components/ui/card";
import {
  useDashboardStats,
  useUsageSummary,
  useRecentActivity,
} from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    isFetching: statsFetching,
    refetch: refetchStats,
  } = useDashboardStats();
  const {
    data: usage,
    isLoading: usageLoading,
    isError: usageError,
    isFetching: usageFetching,
    refetch: refetchUsage,
  } = useUsageSummary();
  const {
    data: activity,
    isLoading: activityLoading,
    isError: activityError,
    isFetching: activityFetching,
    refetch: refetchActivity,
  } = useRecentActivity();

  return (
    <div>
      <OnboardingBanner />

      <PageHeader
        title="Dashboard"
        description="Everything running across your workspace."
        actions={
          <Link href="/projects/new" className="btn-primary">
            New project
          </Link>
        }
      />

      <div className="space-y-4 md:space-y-5">
          {statsError ? (
            <CardError
              message="Couldn't load workspace stats."
              onRetry={refetchStats}
              retrying={statsFetching}
              standalone
            />
          ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
            <StatTile
              label="Projects"
              value={stats?.total_projects}
              loading={statsLoading}
              href="/projects"
              icon={<FolderKanban className="h-4 w-4" strokeWidth={1.75} />}
            />
            <StatTile
              label="Models"
              value={stats?.total_models}
              loading={statsLoading}
              icon={<Boxes className="h-4 w-4" strokeWidth={1.75} />}
            />
            <StatTile
              label="Active training"
              value={stats?.active_training_jobs}
              loading={statsLoading}
              icon={<Cpu className="h-4 w-4" strokeWidth={1.75} />}
            />
            <StatTile
              label="Deployed"
              value={stats?.deployed_models}
              loading={statsLoading}
              icon={<Rocket className="h-4 w-4" strokeWidth={1.75} />}
            />
          </div>
          )}

          <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader
                title="Usage"
                action={<DetailsLink href="/settings/usage" />}
              />
              {usageError ? (
                <CardError
                  message="Couldn't load usage."
                  onRetry={refetchUsage}
                  retrying={usageFetching}
                />
              ) : usageLoading ? (
                <UsageSkeleton />
              ) : (
                <dl className="divide-y divide-zinc-100 px-5 dark:divide-zinc-800/70">
                  <UsageRow
                    label="Total cost"
                    value={`$${(usage?.total_cost_usd ?? 0).toFixed(2)}`}
                  />
                  <UsageRow
                    label="Tokens in"
                    value={(usage?.total_tokens_in ?? 0).toLocaleString()}
                  />
                  <UsageRow
                    label="Tokens out"
                    value={(usage?.total_tokens_out ?? 0).toLocaleString()}
                  />
                  <UsageRow
                    label="Events"
                    value={(usage?.total_events ?? 0).toLocaleString()}
                  />
                </dl>
              )}
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader
                title="Daily cost"
                description="Last 14 days"
                action={<DetailsLink href="/settings/usage" />}
              />
              {usageError ? (
                <CardError
                  message="Couldn't load daily cost."
                  onRetry={refetchUsage}
                  retrying={usageFetching}
                />
              ) : (
                <div className="px-5 py-4">
                  {usageLoading ? (
                    <div className="h-36 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                  ) : (
                    <CostChart costByDay={usage?.cost_by_day ?? []} />
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title="Recent activity"
                description="Latest changes across projects"
              />
              {activityError ? (
                <CardError
                  message="Couldn't load recent activity."
                  onRetry={refetchActivity}
                  retrying={activityFetching}
                />
              ) : activityLoading ? (
                <CardEmpty>Loading…</CardEmpty>
              ) : !activity?.length ? (
                <CardEmpty>No activity yet. Create a project to get started.</CardEmpty>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {activity.slice(0, 10).map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <ActivityDot action={entry.action} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-zinc-900 dark:text-white">
                          <span className="font-medium">{formatAction(entry.action)}</span>
                          <span className="ml-1.5 text-zinc-500 dark:text-zinc-400">
                            {entry.resource_type}
                          </span>
                        </p>
                        {entry.resource_id && (
                          <p className="truncate font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
                            {entry.resource_id}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                        {formatTimeAgo(entry.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader title="Pipeline" description="Totals across all projects" />
              {statsError ? (
                <CardError
                  message="Couldn't load totals."
                  onRetry={refetchStats}
                  retrying={statsFetching}
                />
              ) : (
              <dl className="divide-y divide-zinc-100 px-5 dark:divide-zinc-800/70">
                <UsageRow
                  label="Documents"
                  value={statsLoading ? "—" : (stats?.total_documents ?? 0).toLocaleString()}
                />
                <UsageRow
                  label="Training jobs"
                  value={statsLoading ? "—" : (stats?.total_training_jobs ?? 0).toLocaleString()}
                />
                <UsageRow
                  label="Evaluations"
                  value={statsLoading ? "—" : (stats?.total_evaluations ?? 0).toLocaleString()}
                />
              </dl>
              )}
            </Card>
          </div>
      </div>
    </div>
  );
}

function CardError({
  message,
  onRetry,
  retrying,
  standalone = false,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
  standalone?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
        standalone ? "card border-red-200/80 dark:border-red-900/50" : ""
      }`}
    >
      <p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <AlertTriangle
          className="h-4 w-4 shrink-0 text-red-500"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="text-xs font-medium text-zinc-700 underline-offset-2 hover:underline disabled:opacity-50 dark:text-zinc-300"
      >
        {retrying ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}

function DetailsLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
    >
      Details
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
    </Link>
  );
}

function UsageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}

function UsageSkeleton() {
  return (
    <div className="space-y-3 px-5 py-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
      ))}
    </div>
  );
}

function ActivityDot({ action }: { action: string }) {
  let color = "bg-zinc-300 dark:bg-zinc-600";
  if (action.startsWith("create")) color = "bg-emerald-500";
  else if (action.startsWith("delete")) color = "bg-red-500";
  else if (action.startsWith("update")) color = "bg-blue-500";
  else if (action.startsWith("deploy")) color = "bg-amber-500";

  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />;
}

function formatAction(action: string): string {
  return action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTimeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(isoDate).toLocaleDateString();
}
