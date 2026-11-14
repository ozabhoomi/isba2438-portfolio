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
