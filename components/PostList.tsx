"use client";

import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blogs";
import usePosts from "@/lib/use-posts";
import BlogCard from "./BlogCard";
import { errorClass } from "./FormUI";

type PostListProps = {
  variant: "public" | "admin";
  refreshKey?: number;
  editingId?: string | null;
  renderActions?: (post: BlogPost) => ReactNode;
};

export default function PostList({
  variant,
  refreshKey = 0,
  editingId = null,
  renderActions,
}: PostListProps) {
  const { posts, listError, loading } = usePosts(refreshKey);
  const marginTop = variant === "public" ? "mt-8" : "mt-4";

  return (
    <>
      {listError && <p className={`${marginTop} ${errorClass}`}>{listError}</p>}
      {loading && !listError && (
        <p className={`${marginTop} text-sm text-aubergine/75`}>Loading…</p>
      )}
      {posts?.length === 0 && (
        <p className={`${marginTop} text-sm text-aubergine/75`}>
          No posts yet.
        </p>
      )}
      {posts && posts.length > 0 && (
        <ul
          className={`${variant === "public" ? "mt-10" : "mt-4"} divide-y divide-aubergine/15`}
        >
          {posts.map((post) => (
            <li
              key={post.id}
              className={`${variant === "public" ? "py-8" : "py-5"} first:pt-0 last:pb-0`}
            >
              <BlogCard
                post={post}
                variant={variant}
                showEditedMarker={
                  variant === "admin" && post.id === editingId
                }
              >
                {renderActions ? renderActions(post) : null}
              </BlogCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
