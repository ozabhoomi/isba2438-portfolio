import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import SectionHeading from "@/components/SectionHeading";
import StatCard from "@/components/StatCard";
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
          <SectionHeading>{section.heading}</SectionHeading>
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
            <StatCard
              className="mt-6 inline-flex flex-col"
              labelClassName="mt-2 max-w-xs text-sm leading-6 text-aubergine/85"
              value={section.stat.value}
              label={section.stat.label}
            />
          )}
        </section>
      ))}

      <SectionHeading className="mt-12">Skills</SectionHeading>
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
    <PageContainer>
      <Suspense fallback={<Loading />}>
        <ProjectContent params={params} />
      </Suspense>
    </PageContainer>
  );
}
