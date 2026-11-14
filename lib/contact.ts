import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CONTACT_LIMITS } from "./limits";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "messages.json");

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors: ContactErrors;
  formError?: string;
  submittedAt?: number;
};

export type ContactValidationResult =
  | { ok: true; values: ContactInput }
  | { ok: false; errors: ContactErrors };

type StoredMessage = ContactInput & { receivedAt: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s.@]+(\.[^\s.@]+)+$/;

export function validateContact(input: unknown): ContactValidationResult {
  const errors: ContactErrors = {};
  const { name, email, message } = (input ?? {}) as Record<string, unknown>;

  const nameValue = typeof name === "string" ? name.trim() : "";
  const emailValue = typeof email === "string" ? email.trim() : "";
  const messageValue = typeof message === "string" ? message.trim() : "";

  if (!nameValue) {
    errors.name = "Name can't be blank.";
  }
  if (!messageValue) {
    errors.message = "Message can't be blank.";
  }

  if (!emailValue) {
    errors.email = "Email can't be blank.";
  } else if (!EMAIL_PATTERN.test(emailValue)) {
    errors.email =
      "Enter a valid email: exactly one @, something before it, a domain with a dot that has text on both sides, and no spaces.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      name: nameValue.slice(0, CONTACT_LIMITS.name),
      email: emailValue.slice(0, CONTACT_LIMITS.email),
      message: messageValue.slice(0, CONTACT_LIMITS.message),
    },
  };
}

export async function saveContactMessage(values: ContactInput): Promise<void> {
  await mkdir(dataDir, { recursive: true });

  let content: string | undefined;
  try {
    content = await readFile(dataFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  let messages: StoredMessage[] = [];
  if (content !== undefined) {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("data/messages.json must contain a JSON array.");
    }
    messages = parsed;
  }

  messages.push({ ...values, receivedAt: new Date().toISOString() });
  await writeFile(dataFile, JSON.stringify(messages, null, 2) + "\n", "utf8");
}
