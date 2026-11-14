import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BLOG_LIMITS } from "./limits";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "blogs.json");

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
};

export type BlogInput = { title: string; author: string; content: string };

export type BlogErrors = Partial<Record<"title" | "author" | "content", string>>;

export type BlogValidationResult =
  | { ok: true; values: BlogInput; slug: string }
  | { ok: false; errors: BlogErrors };

export function generateSlug(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, BLOG_LIMITS.slug).replace(/-+$/g, "");
}

export function validateBlogPost(input: unknown): BlogValidationResult {
  const errors: BlogErrors = {};
  const { title, author, content } = (input ?? {}) as Record<string, unknown>;

  const titleValue = typeof title === "string" ? title.trim() : "";
  const authorValue = typeof author === "string" ? author.trim() : "";
  const contentValue = typeof content === "string" ? content.trim() : "";

  if (!titleValue) {
    errors.title = "Title can't be blank.";
  }
  if (!contentValue) {
    errors.content = "Content can't be blank.";
  }

  const slug = generateSlug(titleValue);
  if (titleValue && !slug) {
    errors.title = "Title must include at least one letter or number.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      title: titleValue.slice(0, BLOG_LIMITS.title),
      author: authorValue.slice(0, BLOG_LIMITS.author),
      content: contentValue.slice(0, BLOG_LIMITS.content),
    },
    slug,
  };
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  let content: string | undefined;
  try {
    content = await readFile(dataFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  if (content === undefined) {
    return [];
  }

  const parsed: unknown = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error("data/blogs.json must contain a JSON array.");
  }
  return parsed;
}

export async function blogSlugExists(slug: string): Promise<boolean> {
  const posts = await readBlogPosts();
  return posts.some((post) => post.slug === slug);
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  const posts = await readBlogPosts();
  posts.push(post);
  await writeFile(dataFile, JSON.stringify(posts, null, 2) + "\n", "utf8");
}

export async function getBlogPostsNewestFirst(): Promise<BlogPost[]> {
  const posts = await readBlogPosts();
  return posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      if (a.post.createdAt === b.post.createdAt) {
        return b.index - a.index;
      }
      return a.post.createdAt < b.post.createdAt ? 1 : -1;
    })
    .map((entry) => entry.post);
}
