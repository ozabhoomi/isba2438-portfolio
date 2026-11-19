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
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Selected work from internships, competitions, and coursework.
        </p>
        <div className="mt-10 flex flex-col gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
              className="flex flex-col gap-2 rounded-xl border border-aubergine/15 p-6 transition-colors hover:border-saffron"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-medium">{project.title}</h2>
                <p className="font-mono text-xs text-aubergine/75">
                  {project.date}
                </p>
              </div>
              <p className="text-sm text-aubergine/75">
                {project.context}
              </p>
              <p className="text-sm leading-6 text-aubergine/85">
                {project.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
