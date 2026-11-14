"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/blogs";
import { errorClass, sectionHeadingClass } from "./FormUI";

export default function BlogList({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("list request failed");
        return res.json() as Promise<{ posts?: BlogPost[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setPosts(body.posts ?? []);
        setListError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setListError("Couldn't load posts. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section className="mt-12">
      <h2 className={sectionHeadingClass}>Existing posts</h2>
      {listError && <p className={`mt-4 ${errorClass}`}>{listError}</p>}
      {posts === null && !listError && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Loading…
        </p>
      )}
      {posts?.length === 0 && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No posts yet.
        </p>
      )}
      {posts && posts.length > 0 && (
        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <li key={post.slug} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-medium">{post.title}</h3>
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {post.createdAt.slice(0, 10)}
                </p>
              </div>
                <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  /blogs/{post.slug}
                  {post.author ? ` · ${post.author}` : ""}
                </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {post.content.length > 160
                  ? `${post.content.slice(0, 160)}…`
                  : post.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
