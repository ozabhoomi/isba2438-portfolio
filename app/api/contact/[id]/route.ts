import { loggedJson } from "@/lib/api-log";
import {
  deleteContactMessage,
  getContactMessageById,
  updateContactMessage,
  validateContact,
  type ContactStatus,
} from "@/lib/contact";

type MessageRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: MessageRouteContext) {
  const { id } = await params;
  const message = await getContactMessageById(id);

  if (!message) {
    return loggedJson(
      "GET",
      `/api/contact/${id}`,
      { error: `No message with id "${id}".` },
      404
    );
  }

  return loggedJson("GET", `/api/contact/${id}`, { message }, 200);
}

export async function PUT(request: Request, { params }: MessageRouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return loggedJson(
      "PUT",
      `/api/contact/${id}`,
      { error: "Request body must be valid JSON." },
      400
    );
  }

  const rawStatus = (body as { status?: unknown } | null)?.status;
  let status: ContactStatus | undefined;
  if (rawStatus === "new" || rawStatus === "handled") {
    status = rawStatus;
  } else if (rawStatus !== undefined) {
    return loggedJson(
      "PUT",
      `/api/contact/${id}`,
      { error: "Status must be \"new\" or \"handled\"." },
      400
    );
  }

  const result = validateContact(body);

  if (!result.ok) {
    return loggedJson(
      "PUT",
      `/api/contact/${id}`,
      { errors: result.errors },
      400
    );
  }

  const current = await getContactMessageById(id);

  if (!current) {
    return loggedJson(
      "PUT",
      `/api/contact/${id}`,
      { error: `No message with id "${id}".` },
      404
    );
  }

  const message = await updateContactMessage(
    id,
    result.values,
    status ?? current.status
  );

  if (!message) {
    return loggedJson(
      "PUT",
      `/api/contact/${id}`,
      { error: `No message with id "${id}".` },
      404
    );
  }

  return loggedJson("PUT", `/api/contact/${id}`, { message }, 200);
}

export async function DELETE(_request: Request, { params }: MessageRouteContext) {
  const { id } = await params;
  const deleted = await deleteContactMessage(id);

  if (!deleted) {
    return loggedJson(
      "DELETE",
      `/api/contact/${id}`,
      { error: `No message with id "${id}".` },
      404
    );
  }

  return loggedJson("DELETE", `/api/contact/${id}`, { id: deleted.id }, 200);
}
