"use client";

import Link from "next/link";
import { ArrowUpRight, FolderPlus } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProjectsPage() {
  const { data, isLoading, isError, isFetching, refetch } = useProjects();
  const projects = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Each project holds its documents, datasets, runs and models."
        actions={
          <Link href="/projects/new" className="btn-primary">
            New project
          </Link>
        }
      />

      {isError ? (
        <ErrorState
          title="Couldn't load your projects"
          message="We couldn't reach the projects service. Your data is safe — please try again."
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card h-36 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderPlus className="h-5 w-5" strokeWidth={1.75} />}
          title="No projects yet"
          description="Create a project, upload a few documents, and run the pipeline end to end."
          action={
            <Link href="/projects/new" className="btn-primary">
              Create your first project
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card group flex flex-col p-5 transition hover:border-zinc-300 hover:shadow-sm dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="truncate text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {project.name}
                </h3>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-600 dark:text-zinc-700 dark:group-hover:text-zinc-300"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-zinc-500 dark:text-zinc-400">
                {project.description || "No description"}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800/70">
                {project.task_type ? (
                  <span className="badge badge-neutral">{project.task_type}</span>
                ) : (
                  <span />
                )}
                <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-600">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
