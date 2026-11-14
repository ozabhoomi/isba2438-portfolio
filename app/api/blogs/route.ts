import {
  blogSlugExists,
  getBlogPostsNewestFirst,
  saveBlogPost,
  validateBlogPost,
  type BlogPost,
} from "@/lib/blogs";

export async function GET() {
  const posts = await getBlogPostsNewestFirst();
  return Response.json(
    { posts },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const result = validateBlogPost(body);

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  if (await blogSlugExists(result.slug)) {
    return Response.json(
      { error: `A post with slug "${result.slug}" already exists.` },
      { status: 409 }
    );
  }

  const post: BlogPost = {
    slug: result.slug,
    title: result.values.title,
    author: result.values.author,
    content: result.values.content,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveBlogPost(post);
  } catch {
    return Response.json(
      { error: "Something went wrong saving your post." },
      { status: 500 }
    );
  }

  return Response.json({ post }, { status: 201 });
}
