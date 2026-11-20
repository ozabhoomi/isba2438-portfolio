import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects | Bhoomi Oza",
};

function Loading() {
  return <p className="mt-10 text-sm text-aubergine/75">Loading…</p>;
}

async function ProjectsList() {
  await connection();
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <p className="mt-10 text-sm text-aubergine/75">No projects yet.</p>
    );
  }

  return (
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
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Selected work from internships, competitions, and coursework.
        </p>
        <Suspense fallback={<Loading />}>
          <ProjectsList />
        </Suspense>
      </section>
    </div>
  );
}
