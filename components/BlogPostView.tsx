"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";
import { errorClass } from "./FormUI";

export default function BlogPostView({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("post request failed");
        return res.json() as Promise<{ posts?: BlogPost[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setPost((body.posts ?? []).find((p) => p.slug === slug) ?? null);
        setLoadError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Couldn't load this post. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loadError) {
    return <p className={errorClass}>{loadError}</p>;
  }
  if (post === undefined) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
    );
  }
  if (post === null) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Post not found
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          That post doesn&apos;t exist. It may not have been created yet.
        </p>
        <Link
          href="/blogs"
          className="mt-8 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/blogs"
        className="font-mono text-sm text-zinc-500 hover:underline dark:text-zinc-400"
      >
        ← All posts
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        {post.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {post.createdAt.slice(0, 10)}
        {post.author ? ` · ${post.author}` : ""}
      </p>
      <p className="mt-8 max-w-2xl whitespace-pre-wrap leading-7 text-zinc-600 dark:text-zinc-400">
        {post.content}
      </p>
    </div>
  );
}
