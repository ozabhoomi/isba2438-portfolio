import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blogs";

type BlogCardProps = {
  post: BlogPost;
  variant: "public" | "admin";
  showEditedMarker?: boolean;
  children?: ReactNode;
};

export default function BlogCard({
  post,
  variant,
  showEditedMarker = false,
  children,
}: BlogCardProps) {
  const truncate = variant === "public" ? 200 : 160;

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        {variant === "public" ? (
          <Link
            href={`/blogs/${post.slug}`}
            className="font-serif text-2xl font-semibold tracking-tight hover:underline decoration-saffron decoration-2 underline-offset-4"
          >
            {post.title}
          </Link>
        ) : (
          <h3 className="font-medium">{post.title}</h3>
        )}
        <p className="font-mono text-xs text-aubergine/75">
          {post.createdAt.slice(0, 10)}
        </p>
      </div>
      {variant === "public" ? (
        post.author && (
          <p className="mt-1 text-sm text-aubergine/75">
            {post.author}
          </p>
        )
      ) : (
        <p className="mt-1 font-mono text-xs text-aubergine/75">
          /blogs/{post.slug}
          {post.author ? ` · ${post.author}` : ""}
          {showEditedMarker ? " · being edited" : ""}
        </p>
      )}
      <p className="mt-2 text-sm leading-6 text-aubergine/85">
        {post.content.length > truncate
          ? `${post.content.slice(0, truncate)}…`
          : post.content}
      </p>
      {variant === "public" ? (
        <Link
          href={`/blogs/${post.slug}`}
          className="mt-3 inline-block text-sm font-medium hover:underline"
        >
          Read post →
        </Link>
      ) : (
        children
      )}
    </>
  );
}
