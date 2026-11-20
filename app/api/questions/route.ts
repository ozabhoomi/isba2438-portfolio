import { loggedJson } from "@/lib/api-log";
import {
  createQuestion,
  getQuestionsNewestFirst,
  saveQuestion,
  validateQuestion,
} from "@/lib/questions";

export async function GET() {
  const questions = await getQuestionsNewestFirst();
  return loggedJson(
    "GET",
    "/api/questions",
    { questions },
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
      "/api/questions",
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateQuestion(body);

  if (!result.ok) {
    return loggedJson(
      "POST",
      "/api/questions",
      { errors: result.errors },
      400
    );
  }

  const question = createQuestion(result.values);

  try {
    await saveQuestion(question);
  } catch {
    return loggedJson(
      "POST",
      "/api/questions",
      { error: "Something went wrong saving your question." },
      500
    );
  }

  return loggedJson("POST", "/api/questions", { question }, 201);
}
