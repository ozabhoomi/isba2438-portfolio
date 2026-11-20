import { loggedJson } from "@/lib/api-log";
import {
  deleteProject,
  getProjectById,
  updateProject,
  validateProject,
} from "@/lib/projects";

type ProjectRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: ProjectRouteContext) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return loggedJson(
      "GET",
      `/api/projects/${id}`,
      { error: `No project with id "${id}".` },
      404
    );
  }

  return loggedJson("GET", `/api/projects/${id}`, { project }, 200);
}

export async function PUT(request: Request, { params }: ProjectRouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return loggedJson(
      "PUT",
      `/api/projects/${id}`,
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateProject(body);

  if (!result.ok) {
    return loggedJson(
      "PUT",
      `/api/projects/${id}`,
      { errors: result.errors },
      400
    );
  }

  const project = await updateProject(id, result.values);

  if (!project) {
    return loggedJson(
      "PUT",
      `/api/projects/${id}`,
      { error: `No project with id "${id}".` },
      404
    );
  }

  return loggedJson("PUT", `/api/projects/${id}`, { project }, 200);
}

export async function DELETE(_request: Request, { params }: ProjectRouteContext) {
  const { id } = await params;
  const deleted = await deleteProject(id);

  if (!deleted) {
    return loggedJson(
      "DELETE",
      `/api/projects/${id}`,
      { error: `No project with id "${id}".` },
      404
    );
  }

  return loggedJson("DELETE", `/api/projects/${id}`, { id: deleted.id }, 200);
}
