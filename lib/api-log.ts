export function loggedJson(
  method: string,
  route: string,
  body: unknown,
  status: number,
  headers?: HeadersInit
): Response {
  console.log(`[api] ${method} ${route} ${status}`);
  return Response.json(body, { status, headers });
}
