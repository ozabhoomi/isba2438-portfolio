"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/blogs";
import { errorClass, sectionHeadingClass } from "./FormUI";

type BlogListProps = {
  refreshKey: number;
  editingId: string | null;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
};

const listButtonClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const deleteButtonClass =
  "rounded-full border border-red-600/30 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50";

export default function BlogList({
  refreshKey,
  editingId,
  onEdit,
  onDelete,
}: BlogListProps) {
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
        <p className="mt-4 text-sm text-aubergine/75">
          Loading…
        </p>
      )}
      {posts?.length === 0 && (
        <p className="mt-4 text-sm text-aubergine/75">
          No posts yet.
        </p>
      )}
      {posts && posts.length > 0 && (
        <ul className="mt-4 divide-y divide-aubergine/15">
          {posts.map((post) => (
            <li key={post.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-medium">{post.title}</h3>
                <p className="font-mono text-xs text-aubergine/75">
                  {post.createdAt.slice(0, 10)}
                </p>
              </div>
                <p className="mt-1 font-mono text-xs text-aubergine/75">
                  /blogs/{post.slug}
                  {post.author ? ` · ${post.author}` : ""}
                  {post.id === editingId ? " · being edited" : ""}
                </p>
              <p className="mt-2 text-sm leading-6 text-aubergine/85">
                {post.content.length > 160
                  ? `${post.content.slice(0, 160)}…`
                  : post.content}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(post)}
                  className={listButtonClass}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(post)}
                  className={deleteButtonClass}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
