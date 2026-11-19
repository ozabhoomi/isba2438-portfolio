import { loggedJson } from "@/lib/api-log";
import {
  getContactMessagesNewestFirst,
  saveContactMessage,
  validateContact,
} from "@/lib/contact";

export async function GET() {
  const messages = await getContactMessagesNewestFirst();
  return loggedJson(
    "GET",
    "/api/contact",
    { messages },
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
      "/api/contact",
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const result = validateContact(body);

  if (!result.ok) {
    return loggedJson("POST", "/api/contact", { errors: result.errors }, 400);
  }

  try {
    await saveContactMessage(result.values);
  } catch {
    return loggedJson(
      "POST",
      "/api/contact",
      { error: "Something went wrong saving your message." },
      500
    );
  }

  return loggedJson("POST", "/api/contact", { ok: true }, 201);
}
