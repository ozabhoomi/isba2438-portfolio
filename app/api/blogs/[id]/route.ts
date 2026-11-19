import { loggedJson } from "@/lib/api-log";
import {
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
  validateBlogPost,
} from "@/lib/blogs";

type PostRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: PostRouteContext) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return loggedJson(
      "GET",
      `/api/blogs/${id}`,
      { error: `No post with id "${id}".` },
      404
    );
  }

  return loggedJson("GET", `/api/blogs/${id}`, { post }, 200);
}

export async function PUT(request: Request, { params }: PostRouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return loggedJson(
      "PUT",
      `/api/blogs/${id}`,
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateBlogPost(body);

  if (!result.ok) {
    return loggedJson(
      "PUT",
      `/api/blogs/${id}`,
      { errors: result.errors },
      400
    );
  }

  const post = await updateBlogPost(id, result.values);

  if (!post) {
    return loggedJson(
      "PUT",
      `/api/blogs/${id}`,
      { error: `No post with id "${id}".` },
      404
    );
  }

  return loggedJson("PUT", `/api/blogs/${id}`, { post }, 200);
}

export async function DELETE(_request: Request, { params }: PostRouteContext) {
  const { id } = await params;
  const deleted = await deleteBlogPost(id);

  if (!deleted) {
    return loggedJson(
      "DELETE",
      `/api/blogs/${id}`,
      { error: `No post with id "${id}".` },
      404
    );
  }

  return loggedJson("DELETE", `/api/blogs/${id}`, { id: deleted.id }, 200);
}
