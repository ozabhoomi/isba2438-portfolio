import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
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
  );
}
