export type SubmitJsonResult<TErrors> =
  | { kind: "created" }
  | { kind: "invalid"; errors: TErrors }
  | { kind: "failed"; message: string };

const NETWORK_ERROR_MESSAGE =
  "Couldn't reach the server. Check your connection and try again.";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export async function submitJson<TErrors>(
  url: string,
  payload: unknown
): Promise<SubmitJsonResult<TErrors>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { kind: "failed", message: NETWORK_ERROR_MESSAGE };
  }

  const body = (await response.json().catch(() => null)) as
    | { errors?: TErrors; error?: string }
    | null;

  if (response.status === 201) {
    return { kind: "created" };
  }
  if (response.status === 400 && body?.errors) {
    return { kind: "invalid", errors: body.errors };
  }
  return { kind: "failed", message: body?.error ?? DEFAULT_ERROR_MESSAGE };
}

export type SendJsonResult<TErrors> =
  | { kind: "ok"; body: unknown }
  | { kind: "invalid"; errors: TErrors }
  | { kind: "notFound"; message: string }
  | { kind: "failed"; message: string };

const NOT_FOUND_MESSAGE = "This post no longer exists.";

export async function sendJson<TErrors>(
  method: "PUT" | "DELETE",
  url: string,
  payload?: unknown
): Promise<SendJsonResult<TErrors>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers:
        payload === undefined
          ? undefined
          : { "Content-Type": "application/json" },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
  } catch {
    return { kind: "failed", message: NETWORK_ERROR_MESSAGE };
  }

  const body = (await response.json().catch(() => null)) as
    | { errors?: TErrors; error?: string }
    | null;

  if (response.status === 400 && body?.errors) {
    return { kind: "invalid", errors: body.errors };
  }
  if (response.status === 404) {
    return { kind: "notFound", message: body?.error ?? NOT_FOUND_MESSAGE };
  }
  if (response.ok) {
    return { kind: "ok", body };
  }
  return { kind: "failed", message: body?.error ?? DEFAULT_ERROR_MESSAGE };
}
