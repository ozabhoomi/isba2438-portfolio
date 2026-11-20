import { loggedJson } from "@/lib/api-log";
import {
  deleteQuestion,
  getQuestionById,
  updateQuestion,
  validateQuestion,
} from "@/lib/questions";

type QuestionRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: QuestionRouteContext) {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    return loggedJson(
      "GET",
      `/api/questions/${id}`,
      { error: `No question with id "${id}".` },
      404
    );
  }

  return loggedJson("GET", `/api/questions/${id}`, { question }, 200);
}

export async function PUT(request: Request, { params }: QuestionRouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return loggedJson(
      "PUT",
      `/api/questions/${id}`,
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateQuestion(body);

  if (!result.ok) {
    return loggedJson(
      "PUT",
      `/api/questions/${id}`,
      { errors: result.errors },
      400
    );
  }

  const question = await updateQuestion(id, result.values);

  if (!question) {
    return loggedJson(
      "PUT",
      `/api/questions/${id}`,
      { error: `No question with id "${id}".` },
      404
    );
  }

  return loggedJson("PUT", `/api/questions/${id}`, { question }, 200);
}

export async function DELETE(
  _request: Request,
  { params }: QuestionRouteContext
) {
  const { id } = await params;
  const deleted = await deleteQuestion(id);

  if (!deleted) {
    return loggedJson(
      "DELETE",
      `/api/questions/${id}`,
      { error: `No question with id "${id}".` },
      404
    );
  }

  return loggedJson("DELETE", `/api/questions/${id}`, { id: deleted.id }, 200);
}
