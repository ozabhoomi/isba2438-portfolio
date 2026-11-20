import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { getProjectBySlug } from "@/lib/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project
      ? `${project.title} | Bhoomi Oza`
      : "Project Not Found | Bhoomi Oza",
  };
}

const sectionHeading =
  "text-sm font-semibold uppercase tracking-widest text-aubergine/75";

function Loading() {
  return <p className="text-sm text-aubergine/75">Loading…</p>;
}

async function ProjectContent({ params }: ProjectPageProps) {
  await connection();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="py-16">
      <Link
        href="/projects"
        className="font-mono text-sm text-aubergine/75 hover:underline"
      >
        ← All projects
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        {project.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <p className="text-aubergine/85">{project.context}</p>
        <p className="font-mono text-xs text-aubergine/75">
          {project.date}
        </p>
      </div>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-aubergine/85">
        {project.summary}
      </p>

      {project.sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className={sectionHeading}>{section.heading}</h2>
          {section.body?.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 max-w-2xl leading-7 text-aubergine/85"
            >
              {paragraph}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-aubergine/85 marker:text-aubergine/70">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.stat && (
            <div className="mt-6 inline-flex flex-col rounded-2xl border border-aubergine/10 bg-blush p-8">
              <p className="font-serif text-5xl font-semibold text-saffron">
                {section.stat.value}
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-aubergine/85">
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
            className="rounded-full border border-aubergine/20 bg-blush px-3 py-1 text-xs font-medium text-aubergine"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <Suspense fallback={<Loading />}>
        <ProjectContent params={params} />
      </Suspense>
    </div>
  );
}
