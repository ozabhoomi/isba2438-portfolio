import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects | Bhoomi Oza",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Selected work from internships, competitions, and coursework.
        </p>
        <div className="mt-10 flex flex-col gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
              className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-medium">{project.title}</h2>
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {project.date}
                </p>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {project.context}
              </p>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {project.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
