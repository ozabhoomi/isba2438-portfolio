import { saveContactMessage, validateContact } from "@/lib/contact";

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

  const result = validateContact(body);

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  try {
    await saveContactMessage(result.values);
  } catch {
    return Response.json(
      { error: "Something went wrong saving your message." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
