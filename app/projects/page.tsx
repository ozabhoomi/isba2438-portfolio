import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import PageContainer from "@/components/PageContainer";
import ProjectCard from "@/components/ProjectCard";
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
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <PageContainer>
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Selected work from internships, competitions, and coursework.
        </p>
        <Suspense fallback={<Loading />}>
          <ProjectsList />
        </Suspense>
      </section>
    </PageContainer>
  );
}
