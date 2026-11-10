import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-24 text-center">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Project not found
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          That project doesn&apos;t exist. It may have been moved or renamed.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Back to projects
        </Link>
      </section>
    </div>
  );
}
