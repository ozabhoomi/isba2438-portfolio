import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project
      ? `${project.title} | Bhoomi Oza`
      : "Project Not Found | Bhoomi Oza",
  };
}

const sectionHeading =
  "text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <article className="py-16">
        <Link
          href="/projects"
          className="font-mono text-sm text-zinc-500 hover:underline dark:text-zinc-400"
        >
          ← All projects
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <p className="text-zinc-600 dark:text-zinc-400">{project.context}</p>
          <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {project.date}
          </p>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {project.summary}
        </p>

        {project.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className={sectionHeading}>{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 marker:text-zinc-400 dark:text-zinc-400">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {section.stat && (
              <div className="mt-6 inline-flex flex-col rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <p className="font-mono text-5xl font-semibold">
                  {section.stat.value}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {section.stat.label}
                </p>
              </div>
            )}
          </section>
        ))}

        <h2 className={`mt-12 ${sectionHeading}`}>Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
