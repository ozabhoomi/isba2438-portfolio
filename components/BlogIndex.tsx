"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";
import { errorClass } from "./FormUI";

export default function BlogIndex() {
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
  }, []);

  if (listError) {
    return <p className={`mt-8 ${errorClass}`}>{listError}</p>;
  }
  if (posts === null) {
    return (
      <p className="mt-8 text-sm text-aubergine/75">Loading…</p>
    );
  }
  if (posts.length === 0) {
    return (
      <p className="mt-8 text-sm text-aubergine/75">
        No posts yet.
      </p>
    );
  }

  return (
    <ul className="mt-10 divide-y divide-aubergine/15">
      {posts.map((post) => (
        <li key={post.slug} className="py-8 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <Link
              href={`/blogs/${post.slug}`}
              className="font-serif text-2xl font-semibold tracking-tight hover:underline decoration-saffron decoration-2 underline-offset-4"
            >
              {post.title}
            </Link>
            <p className="font-mono text-xs text-aubergine/75">
              {post.createdAt.slice(0, 10)}
            </p>
          </div>
          {post.author && (
            <p className="mt-1 text-sm text-aubergine/75">
              {post.author}
            </p>
          )}
          <p className="mt-2 text-sm leading-6 text-aubergine/85">
            {post.content.length > 200
              ? `${post.content.slice(0, 200)}…`
              : post.content}
          </p>
          <Link
            href={`/blogs/${post.slug}`}
            className="mt-3 inline-block text-sm font-medium hover:underline"
          >
            Read post →
          </Link>
        </li>
      ))}
    </ul>
  );
}
