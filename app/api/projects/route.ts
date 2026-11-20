import { loggedJson } from "@/lib/api-log";
import {
  createProject,
  getProjects,
  projectSlugExists,
  saveProject,
  validateProject,
} from "@/lib/projects";

export async function GET() {
  const projects = await getProjects();
  return loggedJson(
    "GET",
    "/api/projects",
    { projects },
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
      "/api/projects",
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateProject(body);

  if (!result.ok) {
    return loggedJson("POST", "/api/projects", { errors: result.errors }, 400);
  }

  if (await projectSlugExists(result.slug)) {
    return loggedJson(
      "POST",
      "/api/projects",
      { error: `A project with slug "${result.slug}" already exists.` },
      409
    );
  }

  const project = createProject(result.values, result.slug);

  try {
    await saveProject(project);
  } catch {
    return loggedJson(
      "POST",
      "/api/projects",
      { error: "Something went wrong saving your project." },
      500
    );
  }

  return loggedJson("POST", "/api/projects", { project }, 201);
}
