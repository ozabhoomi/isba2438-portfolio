import { loggedJson } from "@/lib/api-log";
import {
  blogSlugExists,
  createBlogPost,
  getBlogPostsNewestFirst,
  saveBlogPost,
  validateBlogPost,
} from "@/lib/blogs";

export async function GET() {
  const posts = await getBlogPostsNewestFirst();
  return loggedJson(
    "GET",
    "/api/blogs",
    { posts },
    200,
    { "Cache-Control": "no-store" }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return loggedJson(
      "POST",
      "/api/blogs",
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateBlogPost(body);

  if (!result.ok) {
    return loggedJson("POST", "/api/blogs", { errors: result.errors }, 400);
  }

  if (await blogSlugExists(result.slug)) {
    return loggedJson(
      "POST",
      "/api/blogs",
      { error: `A post with slug "${result.slug}" already exists.` },
      409
    );
  }

  const post = createBlogPost(result.values, result.slug);

  try {
    await saveBlogPost(post);
  } catch {
    return loggedJson(
      "POST",
      "/api/blogs",
      { error: "Something went wrong saving your post." },
      500
    );
  }

  return loggedJson("POST", "/api/blogs", { post }, 201);
}
